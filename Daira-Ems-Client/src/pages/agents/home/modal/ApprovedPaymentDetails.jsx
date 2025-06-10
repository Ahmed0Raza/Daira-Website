import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Divider,
  Button,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRegistrationAgent } from '../../../../service/registrationAgentService';
import HeaderFields from '../header/headerFields';

const ApprovedPaymentDetails = ({token}) => {
  const [loading, setLoading] = useState(true);
  const [teamData, setTeamData] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(false);

  const { getApprovedTeamPaymentInfo } = useRegistrationAgent();
  useEffect(() => {
    const fetchApprovedTeams = async () => {
      setLoading(true);
      try {
        const result = await getApprovedTeamPaymentInfo(token);
        if (result?.teams) {
          setTeamData(result.teams);
          setFilteredTeams(result.teams);
        }
      } catch (error) {
        console.error('Error fetching approved team payment info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedTeams();
  }, [token]);

  useEffect(() => {
    if (search) {
      const filtered = teamData.filter(team =>
        team.team.name.toLowerCase().includes(search)
      );
      setFilteredTeams(filtered);
    } else {
      setFilteredTeams(teamData);
    }
  }, [search, teamData]);

  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handlePrint = (index) => {
    const printContent = document.getElementById(`team-details-${index}`);
    const printWindow = window.open('', '_blank', 'width=1000,height=1000,left=100,top=100');

    printWindow.document.write(`
      <html>
        <head>
          <title>Team Payment Details</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { margin-bottom: 20px; }
            .logo { width: 150px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="https://res.cloudinary.com/ddxgntu3g/image/upload/v1743177316/daira_logo_kkhvww.jpg" class="logo" />
          </div>
          ${printContent.innerHTML}
          <script>
            window.onload = () => {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Container sx={{ width: "100%", mt: 4, mb: 4 }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold', color: '#ffc107' }}>
          Approved Payment Details
        </Typography>

        <HeaderFields setSearch={setSearch} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress sx={{ color: '#ffc107' }} />
          </Box>
        ) : filteredTeams.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: 'center', color: '#666', p: 4 }}>
            No approved payments found.
          </Typography>
        ) : (
          filteredTeams.map((team, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              sx={{
                mb: 2,
                borderRadius: 1,
                '&:before': { display: 'none' },
                boxShadow: 'none',
                border: '1px solid #ddd',
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#fff3cd' }}>
                <Typography sx={{ fontWeight: 'bold', color: '#212121' }}>
                  {team.team.name} - {team.event.name} ({team.event.category})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box id={`team-details-${index}`}>
                  <Box sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                    <Typography variant="h6" sx={{ color: '#ffc107', mb: 2, fontWeight: 'bold' }}>
                      Registration Details
                    </Typography>

                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ backgroundColor: '#ffc107', fontWeight: 'bold' }}>
                              Registrant Name
                            </TableCell>
                            <TableCell>{team.registeredBy.name}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ backgroundColor: '#ffc107', fontWeight: 'bold' }}>
                              Registrant Email
                            </TableCell>
                            <TableCell>{team.registeredBy.email}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ backgroundColor: '#ffc107', fontWeight: 'bold' }}>
                              Team Name
                            </TableCell>
                            <TableCell>{team.team.name}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ backgroundColor: '#ffc107', fontWeight: 'bold' }}>
                              Event
                            </TableCell>
                            <TableCell>{team.event.name}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ backgroundColor: '#ffc107', fontWeight: 'bold' }}>
                              Category
                            </TableCell>
                            <TableCell>{team.event.category}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" sx={{ color: '#ffc107', mb: 2, fontWeight: 'bold' }}>
                      Payment Details
                    </Typography>

                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ backgroundColor: '#ffc107', fontWeight: 'bold' }}>
                              Payment Received
                            </TableCell>
                            <TableCell>{team.payable}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Box>

                <Box sx={{ textAlign: 'right', mt: 2 }}>
                  <Button variant="contained" color="warning" onClick={() => handlePrint(index)}>
                    Print
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Paper>
    </Container>
  );
};

export default ApprovedPaymentDetails;
