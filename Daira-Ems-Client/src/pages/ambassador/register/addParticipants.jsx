import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Typography,
  IconButton,
  Grid,
  Button,
  CircularProgress,
  Divider,
  Alert,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DropdownTextField from './component/dropdown';
import { useSnackbar } from '../../../utils/snackbarContextProvider';
import { useRegistration } from '../../../service/registerationService';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';

const AddParticipants = ({
  maxParticipants,
  minParticipants,
  setTeamName,
  fee,
  status,
  teamName,
  dropdownValues,
  setDropdownValues,
  setInvoiceRow,
  registrationType,
}) => {
  const { getParticipantsByiD, registerTeam, getEventDetails, loading } =
    useRegistration();
  const captchaRef = useRef(null);
  const userData = JSON.parse(localStorage.getItem('userData'));
  const tokenData = userData.data;
  const token = tokenData.token;
  const userId = tokenData.result._id;
  const allowedUserIds = [
    '67d9421dd9b18460e7b9ef1c',
    '68001a76c128edc088bbf112', // alam bhai id
    '680745d77903a2355042c655',
  ];

  const [allParticipants, setAllParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState(
    Array.from({ length: minParticipants }, () => ({
      _id: '',
      name: '',
      cnic: '',
    }))
  );
  const [calculatedFee, setCalculatedFee] = useState(0);

  const { show } = useSnackbar();
  const navigate = useNavigate();

  const calculatePayableAmount = () => {
    if (!fee) return 0;
    const sanitizedFee =
      typeof fee === 'string' ? parseFloat(fee.replace(/,/g, '')) : fee;
    const baseFee = Number(sanitizedFee) || 0;
    if (registrationType === 'Individual') {
      return baseFee * selectedParticipants.length;
    } else if (registrationType === 'Per-Team') {
      return baseFee;
    }
    return baseFee;
  };

  useEffect(() => {
    const newFee = calculatePayableAmount();
    setCalculatedFee(newFee);
  }, [selectedParticipants.length, fee, status]);

  useEffect(() => {
    if (!userId || !token) return;

    const fetchParticipants = async () => {
      try {
        const participants = await getParticipantsByiD(userId, token);
        setAllParticipants(participants);
        setFilteredParticipants(participants);
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    fetchParticipants();
  }, [userId, token]);

  useEffect(() => {
    setSelectedParticipants(
      Array.from({ length: minParticipants }, () => ({
        _id: '',
        name: '',
        cnic: '',
      }))
    );
  }, [minParticipants]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = allParticipants.filter(
        (participant) =>
          participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          participant.cnic.includes(searchTerm)
      );
      setFilteredParticipants(filtered);
    } else {
      setFilteredParticipants(allParticipants);
    }
  }, [searchTerm, allParticipants]);

  const getRemainingParticipants = (_id) => {
    const remaining = filteredParticipants.filter(
      (p) =>
        p._id === _id ||
        !selectedParticipants.some((selected) => selected._id === p._id)
    );
    return [{ _id: '', name: '-- None --' }, ...remaining];
  };

  const handleParticipantChange = (_id, index) => {
    if (!_id) {
      const updated = selectedParticipants.map((item, i) =>
        i === index ? { _id: '', name: '', cnic: '' } : item
      );
      setSelectedParticipants(updated);
      return;
    }

    const participant = allParticipants.find((p) => p._id === _id);
    const updated = selectedParticipants.map((item, i) =>
      i === index
        ? {
            ...item,
            name: participant ? participant.name : '',
            cnic: participant ? participant.cnic : '',
            _id: participant ? _id : '',
          }
        : item
    );
    setSelectedParticipants(updated);
  };

  const handleRemoveParticipant = (index) => {
    if (selectedParticipants.length > minParticipants) {
      const updated = selectedParticipants.filter((_, i) => i !== index);
      setSelectedParticipants(updated);
    }
  };

  const handleAddParticipant = () => {
    if (selectedParticipants.length < maxParticipants) {
      setSelectedParticipants([
        ...selectedParticipants,
        { _id: '', name: '', cnic: '' },
      ]);
    }
  };

  const sanitizeFeeDisplay = (feeValue) => {
    if (!feeValue) return '0.00';
    const sanitized = feeValue.toString().replace(/,/g, '');
    return Number(sanitized).toFixed(2);
  };

  const handleSubmit = async () => {
    if (selectedParticipants.some((p) => !p.name)) {
      show('Please fill all the participants.', 'error');
      return;
    }
    if (!teamName) {
      show('Please enter the team name.', 'error');
      return;
    }

    const captchaValue = captchaRef.current.getValue();
    if (!captchaValue) {
      show('Please verify you are not a robot', 'error');
      return;
    }

    const data = await getEventDetails(token, dropdownValues.event);
    const eventId = data[0]?._id;
    const participants = selectedParticipants.map((p) => p._id);
    const payableAmount = calculatePayableAmount();

    const response = await registerTeam(
      token,
      userId,
      teamName,
      eventId,
      participants,
      captchaValue,
      payableAmount
    );

    if (response.success) {
      show(response.msg, 'success');
      setSelectedParticipants(
        Array.from({ length: minParticipants }, () => ({
          _id: '',
          name: '',
          cnic: '',
        }))
      );
      setTeamName('');
      setDropdownValues('');
      setInvoiceRow([
        {
          minTeamSize: 'NULL',
          maxTeamSize: 'NULL',
          headName: 'NULL',
          contactNumber: 'NULL',
          registrationFee: 'NULL',
          status: 'NULL',
          prizeMoney: 'NULL',
        },
      ]);
      captchaRef.current.reset();
    } else {
      show(response.msg, 'error');
    }
  };

  const showSearchField = allowedUserIds.includes(userId);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'start',
        height: '100%',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '16px 10px',
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
        Add Participants to Event
      </Typography>

      {allParticipants.length === 0 ? (
        <Alert
          severity="info"
          sx={{
            width: '100%',
            mb: 3,
            '& .MuiAlert-message': {
              width: '100%',
              textAlign: 'center',
              fontWeight: 'medium',
            },
          }}
        >
          Please add participants first from the Manage Participants tab before
          registering for an event.
        </Alert>
      ) : (
        <>
          {showSearchField && (
            <TextField
              label="Search Participants"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or CNIC"
            />
          )}

          {selectedParticipants.map((participant, index) => (
            <Grid
              container
              key={index}
              alignItems="center"
              justifyContent="center"
              spacing={1}
              sx={{ mb: 2, width: '100%' }}
            >
              <Grid item xs={12} sm={5}>
                <DropdownTextField
                  label="Add Participant"
                  value={participant._id || ''}
                  onChange={(e) =>
                    handleParticipantChange(e.target.value, index)
                  }
                  options={getRemainingParticipants(participant._id).map(
                    (p) => ({
                      label: p.name,
                      value: p._id,
                    })
                  )}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  label="CNIC"
                  variant="outlined"
                  value={participant.cnic || ''}
                  disabled
                  fullWidth
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={2}
                sx={{ display: 'flex', justifyContent: 'center' }}
              >
                <IconButton
                  onClick={() => handleRemoveParticipant(index)}
                  disabled={selectedParticipants.length <= minParticipants}
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
                {selectedParticipants.length - 1 === index && (
                  <IconButton
                    onClick={handleAddParticipant}
                    disabled={selectedParticipants.length >= maxParticipants}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}

          <Typography variant="body2" sx={{ mb: 2 }}>
            Note: You can add at most {maxParticipants} participants and at
            least {minParticipants} participants.
          </Typography>

          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Team Name
          </Typography>
          <TextField
            placeholder="Enter Team Name"
            variant="outlined"
            sx={{ width: '100%', mb: 1 }}
            onChange={(e) => setTeamName(e.target.value)}
            value={teamName}
          />

          <Typography variant="body2" sx={{ mb: 2 }}>
            Enter a unique team name, this team name would be used throughout
            the event.
          </Typography>

          <Box
            sx={{
              width: '100%',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px',
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Registration Fee Details
            </Typography>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
            >
              <Typography variant="body2">Base Fee:</Typography>
              <Typography variant="body2">
                Rs. {sanitizeFeeDisplay(fee)}
              </Typography>
            </Box>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
            >
              <Typography variant="body2">Registration Type:</Typography>
              <Typography variant="body2">{status}</Typography>
            </Box>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
            >
              <Typography variant="body2">Number of Participants:</Typography>
              <Typography variant="body2">
                {selectedParticipants.length}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Total Fee:
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: '#1976d2', fontWeight: 'bold' }}
              >
                Rs. {calculatedFee.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              width: '100%',
              maxWidth: 400,
            }}
          >
            <Box
              sx={{
                transform: 'scale(0.75)',
                transformOrigin: 'center',
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <ReCAPTCHA
                sitekey="6LfnTKspAAAAAAkOSvnqFnIcu-nd_ioY_QQ1bpFS"
                ref={captchaRef}
              />
            </Box>

            <Button
              variant="contained"
              disabled={loading}
              sx={{
                mt: 1,
                height: '50px',
                width: '200px',
                borderRadius: '12px',
                backgroundColor: '#FFC107',
                color: '#000',
                px: 4,
                '&:hover': {
                  backgroundColor: '#E0A800',
                },
                '&:disabled': {
                  backgroundColor: '#FFE082',
                  color: '#000',
                },
              }}
              onClick={handleSubmit}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: '#000' }} />
                  Registering...
                </Box>
              ) : (
                'Register'
              )}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AddParticipants;
