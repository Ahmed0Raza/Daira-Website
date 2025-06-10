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
import ConfirmAdd from '../dialogues/ConfirmAdd.jsx';
import { useSnackbar } from '../../../../utils/snackbarContextProvider.jsx';
import { useAmbassador } from '../../../../service/ambassadorService.jsx';
import ConfirmUpdate from '../dialogues/ConfirmUpdate.jsx';

const AmbassadorDetailsModal = ({
  open,
  handleClose,
  onSubmit,
  ambassadorID,
  setCount,
}) => {
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const theme = useTheme();
  const { getAmbassador, approveAmbassador, updateAmbassador } =
    useAmbassador();
  const { show } = useSnackbar();
  const [status, setStatus] = useState('');
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddConfirm = async () => {
    const response = await approveAmbassador(ambassadorID);

    if (response) {
      show('Ambassador approved successfully', 'success');
      handleClose();
      setIsConfirmationDialogOpen(false);
      setCount((prev) => prev + 1);
    } else {
      show('Failed to approve ambassador', 'error');
    }
  };

  const handleUpdate = async () => {
    const response = await updateAmbassador(ambassadorID, formData);

    if (response) {
      show('Ambassador updated successfully', 'success');
      handleClose();
      setIsUpdateDialogOpen(false);
      setCount((prev) => prev + 1);
    } else {
      show('Failed to update ambassador', 'error');
    }
  };

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
          department: response.department,
          rollnumber: response.rollNumber,
          city: response.city,
          phoneNumber: response.phoneNumber,
          email: response.email,
          studentAffairOfficerName: response.studentAffairOfficerName,
          studentAffairOfficerContact: response.studentAffairOfficerContact,
          previousExperience: response.previousExperience,
          plansOfDaira: response.plansOfDaira,
          participantsNumber: response.participantsNumber,
          typeOfInstitute: response.typeOfInstitute,
          batch: response.batch,
          attendedDairaBefore: response.attendedDairaBefore,
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
      <ConfirmAdd
        open={isConfirmationDialogOpen}
        onClose={() => setIsConfirmationDialogOpen(false)}
        onConfirm={handleAddConfirm}
        //loading={creatingApp}
        entity="username"
      />
      <ConfirmUpdate
        open={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
        onConfirm={handleUpdate}
        //loading={creatingApp}
      />
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
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="normal"
              label="instituteName"
              name="instituteName"
              value={formData.instituteName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="normal"
              label="campusName"
              name="campusName"
              value={formData.campusName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="normal"
              label="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="normal"
              label="rollnumber"
              name="rollnumber"
              value={formData.rollnumber}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="normal"
              label="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="normal"
              label="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="normal"
              label="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="normal"
              label="studentAffairOfficerName"
              name="studentAffairOfficerName"
              value={formData.studentAffairOfficerName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="normal"
              label="studentAffairOfficerContact"
              name="studentAffairOfficerContact"
              value={formData.studentAffairOfficerContact}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              disabled
              margin="normal"
              label="previousExperience"
              name="previousExperience"
              value={formData.previousExperience}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              disabled
              margin="normal"
              label="plansOfDaira"
              name="plansOfDaira"
              value={formData.plansOfDaira}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              disabled
              margin="normal"
              label="participantsNumber"
              name="participantsNumber"
              value={formData.participantsNumber}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="normal"
              label="typeOfInstitute"
              name="typeOfInstitute"
              value={formData.typeOfInstitute}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              disabled
              margin="normal"
              label="batch"
              name="batch"
              value={formData.batch}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              disabled
              margin="normal"
              label="attendedDairaBefore"
              name="attendedDairaBefore"
              value={formData.attendedDairaBefore}
              onChange={handleChange}
            />
          </Grid>
          {!status ? (
            <>
              <Grid item xs={12} sm={6}></Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  onClick={() => setIsUpdateDialogOpen(true)}
                  sx={{
                    color: theme.palette.text.secondary,
                    backgroundColor: theme.palette.buttons.approve,
                    '&:hover': {
                      backgroundColor: theme.palette.buttons.approveHover,
                    },
                  }}
                >
                  Update
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  onClick={handleClose}
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.palette.buttons.approve,
                      color: theme.palette.text.secondary,
                    },
                  }}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  onClick={() => setIsConfirmationDialogOpen(true)}
                  sx={{
                    color: theme.palette.text.secondary,
                    backgroundColor: theme.palette.buttons.approve,
                    '&:hover': {
                      backgroundColor: theme.palette.buttons.approveHover,
                    },
                  }}
                >
                  Approve
                </Button>
              </Grid>
            </>
          ) : (
            <></>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default AmbassadorDetailsModal;
