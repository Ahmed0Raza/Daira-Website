import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import RegistrationAgent from '../modals/registrationAgent-Model.js';
import Ambassador from '../modals/ambassador-model.js';
import User from '../modals/user-model.js';
import Team from '../modals/team-model.js';
import Events from '../modals/Event-Model.js';
import Registration from '../modals/registeration-model.js';
import Participant from '../modals/participant-model.js';
import Invoice from '../modals/invoice-modal.js';
import Agent from '../modals/registrationAgent-Model.js';
import Event from '../modals/Event-Model.js';
import {
  createCardsString,
  generateSId,
  isIdPresent,
  updateEventName,
} from '../utilities/cardsProvider.js';
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = '1d';
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await RegistrationAgent.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );
    res
      .status(200)
      .json({ result: token, id: existingUser._id, name: existingUser.name });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const verifyToken = async (req, res) => {
  const token = req.headers.authorization;
  const decodedData = jwt.verify(token, JWT_SECRET);
  try {
    const existingUser = await RegistrationAgent.findOne({
      email: decodedData.email,
    });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ result: true });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};
const getApprovedParticipantDetails = async (req, res) => {
  try {
    // Step 1: Get approved registrations and extract team IDs
    const approvedRegistrations = await Registration.find({ approved: true }).select('teamId');
    const approvedTeamIds = approvedRegistrations.map((reg) => reg.teamId.toString());

    // Step 2: Get teams with those IDs and include name + participants
    const teams = await Team.find({ _id: { $in: approvedTeamIds } }).select('name participants');

    // Step 3: Create a mapping of participantId -> set of team names
    const participantTeamMap = new Map();

    teams.forEach((team) => {
      const teamName = team.name;
      team.participants.forEach((participantId) => {
        const idStr = participantId.toString();
        if (!participantTeamMap.has(idStr)) {
          participantTeamMap.set(idStr, new Set());
        }
        participantTeamMap.get(idStr).add(teamName);
      });
    });

    // Step 4: Get unique participant IDs
    const uniqueParticipantIds = Array.from(participantTeamMap.keys());

    // Step 5: Fetch participant details
    const participants = await Participant.find({ _id: { $in: uniqueParticipantIds } })
      .select('name cnic contactNumber gender');

    // Step 6: Attach team names to each participant
    const enrichedParticipants = participants.map((participant) => {
      const idStr = participant._id.toString();
      const teamNames = Array.from(participantTeamMap.get(idStr) || []);
      return {
        ...participant.toObject(),
        teams: teamNames,
      };
    });

    res.status(200).json(enrichedParticipants);
  } catch (error) {
    console.error('Error in getApprovedParticipantDetails:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getRegisterationAgentStats = async (req, res) => {
  try {
    // Count approved and unapproved teams
    const approvedTeams = await Registration.countDocuments({ approved: true });
    const unapprovedTeams = await Registration.countDocuments({
      approved: false,
    });

    // Get approved registrations
    const approvedRegistrations = await Registration.find({ approved: true });

    // Extract approved team IDs
    const approvedTeamIds = approvedRegistrations.map((reg) => reg.teamId);

    // Find participants in approved teams
    const participants = await Team.find({
      _id: { $in: approvedTeamIds },
    }).select('participants');

    // Flatten all participant IDs (includes duplicates)
    const allParticipantIds = participants.flatMap((team) => team.participants);

    // ✅ Return unique participants separately
    const uniqueParticipantIds = [
      ...new Set(allParticipantIds.map((id) => id.toString())),
    ];
    const approvedParticipants = uniqueParticipantIds.length;

    // Count accommodations only for participants in approved teams
    const approvedAccommodations = await Participant.countDocuments({
      _id: { $in: uniqueParticipantIds }, // Only participants in approved teams
      accommodation: true,
      accommodation_status: true,
    });

    const unapprovedAccommodations = await Participant.countDocuments({
      _id: { $in: uniqueParticipantIds }, // Only participants in approved teams
      accommodation: true,
      accommodation_status: false,
    });

    // Fetch distinct registered user IDs and count them
    const registeredUsers = await User.distinct('_id');
    const registeredUsersCount = registeredUsers.length;

    // 💰 Revenue from approved registrations (sum of payables)
    const registrationRevenue = approvedRegistrations.reduce(
      (sum, reg) => sum + (reg.payable || 0),
      0
    );

    // 💰 Accommodation revenue stays the same
    const accommodationRevenue = approvedAccommodations * 1000;

    res.status(200).json({
      approvedTeams,
      unapprovedTeams,
      approvedParticipants, // ✅ distinct participants
      approvedAccommodations,
      unapprovedAccommodations,
      registeredUsers: registeredUsersCount,
      registrationRevenue, // ✅ sum of payables now
      accommodationRevenue,
    });
  } catch (error) {
    console.error('Error fetching registration agent stats:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const getRegisteredUsers = async (req, res) => {
  try {
    // Fetch registered users with only the required fields
    const users = await User.find().select('name email cnic contact');

    // Format response data
    const result = users.map((user) => ({
      userId: user._id,
      name: user.name,
      email: user.email,
      cnic: user.cnic,
      contact: user.contact,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in getRegisteredUsers:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getApprovedAccommodationDetails = async (req, res) => {
  try {
    // Step 1: Get all approved teams from registrations
    const approvedRegistrations = await Registration.find({
      approved: true,
    }).select('teamId');
    const approvedTeamIds = approvedRegistrations.map((reg) =>
      reg.teamId.toString()
    );

    // Step 2: Get all participants who belong to these teams and have accommodation approved
    const approvedParticipants = await Participant.find({
      team: { $in: approvedTeamIds }, // Participants whose team exists in approved teams
      accommodation: true,
      accommodation_status: true,
    }).select('name cnic contactNumber team');

    // Step 3: Get all unique team IDs from participants
    const allTeamIds = [
      ...new Set(
        approvedParticipants.flatMap((participant) => participant.team)
      ),
    ];

    // Step 4: Fetch team names for those team IDs
    const teams = await Team.find({ _id: { $in: allTeamIds } }).select(
      'name _id'
    );

    // Step 5: Create a lookup map for team names
    const teamMap = teams.reduce((map, team) => {
      map[team._id.toString()] = team.name;
      return map;
    }, {});

    // Step 6: Map participants with their multiple teams
    const result = approvedParticipants.map((participant) => ({
      participantId: participant._id,
      participantName: participant.name,
      cnic: participant.cnic,
      contactNumber: participant.contactNumber,
      teamNames: participant.team.map(
        (teamId) => teamMap[teamId.toString()] || 'Unknown'
      ),
      fee: 1000,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in getApprovedAccommodationDetails:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUnapprovedAccommodationDetails = async (req, res) => {
  try {
    // Step 1: Get all approved teams from registrations
    const approvedRegistrations = await Registration.find({
      approved: true,
    }).select('teamId');
    const approvedTeamIds = approvedRegistrations.map((reg) =>
      reg.teamId.toString()
    );

    // Step 2: Get all participants who belong to these teams and have accommodation but status is false
    const unapprovedParticipants = await Participant.find({
      team: { $in: approvedTeamIds }, // Participants whose team exists in approved teams
      accommodation: true,
      accommodation_status: false,
    }).select('name cnic contactNumber team');

    // Step 3: Get all unique team IDs from participants
    const allTeamIds = [
      ...new Set(
        unapprovedParticipants.flatMap((participant) => participant.team)
      ),
    ];

    // Step 4: Fetch team names for those team IDs
    const teams = await Team.find({ _id: { $in: allTeamIds } }).select(
      'name _id'
    );

    // Step 5: Create a lookup map for team names
    const teamMap = teams.reduce((map, team) => {
      map[team._id.toString()] = team.name;
      return map;
    }, {});

    // Step 6: Map participants with their multiple teams
    const result = unapprovedParticipants.map((participant) => ({
      participantId: participant._id,
      participantName: participant.name,
      cnic: participant.cnic,
      contactNumber: participant.contactNumber,
      teamNames: participant.team.map(
        (teamId) => teamMap[teamId.toString()] || 'Unknown'
      ), // Map all team IDs to names
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in getUnapprovedAccommodationDetails:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getAgent = async (req, res) => {
  try {
    const existingUser = await RegistrationAgent.find();
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ result: existingUser });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getUserDatabyEmail = async (req, res) => {
  try {
    const { email, cnic } = req.body;
    let user = await User.findOne({ $or: [{ email }, { cnic }] });
    if (!user) {
      user = await Ambassador.findOne({ $or: [{ email }, { cnic }] });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    }
    const userId = user._id;

    const registrations = await Registration.find({ userId, approved: false });
    const totalApprovedRegistrations = await Registration.countDocuments({
      userId,
      approved: true,
    });
    const totalApprovedAccommodations = await Participant.countDocuments({
      userId,
      accommodation_status: true,
    });
    const totalParticipantsInTeams = await Participant.countDocuments({
      userId,
      team: { $ne: [] },
    });

    const registrationTableData = await Promise.all(
      registrations.map(async (registration) => {
        const team = await Team.findById(registration.teamId);
        if (!team) {
          return null;
        }
        const participants = await Promise.all(
          team.participants.map(
            async (part) => await Participant.findById(part)
          )
        );

        const event = await Events.findById(team.eventId);
        if (!event) {
          return null;
        }
        return {
          id: registration._id,
          teamName: team.name,
          participantsCount: team.participants.length,
          participants,
          fee: registration.payable,
          eventName: event.eventName,
          status: 'Pending',
        };
      })
    );

    const participants = await Participant.find({
      userId,
      accommodation_status: false,
      accommodation: true,
      team: { $ne: null },
    });

    const accommodationTableData = await Promise.all(
      participants.map(async (participant) => {
        if (participant.team.length === 0) {
          return null;
        }

        // Check if the participant's team is approved
        const teamRegistration = await Registration.findOne({
          teamId: { $in: participant.team },
        });

        const isProcessable = teamRegistration?.approved || false; // True if team is approved

        return {
          id: participant._id,
          participantName: participant.name,
          numberOfTeams: participant.team.length,
          gender: participant.gender || 'NA',
          fee: 1000,
          status: participant.accommodation_status ? 'Approved' : 'Pending',
          processable: isProcessable, // Flag to indicate whether accommodation is processable
        };
      })
    );

    const filteredRegistrationTableData = registrationTableData.filter(
      (item) => item !== null
    );
    const filteredAccommodationTableData = accommodationTableData.filter(
      (item) => item !== null
    );

    const registrationTotal = filteredRegistrationTableData.reduce(
      (total, item) => (item ? total + item.fee : total),
      0
    );
    const accommodationTotal = filteredAccommodationTableData.reduce(
      (total, item) => total + item.fee,
      0
    );
    const grandTotal = registrationTotal + accommodationTotal;

    res.json({
      filteredRegistrationTableData,
      filteredAccommodationTableData,
      registrationTotal,
      accommodationTotal,
      grandTotal,
      totalApprovedRegistrations,
      totalApprovedAccommodations,
      totalParticipantsInTeams,
      userId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const generateId = async () => {
  const now = new Date();
  const invoiceId =
    now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0') +
    now.getHours().toString().padStart(2, '0') +
    now.getMinutes().toString().padStart(2, '0') +
    now.getSeconds().toString().padStart(2, '0') +
    now.getMilliseconds().toString().padStart(3, '0');
  return invoiceId;
};
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false, // Use 24-hour time format; set to true for AM/PM format
});
const createRegistrationString = async (registration_ids) => {
  let string = '';
  let subtotal = 0;
  let sr = 0;
  for (let id of registration_ids) {
    try {
      const registration = await Registration.findById(id);
      if (!registration) {
        throw new Error('Registration not found');
      }
      const registrationPayable = registration.payable;
      const team = await Team.findById(registration.teamId);
      if (!team) {
        throw new Error('Team not found');
      }
      const teamName = team.name;
      const participantCount = team.participants.length;
      const event = await Events.findById(team.eventId);

      if (!event) {
        throw new Error('Event not found');
      }
      const eventName = event.eventName;
      subtotal += registrationPayable;
      string += `<tr class="details">
            <td>${sr}</td>
            <td></td>
            <td>${teamName}</td>
            <td>${eventName}</td>
            <td>${participantCount}</td>
            <td>${registrationPayable}</td>
          </tr>
          `;
      sr++;
    } catch (error) {
      console.error('Failed to fetch registration details:', error);
      throw error;
    }
  }
  return { registrationString: string, regsubtotal: subtotal };
};
const createAccomodationString = async (participant_ids) => {
  try {
    let string = '';
    let subtotal = 0;
    let sr = 0;
    for (const id of participant_ids) {
      const participant = await Participant.findById(id);
      const participantName = participant.name;
      const particitantTeams = participant.team?.length;
      const participantGender = participant.gender;
      const participantAccomodationFees = 1000;
      subtotal += participantAccomodationFees;
      string += `<tr class="details">
            <td>${sr}</td>
            <td></td>
            <td>${participantName}</td>
            <td>${particitantTeams}</td>
            <td>${participantGender}</td>
            <td>${participantAccomodationFees}</td>
          </tr>
          `;
      sr++;
    }
    return { accomodationString: string, accsubtotal: subtotal };
  } catch (error) {
    console.error('Error While Creating Accomodation String');
    throw error;
  }
};
const createInvoiceCards = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { invoiceIds, type } = req.body; // Receive array of invoiceIds and type
    console.log('backend me ids', invoiceIds);

    if (!invoiceIds || !Array.isArray(invoiceIds) || invoiceIds.length === 0) {
      return res
        .status(400)
        .json({ message: 'Invoice Ids Not Provided or Invalid Format' });
    }

    const dataToPrint = [];

    // Process each invoice ID
    for (const invoiceId of invoiceIds) {
      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        console.log(`Invoice not found for ID: ${invoiceId}`);
        continue; // Skip to next invoice if this one isn't found
      }

      const userId = invoice.userId;
      let user =
        (await User.findById(userId)) || (await Ambassador.findById(userId));
      if (!user) {
        console.log(`User not found for invoice ID: ${invoiceId}`);
        continue; // Skip to next invoice if user isn't found
      }

      const ambassadorName = user.name;
      const ambassadorContact = user.contact;
      const institute = user.institute ? user.institute : 'Private';
      const registrationIds = invoice.registrationId;
      const participantIds = invoice.participantId; // Accommodation participants

      if (type === 'reg' && registrationIds && registrationIds.length > 0) {
        // Handle Registration Cards
        for (let registrationId of registrationIds) {
          const registration = await Registration.findById(registrationId);
          if (!registration) continue; // Skip if registration is not found

          const team = await Team.findById(registration.teamId);
          if (!team) continue; // Skip if team is not found

          const event = await Events.findById(team.eventId);
          if (!event) continue; // Skip if event is not found

          const eventName = event.eventName;
          const participantIds = team.participants;

          for (let participantId of participantIds) {
            const participant = await Participant.findById(participantId);
            if (!participant) continue; // Skip if participant is not found

            const participantName =
              participant.name +
              '   ' +
              (participant.gender ? participant.gender[0] : 'M');
            const participantCnic = participant.cnic;
            const Accommodation = participant.accommodation_status;
            const id = await generateSId({
              accommodation_status: participant.accommodation_status,
              cnic: participant.cnic,
            });

            if (await isIdPresent(participant._id.toString(), dataToPrint)) {
              await updateEventName(
                participant._id.toString(),
                eventName,
                dataToPrint
              );
            } else {
              dataToPrint.push({
                _id: participant._id.toString(),
                ambassadorName,
                ambassadorContact,
                institute,
                participantName,
                participantCnic,
                eventName,
                Accommodation,
                id,
              });
            }
          }
        }
      } else if (
        type === 'acc' &&
        participantIds &&
        participantIds.length > 0
      ) {
        // Handle Accommodation Participants
        for (let participantId of participantIds) {
          const participant = await Participant.findById(participantId);
          if (!participant) continue;

          dataToPrint.push({
            _id: participant._id.toString(),
            ambassadorName,
            ambassadorContact,
            institute,
            participantName: participant.name,
            participantCnic: participant.cnic,
            eventName: 'Accommodation',
            Accommodation: true,
            id: await generateSId({
              accommodation_status: true,
              cnic: participant.cnic,
            }),
          });
        }
      }
    }

    if (dataToPrint.length === 0) {
      return res
        .status(404)
        .json({ message: 'No data found for the selected invoices' });
    }

    const cardsString = await createCardsString(dataToPrint);
    res.status(200).send({ cardsString });
  } catch (error) {
    console.error('Error in createInvoiceCards:', error);
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};

const createInvoice = async (
  userId,
  registration_ids,
  participant_ids,
  discount,
  agentId
) => {
  try {
    // Fetch user (from User or Ambassador collection)
    let user = await User.findById(userId);
    let ambassador = await Ambassador.findById(userId);
    if (user || ambassador) {
      let institute = 'Private';
      if (user && user.a_id) {
        ambassador = await Ambassador.findById(user.a_id);
        if (ambassador) institute = ambassador.institute;
      } else if (ambassador) {
        user = ambassador;
        institute = ambassador.institute;
      }
      // Get agent details
      const agent = await Agent.findById(agentId);

      // Generate a new invoice ID and format the creation time
      const invoiceId = await generateId();
      let createdAt = new Date();
      createdAt = dateFormatter.format(createdAt);

      let invoiceString = '';

      // Case 1: Registration-based invoice (when registration_ids is not empty)
      if (registration_ids && registration_ids.length > 0) {
        const { registrationString, regsubtotal } =
          await createRegistrationString(registration_ids);

        // Check if there are also accommodations to include
        let accomodationString = '';
        let accsubtotal = 0;

        if (participant_ids && participant_ids.length > 0) {
          const accomodationData =
            await createAccomodationString(participant_ids);
          accomodationString = accomodationData.accomodationString;
          accsubtotal = accomodationData.accsubtotal;
        }

        // Create combined invoice with registration and possible accommodation
        invoiceString = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invoice</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      .invoice-box {
        max-width: 800px;
        margin: auto;
        padding: 30px;
        border: 1px solid #eee;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
        font-size: 16px;
        line-height: 24px;
        font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
        color: #555;
      }
      .invoice-box table {
        width: 100%;
        line-height: inherit;
        text-align: left;
      }
      .invoice-box table td {
        padding: 5px;
        vertical-align: top;
      }
      .invoice-box table tr td:nth-child(2) {
        text-align: right;
      }
      .invoice-box table tr.top table td {
        padding-bottom: 20px;
      }
      .invoice-box table tr.top table td.title {
        font-size: 45px;
        line-height: 45px;
        color: #333;
      }
      .invoice-box table tr.information table td {
        padding-bottom: 40px;
      }
      .invoice-box table tr.heading td {
        background: #eee;
        border-bottom: 1px solid #ddd;
        font-weight: bold;
      }
      .invoice-box table tr.details td {
        padding-bottom: 20px;
      }
      .invoice-box table tr.item td {
        border-bottom: 1px solid #eee;
      }
      .invoice-box table tr.item.last td {
        border-bottom: none;
      }
      .invoice-box table tr.total td:nth-child(2) {
        border-top: 2px solid #eee;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="invoice-box">
      <center>
        <div>Daira 2025</div>
        <img
          src="https://res.cloudinary.com/ddxgntu3g/image/upload/v1743177316/daira_logo_kkhvww.jpg"
          style="width: 33%; max-width: 400px"
        />
      </center>
      <table cellpadding="0" cellspacing="0">
        <tr class="top">
          <td colspan="6">
            <table>
              <tr>
                <td class="title">
                  <!-- Logo already printed above -->
                </td>
                <td>
                  Invoice# ${invoiceId}<br />
                  Created: ${createdAt}<br />
                  <br />
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr class="information">
          <td colspan="5">
            <table>
              <tr>
                <td>
                  Ambassador email: ${user.email}<br />
                  Ambassador name: ${user.name}<br />
                  Institute: ${institute}<br />
                  Contact Info: ${user.contact}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr class="heading">
          <td>Registrations</td>
        </tr>
        <tr class="heading">
          <td>Sr</td>
          <td></td>
          <td>Team Name</td>
          <td>Event Name</td>
          <td>Participant Count</td>
          <td>Registration</td>
        </tr>
        ${registrationString}
        <tr class="regsubtotal">
          <td colspan="5" style="text-align: right">Sub Total</td>
          <td>${regsubtotal.toLocaleString()}</td>
        </tr>
        ${
          participant_ids && participant_ids.length > 0
            ? `
        <tr class="heading">
          <td>Accomodations</td>
        </tr>
        <tr class="heading">
          <td>Sr</td>
          <td></td>
          <td>Name</td>
          <td>Teams</td>
          <td>Gender</td>
          <td>Fees</td>
        </tr>
        ${accomodationString}
        <tr class="accsubtotal">
          <td colspan="5" style="text-align: right">Sub Total</td>
          <td>${accsubtotal.toLocaleString()}</td>
        </tr>`
            : ''
        }
        <tr class="dtotal">
          <td colspan="5" style="text-align: right">Total Discount</td>
          <td>${regsubtotal + accsubtotal - discount >= 0 ? discount.toLocaleString() : 0}</td>
        </tr>
        <tr class="total">
          <td colspan="5" style="text-align: right">Total Account</td>
          <td>${regsubtotal + accsubtotal - discount >= 0 ? (regsubtotal + accsubtotal - discount).toLocaleString() : (regsubtotal + accsubtotal).toLocaleString()}</td>
        </tr>
      </table>
      <div>Issued By: ${agent.name}</div>
    </div>
  </body>
</html>`;
      }
      // Case 2: Accommodation-only invoice (when registration_ids is empty but participant_ids exists)
      else if (participant_ids && participant_ids.length > 0) {
        const { accomodationString, accsubtotal } =
          await createAccomodationString(participant_ids);

        invoiceString = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invoice</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      .invoice-box {
        max-width: 800px;
        margin: auto;
        padding: 30px;
        border: 1px solid #eee;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
        font-size: 16px;
        line-height: 24px;
        font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
        color: #555;
      }
      .invoice-box table {
        width: 100%;
        line-height: inherit;
        text-align: left;
      }
      .invoice-box table td {
        padding: 5px;
        vertical-align: top;
      }
      .invoice-box table tr td:nth-child(2) {
        text-align: right;
      }
      .invoice-box table tr.top table td {
        padding-bottom: 20px;
      }
      .invoice-box table tr.top table td.title {
        font-size: 45px;
        line-height: 45px;
        color: #333;
      }
      .invoice-box table tr.information table td {
        padding-bottom: 40px;
      }
      .invoice-box table tr.heading td {
        background: #eee;
        border-bottom: 1px solid #ddd;
        font-weight: bold;
      }
      .invoice-box table tr.details td {
        padding-bottom: 20px;
      }
      .invoice-box table tr.item td {
        border-bottom: 1px solid #eee;
      }
      .invoice-box table tr.item.last td {
        border-bottom: none;
      }
      .invoice-box table tr.total td:nth-child(2) {
        border-top: 2px solid #eee;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="invoice-box">
      <center>
        <div>Daira 2025</div>
        <img
          src="https://res.cloudinary.com/ddxgntu3g/image/upload/v1743177316/daira_logo_kkhvww.jpg"
          style="width: 33%; max-width: 400px"
        />
        <br/>
      </center>
      <table cellpadding="0" cellspacing="0">
        <tr class="top">
          <td colspan="6">
            <table>
              <tr>
                <td class="title">
                  <!-- Logo already printed above -->
                </td>
                <td>
                  Invoice# ${invoiceId}<br />
                  Created: ${createdAt}<br />
                  <br />
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr class="information">
          <td colspan="5">
            <table>
              <tr>
                <td>
                  Ambassador email: ${user.email}<br />
                  Ambassador name: ${user.name}<br />
                  Institute: ${institute}<br />
                  Contact Info: ${user.contact}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <tr class="heading">
          <td>Accomodations</td>
        </tr>
        <tr class="heading">
          <td>Sr</td>
          <td></td>
          <td>Name</td>
          <td>Teams</td>
          <td>Gender</td>
          <td>Fees</td>
        </tr>
        ${accomodationString}
        <tr class="accsubtotal">
          <td colspan="5" style="text-align: right">Sub Total</td>
          <td>${accsubtotal.toLocaleString()}</td>
        </tr>
        <tr class="dtotal">
          <td colspan="5" style="text-align: right">Total Discount</td>
          <td>${accsubtotal - discount >= 0 ? discount.toLocaleString() : 0}</td>
        </tr>
        <tr class="total">
          <td colspan="5" style="text-align: right">Total Account</td>
          <td>${accsubtotal - discount >= 0 ? (accsubtotal - discount).toLocaleString() : accsubtotal.toLocaleString()}</td>
        </tr>
      </table>
      <div>Issued By: ${agent.name}</div>
    </div>
  </body>
</html>`;
      }
      // Case 3: Participant details only (no registration or accommodation data)
      else {
        // This is a fallback case where there's no registration or accommodation data
        // but we still want to generate an invoice with participant information
        const participants = await Participant.find(
          { _id: { $in: participant_ids || [] } },
          'name cnic contactNumber'
        );

        // Generate QR code URL
        const qrCodeUrl = await generateQRCode(invoiceId);

        invoiceString = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invoice</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      .invoice-box {
        max-width: 800px;
        margin: auto;
        padding: 30px;
        border: 1px solid #eee;
        box-shadow: 0 0 10px rgba(0,0,0,0.15);
        font-size: 16px;
        line-height: 24px;
        color: #555;
      }
      .invoice-box table {
        width: 100%;
        text-align: left;
        border-collapse: collapse;
      }
      .invoice-box table td {
        padding: 5px;
        vertical-align: top;
        border: 1px solid #eee;
      }
      .invoice-box table th {
        padding: 5px;
        background: #eee;
        font-weight: bold;
        border: 1px solid #eee;
      }
    </style>
  </head>
  <body>
    <div class="invoice-box">
      <center>
        <div>Daira 2025</div>
        <img src="https://res.cloudinary.com/ddxgntu3g/image/upload/v1743177316/daira_logo_kkhvww.jpg" style="width:33%; max-width:400px;" />
        <br/>
        <img src="${qrCodeUrl}" style="width:100px; height:100px;" />
      </center>
      <table>
        <tr>
          <td>Invoice# ${invoiceId}</td>
          <td style="text-align:right;">Created: ${createdAt}</td>
        </tr>
        <tr>
          <td colspan="2">
            Ambassador Email: ${user.email}<br/>
            Ambassador Name: ${user.name}<br/>
            Institute: ${institute}<br/>
            Contact Info: ${user.contact}
          </td>
        </tr>
      </table>
      <h3>Participant Details</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>CNIC</th>
            <th>Contact Number</th>
          </tr>
        </thead>
        <tbody>
          ${
            participants && participants.length > 0
              ? participants
                  .map(
                    (p) => `
            <tr>
              <td>${p.name}</td>
              <td>${p.cnic}</td>
              <td>${p.contactNumber}</td>
            </tr>
          `
                  )
                  .join('')
              : '<tr><td colspan="3">No participant data available</td></tr>'
          }
        </tbody>
      </table>
      <div>Issued By: ${agent.name}</div>
    </div>
  </body>
</html>`;
      }

      return { invoiceString: invoiceString, invoiceId: invoiceId };
    } else throw 'User Not Found';
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createRegistrationInvoice = async (req, res) => {
  try {
    const {
      userId,
      registration_ids,
      participant_ids,
      amount_payable,
      discount,
      log,
      agentId,
    } = req.body;
    const { invoiceString, invoiceId } = await createInvoice(
      userId,
      registration_ids,
      participant_ids,
      discount,
      agentId
    );
    res.status(200).json({
      invoice: invoiceString,
      invoiceId: invoiceId,
      message: 'Invoice Generated Successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
const getuserinvoices = async (req, res) => {
  try {
    const { email, cnic } = req.query;

    // Find the user in User or Ambassador collection
    let user = await User.findOne({ $or: [{ email }, { cnic }] });
    if (!user) {
      user = await Ambassador.findOne({ $or: [{ email }, { cnic }] });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    const userId = user._id;
    const dataToSend = [];

    // Fetch all invoices for the user
    const invoices = await Invoice.find({ userId: userId });

    for (const invoice of invoices) {
      const time = dateFormatter.format(invoice.createdAt);

      let teamNames = [];
      let participantDetails = [];

      // Fetch team names if registration IDs exist
      if (invoice.registrationId && invoice.registrationId.length > 0) {
        const registrations = await Registration.find(
          { _id: { $in: invoice.registrationId } },
          'teamId'
        );

        const teamIds = registrations.map((reg) => reg.teamId);
        const teams = await Team.find({ _id: { $in: teamIds } }, 'name');
        teamNames = teams.map((team) => team.name);
      }

      // Fetch participant details if participant IDs exist
      if (invoice.participantId && invoice.participantId.length > 0) {
        participantDetails = await Participant.find(
          { _id: { $in: invoice.participantId } },
          'name cnic contactNumber'
        );
      }

      // Push one object for team registrations
      if (teamNames.length > 0) {
        dataToSend.push({
          id: invoice._id,
          name: user.name,
          invoiceId: invoice.invoiceId,
          teamApproved: teamNames, // Array of team names
          participantDetails: [], // Empty participant details
          accommodationAvailed: invoice.participantId.length,
          totalBill: invoice.amountPaid,
          discount: invoice.discount,
          time: time,
        });
      }

      // Push another object for participant registrations
      if (participantDetails.length > 0) {
        dataToSend.push({
          id: invoice._id,
          name: user.name,
          invoiceId: invoice.invoiceId,
          teamApproved: [], // Empty teams
          participantDetails: participantDetails, // Array of participants
          accommodationAvailed: invoice.participantId.length,
          totalBill: invoice.amountPaid,
          discount: invoice.discount,
          time: time,
        });
      }
    }

    console.log(dataToSend);
    res.status(200).json({
      invoices: dataToSend,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getApprovedTeamInfo = async (req, res) => {
  try {
    const approvedRegistrations = await Registration.find({ approved: true });

    const result = [];

    for (const reg of approvedRegistrations) {
      // Get User info
      const user = await User.findById(reg.userId).select('name email');

      // Get Team info
      const team = await Team.findById(reg.teamId).select(
        'name eventId participants'
      );

      // Get Event info
      const event = await Event.findById(team.eventId).select(
        'eventName eventCategory'
      );

      // Get Participants info
      const participants = await Participant.find({
        _id: { $in: team.participants },
      }).select('name cnic contactNumber');

      result.push({
        registeredBy: {
          name: user?.name || 'N/A',
          email: user?.email || 'N/A',
        },
        team: {
          name: team?.name || 'N/A',
        },
        event: {
          name: event?.eventName || 'N/A',
          category: event?.eventCategory || 'N/A',
        },
        participants: participants.map((p) => ({
          name: p.name,
          cnic: p.cnic,
          contactNumber: p.contactNumber,
        })),
      });
    }

    res.status(200).json({ teams: result });
  } catch (error) {
    console.error('Error fetching approved team info:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const getApprovedTeamPaymentInfo = async (req, res) => {
  try {
    // Get all approved registrations
    const approvedRegistrations = await Registration.find({ approved: true });

    const result = [];

    for (const reg of approvedRegistrations) {
      // Get User info
      const user = await User.findById(reg.userId).select('name email');

      // Get Team info
      const team = await Team.findById(reg.teamId).select('name eventId');

      // Get Event info
      const event = await Event.findById(team.eventId).select(
        'eventName eventCategory'
      );

      result.push({
        registeredBy: {
          name: user?.name || 'N/A',
          email: user?.email || 'N/A',
        },
        team: {
          name: team?.name || 'N/A',
        },
        event: {
          name: event?.eventName || 'N/A',
          category: event?.eventCategory || 'N/A',
        },
        payable: reg.payable, // Amount received
      });
    }

    res.status(200).json({ teams: result });
  } catch (error) {
    console.error('Error fetching approved team payment info:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUnapprovedTeamInfo = async (req, res) => {
  try {
    const approvedRegistrations = await Registration.find({ approved: false });

    const result = [];

    for (const reg of approvedRegistrations) {
      // Get User info
      const user = await User.findById(reg.userId).select('name email');

      // Get Team info
      const team = await Team.findById(reg.teamId).select(
        'name eventId participants'
      );

      // Get Event info
      const event = await Event.findById(team.eventId).select(
        'eventName eventCategory'
      );

      // Get Participants info
      const participants = await Participant.find({
        _id: { $in: team.participants },
      }).select('name cnic contactNumber');

      result.push({
        registeredBy: {
          name: user?.name || 'N/A',
          email: user?.email || 'N/A',
        },
        team: {
          name: team?.name || 'N/A',
        },
        event: {
          name: event?.eventName || 'N/A',
          category: event?.eventCategory || 'N/A',
        },
        participants: participants.map((p) => ({
          name: p.name,
          cnic: p.cnic,
          contactNumber: p.contactNumber,
        })),
      });
    }

    res.status(200).json({ teams: result });
  } catch (error) {
    console.error('Error fetching approved team info:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const approveRegistration = async (req, res) => {
  try {
    const {
      invoiceId,
      userId,
      registration_ids,
      participant_ids,
      discount,
      log,
      agentId,
    } = req.body;

    // Check if any of the registrations are for inactive events
    const registrations = await Registration.find({
      _id: { $in: registration_ids },
    });
    for (const registration of registrations) {
      const team = await Team.findById(registration.teamId);
      if (!team) {
        return res.status(400).json({ message: 'Team not found' });
      }

      const event = await Event.findById(team.eventId);
      if (!event) {
        return res.status(400).json({ message: 'Event not found' });
      }

      if (event.status !== 'active') {
        return res.status(400).json({
          message: `Cannot approve registration for inactive event: ${event.eventName}`,
        });
      }
    }

    // Update all registrations
    await Registration.updateMany(
      { _id: { $in: registration_ids } },
      { $set: { approved: true } }
    );

    // Update all participants
    await Participant.updateMany(
      { _id: { $in: participant_ids } },
      { $set: { accommodation_status: true } }
    );

    const { registrationString, regsubtotal } =
      await createRegistrationString(registration_ids);
    const { accomodationString, accsubtotal } =
      await createAccomodationString(participant_ids);

    const amount_payable = regsubtotal + accsubtotal;
    const discountCheck = amount_payable - discount >= 0 ? discount : 0;
    const amountPaid = amount_payable - discountCheck;

    // Create new invoice
    const invoice = new Invoice({
      userId,
      invoiceId,
      registrationId: registration_ids,
      participantId: participant_ids,
      amountPayable: amount_payable,
      discount: discountCheck,
      amountPaid,
      agentId,
      log,
    });

    await invoice.save();

    res.status(200).json({
      message: 'Registrations approved and invoice created successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// write a controller to get all the ambassador participants take as a request body
const getAllAmbasssadorParticipants = async (req, res) => {
  try {
    const { useremail } = req.query; // GET requests usually use query params

    if (!useremail) {
      return res.status(400).json({ message: 'useremail is required' });
    }

    const ambassador = await Ambassador.findOne({ email: useremail });

    if (!ambassador) {
      return res.status(404).json({ message: 'Ambassador not found' });
    }

    const participants = await Participant.find({ userId: ambassador._id });

    return res.status(200).json({ participants });
  } catch (error) {
    console.error('Error fetching participants:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const editAmbassadorParticipant = async (req, res) => {
  try {
    const participantId = req.params.participantId;
    const updatedData = req.body;

    if (!participantId || !updatedData || typeof updatedData !== 'object') {
      return res.status(400).json({
        message: 'Participant ID and valid updated data are required',
      });
    }

    const updatedParticipant = await Participant.findByIdAndUpdate(
      participantId,
      updatedData,
      { new: true }
    );

    if (!updatedParticipant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    return res.status(200).json({
      message: 'Participant updated successfully',
      participant: updatedParticipant,
    });
  } catch (error) {
    console.error('Error updating participant:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteAmbassadorParticipant = async (req, res) => {
  try {
    const participantId = req.params.participantId;

    if (!participantId) {
      return res.status(400).json({ message: 'Participant ID is required' });
    }

    const deletedParticipant =
      await Participant.findByIdAndDelete(participantId);

    if (!deletedParticipant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    return res.status(200).json({
      message: 'Participant deleted successfully',
      participant: deletedParticipant,
    });
  } catch (error) {
    console.error('Error deleting participant:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  login,
  verifyToken,
  getAgent,
  getUserDatabyEmail,
  approveRegistration,
  createRegistrationInvoice,
  getuserinvoices,
  createInvoiceCards,
  getRegisterationAgentStats,
  getApprovedTeamInfo,
  getUnapprovedTeamInfo,
  getApprovedAccommodationDetails,
  getUnapprovedAccommodationDetails,
  getRegisteredUsers,
  getApprovedParticipantDetails,
  getApprovedTeamPaymentInfo,
  getAllAmbasssadorParticipants,
  editAmbassadorParticipant,
  deleteAmbassadorParticipant,
};
