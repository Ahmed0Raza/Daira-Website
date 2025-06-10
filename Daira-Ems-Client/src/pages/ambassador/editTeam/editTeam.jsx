import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useRegistration } from '../../../service/registerationService';
import { useSnackbar } from '../../../utils/snackbarContextProvider';
import EventTable from './view/table';
import Spinner from '../../../utils/spinner';

const EditTeam = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { getRegistrationsByUserId, getRegisterationInfo } = useRegistration();
  const { show } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('userData'));
      const tokenData = userData.data;
      const userId = tokenData.result._id;
      const token = tokenData.token;
      try {
        const registrations = await getRegistrationsByUserId(userId, token);
        const rowsData = await Promise.all(
          registrations.map(async (registration, index) => {
            const registrationInfo = await getRegisterationInfo(
              registration._id,
              token
            );
            return {
              sr: index + 1,
              id: registration._id,
              event: registrationInfo.eventName,
              team: registrationInfo.teamName.toLowerCase(),
              participants: registrationInfo.participantsCount,
              participantsName : registrationInfo.participants,
              registrations: registrationInfo.registrationFee,
            };
          })
        );
        setRows(rowsData);
        setFilteredRows(rowsData); 
      } catch (error) {
        show('Error fetching registrations', 'error');
      }
      setLoading(false);
    };

    fetchRegistrations();
  }, [update]);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    if (value === '') {
      setFilteredRows(rows); // Reset to original data when search is empty
    } else {
      const filtered = rows.filter((row) => row.team.includes(value));
      setFilteredRows(filtered);
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: 2,
            marginBottom: 2,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">View Active Registrations</Typography>
            <TextField
              label="Search By Team Name"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearch}
              sx={{
                color: '0 0 0 0.1',
              }}
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
                        borderRadius: '5px 5px 5px 5px',
                      }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: 2,
            }}
          >
            <EventTable update={update} setUpdate={setUpdate} rows={filteredRows} />
          </Box>
        </Box>
      )}
    </>
  );
};

export default EditTeam;
