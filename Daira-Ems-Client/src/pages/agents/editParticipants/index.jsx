'use client';

import {
  Button,
  Input,
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRegistrationAgent } from '../../../service/registrationAgentService';
import { useState } from 'react';

const UpdateParticipants = () => {
  const { getAmbassadorParticipants, updateParticipant, deleteParticipant } =
    useRegistrationAgent();

  const [email, setEmail] = useState('');
  const [participants, setParticipants] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [editData, setEditData] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const userData = JSON.parse(localStorage.getItem('agentData'));

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'cnic', headerName: 'CNIC', width: 150 },
    { field: 'contactNumber', headerName: 'Contact Number', width: 150 },
    { field: 'gender', headerName: 'Gender', width: 100 },
    {
      field: 'accommodation',
      headerName: 'Accommodation',
      width: 130,
      valueGetter: (params) => (params.row?.accommodation ? 'Yes' : 'No'),
    },
    {
      field: 'accommodation_status',
      headerName: 'Accommodation Status',
      width: 150,
      valueGetter: (params) =>
        params.row?.accommodation_status ? 'Approved' : 'Pending',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const search = async () => {
    try {
      if (!email) {
        setSnackbar({
          open: true,
          message: 'Please enter ambassador email',
          severity: 'warning',
        });
        return;
      }

      const response = await getAmbassadorParticipants(userData.result, email);

      const participantsWithIds =
        response.participants?.map((participant, index) => ({
          ...participant,
          id: participant._id || index,
        })) || [];

      setParticipants(participantsWithIds);
    } catch (error) {
      console.error('Error fetching participants:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch participants',
        severity: 'error',
      });
    }
  };

  const handleEdit = (participant) => {
    setSelectedParticipant(participant);
    setEditData(participant);
    setOpenDialog(true);
  };

  const handleDelete = async (participant) => {
    if (!window.confirm('Are you sure you want to delete this participant?')) {
      return;
    }

    try {
      const response = await deleteParticipant(
        userData.result,
        participant._id
      );
      if (response) {
        setParticipants((prev) =>
          prev.filter((p) => p._id !== participant._id)
        );
        setSnackbar({
          open: true,
          message: 'Participant deleted successfully',
          severity: 'success',
        });
      }
    } catch (error) {
      console.error('Error deleting participant:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete participant',
        severity: 'error',
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedParticipant(null);
    setEditData({});
  };

  const handleSave = async () => {
    try {
      const response = await updateParticipant(
        userData.result,
        selectedParticipant._id,
        editData
      );

      if (response) {
        const updatedParticipants = participants.map((p) =>
          p._id === selectedParticipant._id ? { ...p, ...editData } : p
        );
        setParticipants(updatedParticipants);

        setSnackbar({
          open: true,
          message: 'Participant updated successfully',
          severity: 'success',
        });
      }

      handleCloseDialog();
    } catch (error) {
      console.error('Error saving participant:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update participant',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Update Participant Details
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Input
          type="email"
          placeholder="Enter ambassador email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ width: '100%', maxWidth: '400px' }}
        />
        <Button variant="contained" onClick={search}>
          Search
        </Button>
      </Box>

      {participants.length > 0 ? (
        <Paper sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={participants}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
          />
        </Paper>
      ) : (
        <Typography sx={{ mt: 2, color: 'text.secondary' }}>
          No participants found. Please search for an ambassador.
        </Typography>
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Participant</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Name"
                fullWidth
                value={editData.name || ''}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="CNIC"
                fullWidth
                value={editData.cnic || ''}
                onChange={(e) =>
                  setEditData({ ...editData, cnic: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Contact Number"
                fullWidth
                value={editData.contactNumber || ''}
                onChange={(e) =>
                  setEditData({ ...editData, contactNumber: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Gender</InputLabel>
                <Select
                  value={editData.gender || ''}
                  label="Gender"
                  onChange={(e) =>
                    setEditData({ ...editData, gender: e.target.value })
                  }
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editData.accommodation || false}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        accommodation: e.target.checked,
                      })
                    }
                  />
                }
                label="Accommodation Required"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editData.accommodation_status || false}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        accommodation_status: e.target.checked,
                      })
                    }
                  />
                }
                label="Accommodation Status"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateParticipants;
