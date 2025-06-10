import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Container, Accordion,
  AccordionSummary, AccordionDetails, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Divider, CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRegistrationAgent } from '../../../../service/registrationAgentService';
import HeaderFields from '../header/headerFields';

const UnapprovedTeamDetails = ({token}) => {
  const [loading, setLoading] = useState(true);
  const [teamData, setTeamData] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(false);

  const { getUnapprovedTeamInfo } = useRegistrationAgent();

  useEffect(() => {
    const fetchUnapprovedTeams = async () => {
      setLoading(true);
      try {
        const result = await getUnapprovedTeamInfo(token);
        if (result?.teams) {
          setTeamData(result.teams);
          setFilteredTeams(result.teams);
        }
      } catch (error) {
        console.error('Error fetching unapproved team info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnapprovedTeams();
  }, [token]);

  useEffect(() => {
    if (search) {
      const filtered = teamData.filter(team =>
        team.team.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredTeams(filtered);
    } else {
      setFilteredTeams(teamData);
    }
  }, [search, teamData]);

  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Container sx={{ width: "100%", mt: 4, mb: 4 }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold', color: '#f44336' }}>
          Unapproved Team Details
        </Typography>

        <HeaderFields setSearch={setSearch} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress sx={{ color: '#f44336' }} />
          </Box>
        ) : filteredTeams.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: 'center', color: '#666', p: 4 }}>
            No unapproved teams found.
          </Typography>
        ) : (
          filteredTeams.map((team, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              sx={{ mb: 2, borderRadius: 1, '&:before': { display: 'none' }, boxShadow: 'none', border: '1px solid #ddd' }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#ffebee' }}>
                <Typography sx={{ fontWeight: 'bold', color: '#212121' }}>
                  {team.team.name} - {team.event.name} ({team.event.category})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ p: 2, backgroundColor: '#fafafa' }}>
                  <Typography variant="h6" sx={{ color: '#f44336', mb: 2, fontWeight: 'bold' }}>
                    Registration Details
                  </Typography>

                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ backgroundColor: '#ffcdd2', fontWeight: 'bold' }}>Registrant Name</TableCell>
                          <TableCell>{team.registeredBy.name}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ backgroundColor: '#ffcdd2', fontWeight: 'bold' }}>Registrant Email</TableCell>
                          <TableCell>{team.registeredBy.email}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ backgroundColor: '#ffcdd2', fontWeight: 'bold' }}>Team Name</TableCell>
                          <TableCell>{team.team.name}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ backgroundColor: '#ffcdd2', fontWeight: 'bold' }}>Event</TableCell>
                          <TableCell>{team.event.name}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ backgroundColor: '#ffcdd2', fontWeight: 'bold' }}>Category</TableCell>
                          <TableCell>{team.event.category}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" sx={{ color: '#f44336', mb: 2, fontWeight: 'bold' }}>
                    Participant Details
                  </Typography>

                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ backgroundColor: '#ffcdd2', fontWeight: 'bold' }}>Name</TableCell>
                          <TableCell sx={{ backgroundColor: '#ffcdd2', fontWeight: 'bold' }}>CNIC</TableCell>
                          <TableCell sx={{ backgroundColor: '#ffcdd2', fontWeight: 'bold' }}>Contact Number</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {team.participants.map((p, i) => (
                          <TableRow key={i}>
                            <TableCell>{p.name}</TableCell>
                            <TableCell>{p.cnic}</TableCell>
                            <TableCell>{p.contactNumber}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Paper>
    </Container>
  );
};

export default UnapprovedTeamDetails;
