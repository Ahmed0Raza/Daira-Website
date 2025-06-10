import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from '@mui/x-data-grid';
import Columns from './view/columns';
import { useRegistration } from '../../../service/registerationService';
import { useSnackbar } from '../../../utils/snackbarContextProvider';

const ParticipantsHeader = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    participants,
    getParticipantsByiD,
    deleteParticipant,
    refreshParticipants,
    loading,
  } = useRegistration();
  const { show } = useSnackbar();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  const userData = JSON.parse(localStorage.getItem('userData'));
  if (userData?.data) {
    const {
      token,
      result: { _id: useriD },
    } = userData.data;
    getParticipantsByiD(useriD, token);
  }

  const filteredParticipants = searchTerm
    ? participants.filter((participant) =>
        participant.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : participants;

  const rows = filteredParticipants.map((participant, index) => ({
    id: index + 1,
    _id: participant._id,
    name: participant.name,
    contactNumber: participant.contactNumber || 'N/A',
    accomodation: participant.accommodation ? 'Yes' : 'No',
    gender: participant.gender,
  }));

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const onDelete = async () => {
    try {
      const res = await deleteParticipant(
        selectedParticipant._id,
        userData.data.token
      );
      setOpenDialog(false);
      if (res) {
        refreshParticipants();
      } else {
        show('Participant is Registered in a team', 'error');
      }
    } catch (error) {
      console.error('Error during deletion:', error);
      show('Error deleting participant', 'error');
    }
  };

  const handleDeleteClick = (row) => {
    setOpenDialog(true);
    setSelectedParticipant(row);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        padding: '0px 16px',
        borderColor: 'divider',
      }}
    >
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this participant?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={onDelete} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            textAlign: 'center',
            marginBottom: 1,
            fontWeight: 'bold',
          }}
        >
          Participants
        </Typography>

        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by Name"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ width: '100%', maxWidth: '400px' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  sx={{
                    minWidth: '40px',
                    maxWidth: '40px',
                    minHeight: '30px',
                    maxHeight: '30px',
                    backgroundColor: '#FFC107',
                    color: 'white',
                    borderRadius: '5px',
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <DataGrid
        rows={rows}
        columns={Columns(handleDeleteClick).map((col) => ({
          ...col,
          flex: col.flex ?? 1,
          minWidth: 100,
        }))}
        autoHeight
        disableSelectionOnClick
        disableRowSelectionOnClick
        disableColumnSelector
        disableMultipleRowSelection
        disableDensitySelector
        sx={{
          width: '100%',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'rgba(0, 0, 0, 0.06)',
            whiteSpace: 'normal',
            lineHeight: '1.2rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: '#333',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            whiteSpace: 'normal',
            overflow: 'visible',
            textOverflow: 'unset',
          },
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
      />
    </Box>
  );
};

export default ParticipantsHeader;
