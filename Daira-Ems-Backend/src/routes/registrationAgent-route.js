import express from 'express';
import {
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
} from '../controllers/registrationAgent-controller.js';
import { isAgent } from '../middlewares/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/verifyToken', verifyToken);
// router.get('/getAgents', getAgent);
router.post('/getUserDataByEmail', isAgent, getUserDatabyEmail);
router.post('/approveRegistration', isAgent, approveRegistration);
router.post('/createRegistrationInvoice', isAgent, createRegistrationInvoice);
router.post('/createInvoiceCards', isAgent, createInvoiceCards);
router.get('/getuserinvoices', isAgent, getuserinvoices);
router.get('/getAgentDashboardStats', isAgent, getRegisterationAgentStats);
router.get('/getApprovedTeamInfo', isAgent, getApprovedTeamInfo);
router.get('/getUnapprovedTeamInfo', isAgent, getUnapprovedTeamInfo);
router.get(
  '/getApprovedAccommodationDetails',
  isAgent,
  getApprovedAccommodationDetails
);
router.get(
  '/getUnapprovedAccommodationDetails',
  isAgent,
  getUnapprovedAccommodationDetails
);
router.get('/getRegisteredUsers', isAgent, getRegisteredUsers);
router.get(
  '/getApprovedParticipantDetails',
  isAgent,
  getApprovedParticipantDetails
);
router.get('/getApprovedTeamPaymentInfo', isAgent, getApprovedTeamPaymentInfo);
// make sure to add query params to the route

router.get('/get-all-partcipants', isAgent, getAllAmbasssadorParticipants);
router.put(
  '/edit-ambassador-participant/:participantId',
  isAgent,
  editAmbassadorParticipant
);
router.delete(
  '/delete-ambassador-participant/:participantId',
  isAgent,
  deleteAmbassadorParticipant
);

export default router;
