import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  IconButton,
  Grid,
  Button,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DropdownTextField from '../register/component/dropdown';
import { useSnackbar } from '../../../utils/snackbarContextProvider';
import { useRegistration } from '../../../service/registerationService';
import ReCAPTCHA from 'react-google-recaptcha';
import { useRef } from 'react';

const EditParticipants = ({
  maxParticipants,
  minParticipants,
  setTeamName,
  fee,
  status,
  teamName,
  dropdownValues,
}) => {
  const { getParticipantsByiD, registerTeam, getEventDetails } =
    useRegistration();
  const captchaRef = useRef(null);
  const userData = JSON.parse(localStorage.getItem('userData'));
  const tokenData = userData.data;
  const token = tokenData.token;
  const userId = tokenData.result._id;
  const [allParticipants, setallParticipants] = useState([]);
  useEffect(() => {
    const setParticipants = async () => {
      const participants = await getParticipantsByiD(
        tokenData.result._id,
        token
      );
      setallParticipants(participants);
    };
    setParticipants();
  }, []);

  const { show } = useSnackbar();
  const [selectedParticipants, setSelectedParticipants] = useState(
    Array.from({ length: minParticipants }, () => ({
      _id: '',
      name: '',
      cnic: '',
    }))
  );
  useEffect(() => {
    setSelectedParticipants(
      Array.from({ length: minParticipants }, () => ({
        _id: '',
        name: '',
        cnic: '',
      }))
    );
  }, [minParticipants]);
  const getRemainingParticipants = (_id) => {
    return allParticipants.filter(
      (p) =>
        p._id === _id ||
        !selectedParticipants.some((selected) => selected._id === p._id)
    );
  };

  const handleSubmit = async () => {
    if (selectedParticipants.some((p) => p.name === '')) {
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
      setSubmitting(false);
      return;
    }

    const data = await getEventDetails(token, dropdownValues.event);
    const eventId = data[0]._id;
    const participants = selectedParticipants.map((p) => p._id);
    const response = await registerTeam(
      token,
      userId,
      teamName,
      eventId,
      participants,
      captchaValue
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
      setTeamName(''); // Reset team name here
    } else {
      show(response.msg, 'error');
    }
  };

  const handleParticipantChange = (_id, index) => {
    const participant = allParticipants.find((p) => p._id === _id);
    const updatedParticipants = selectedParticipants.map((item, i) =>
      i === index
        ? {
            ...item,
            name: participant.name,
            cnic: participant ? participant.cnic : '',
            _id: participant ? _id : '',
          }
        : item
    );
    setSelectedParticipants(updatedParticipants);
  };

  const handleRemoveParticipant = (index) => {
    if (selectedParticipants.length > minParticipants) {
      setSelectedParticipants(
        selectedParticipants.filter((_, i) => i !== index)
      );
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

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Update Participants
      </Typography>

      {selectedParticipants.map((participant, index) => (
        <Grid
          container
          alignItems="center"
          spacing={1}
          key={index}
          sx={{
            marginBottom: 2,
          }}
        >
          <Grid item xs={5}>
            <DropdownTextField
              label="Add Participant"
              value={participant._id || ''}
              onChange={(e) => handleParticipantChange(e.target.value, index)}
              options={getRemainingParticipants(participant._id).map((p) => ({
                label: p.name,
                value: p._id,
              }))}
              fullWidth
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              label="CNIC"
              variant="outlined"
              value={participant.cnic || ''}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
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
      <Typography variant="body2">
        Note: You can add at most {maxParticipants} participants and at least{' '}
        {minParticipants} participants.
      </Typography>

      <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2 }}>
        Team Name
      </Typography>
      <TextField
        placeholder="Enter Team Name"
        variant="outlined"
        sx={{ width: '50%' }}
        onChange={(e) => setTeamName(e.target.value)}
      />

      <Typography variant="body2">
        Enter a unique team name, this team name would be used throughout the
        event.
      </Typography>

      <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>
        Calclated Registration Fee
      </Typography>

      <Grid container spacing={2}>
        <Grid item sm={4}>
          <Typography variant="h5">
            Rs.{' '}
            {status == 'Individual'
              ? (fee * selectedParticipants.length).toFixed(2)
              : (fee * 1).toFixed(2)}
          </Typography>
        </Grid>
        <Grid item sm={8}>
          <ReCAPTCHA
            sitekey="6LfnTKspAAAAAAkOSvnqFnIcu-nd_ioY_QQ1bpFS"
            ref={captchaRef}
          />
          <Button
            variant="contained"
            sx={{
              width: '50%',
              color: 'white',
              background:
                'linear-gradient(149deg, #67A6F5 -18.73%, #2569BE 128.63%)',
            }}
            onClick={handleSubmit}
          >
            Update
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditParticipants;
