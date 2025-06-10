import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Switch,
  FormControlLabel,
  DialogContentText,
  useTheme,
} from '@mui/material';
import {
  AddCircleOutline as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../../../utils/snackbarContextProvider.jsx';
import { useAppAmbassador } from '../../../../service/approvedAmbassador.jsx';

const AmbassadorDetailsModal = ({
  open,
  handleClose,
  onSubmit,
  ambassadorID,
}) => {
  const theme = useTheme();
  const { getAmbassador } = useAppAmbassador();
  const { show } = useSnackbar();
  const [status, setStatus] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    instituteName: '',
    campusName: '',
    department: '',
    rollnumber: '',
    city: '',
    phoneNumber: '',
    email: '',
    studentAffairOfficerName: '',
    studentAffairOfficerContact: '',
    previousExperience: '',
    plansOfDaira: '',
    participantsNumber: '',
    typeOfInstitute: '',
    batch: '',
    attendedDairaBefore: '',
  });

  useEffect(() => {
    const getAmbassadorDetails = async () => {
      if (!ambassadorID) return;
      const response = await getAmbassador(ambassadorID);

      if (response) {
        setStatus(response.approved);
        setFormData({
          name: response.name,
          instituteName: response.institute,
          campusName: response.campusName,
          phoneNumber: response.contact,
          email: response.email,
        });
      } else {
        show('Failed to fetch ambassador details', 'error');
      }
    };

    getAmbassadorDetails();
  }, [ambassadorID]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      sx={{
        '& .MuiDialog-paper': {
          width: '100%',
          margin: 0,
          borderRadius: 7,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#F5F5F5',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <IconButton
            sx={{
              p: 1,
              backgroundColor: theme.palette.buttons.approve,
              color: theme.palette.buttons.white,
            }}
          >
            <AddIcon color={theme.palette.buttons.white} />
          </IconButton>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContentText
          variant="h6"
          sx={{ fontWeight: 'bold', color: 'black' }}
        >
          Ambassador Details
        </DialogContentText>
        <Typography variant="subtitle2">
          Following are the Ambassador Details
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="normal"
              disabled
              label="name"
              name="name"
              value={formData.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="normal"
              label="instituteName"
              name="instituteName"
              value={formData.instituteName}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="normal"
              label="campusName"
              name="campusName"
              value={formData.campusName}
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="normal"
              label="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="normal"
              label="email"
              name="email"
              value={formData.email}
              disabled
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default AmbassadorDetailsModal;
