import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Checkbox,
  Paper,
  Box,
} from '@mui/material';
import { useRegistrationAgent } from '../../../../service/registrationAgentService';
import HeaderFieldsTeam from '../header/headerFieldsTeam';
import HeaderFieldsAccommodation from '../header/headerFieldsAccommodation';

const Invoice = ({ searchData }) => {
  const { createInvoiceCards } = useRegistrationAgent();
  const userData = JSON.parse(localStorage.getItem('agentData'));

  const [masterData, setMasterData] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [filteredAccommodation, setFilteredAccommodation] = useState([]);
  
  // States for tracking selected items
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedAccommodations, setSelectedAccommodations] = useState([]);
  const [activeTab, setActiveTab] = useState('teams'); // To track which table is active

  useEffect(() => {
    if (searchData) {
      setMasterData(searchData);
      setFilteredTeams(
        searchData.filter(
          (item) => item.teamApproved && item.teamApproved.length > 0
        )
      );
      setFilteredAccommodation(
        searchData.filter(
          (item) => !item.teamApproved || item.teamApproved.length === 0
        )
      );
    }
  }, [searchData]);

  // Handle checkbox selection for teams
  const handleTeamSelect = (id) => {
    setSelectedTeams(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        // If selecting a team item, clear any accommodation selections
        setSelectedAccommodations([]);
        setActiveTab('teams');
        return [...prev, id];
      }
    });
  };

  // Handle checkbox selection for accommodations
  const handleAccommodationSelect = (id) => {
    setSelectedAccommodations(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        // If selecting an accommodation item, clear any team selections
        setSelectedTeams([]);
        setActiveTab('accommodation');
        return [...prev, id];
      }
    });
  };

  // Handle print for multiple items
  const HandlePrint = async () => {
    const selectedIds = activeTab === 'teams' ? selectedTeams : selectedAccommodations;
    const type = activeTab === 'teams' ? 'reg' : 'acc';
    
    if (selectedIds.length === 0) {
      alert('Please select at least one item to print');
      return;
    }

    try {
      console.log("userdata", userData.result);
      console.log("Sending IDs:", selectedIds, "Type:", type);
      
      const { cardsString } = await createInvoiceCards(userData.result, selectedIds, type);
      
      if (cardsString) {
        const printWindow = window.open(
          '',
          '_blank',
          'width=1000,height=1000,left=100,top=100'
        );
        printWindow.document.write(cardsString);
        printWindow.document.close();
        printWindow.addEventListener('load', function () {
          printWindow.focus();
          printWindow.print();
          setTimeout(() => {
            printWindow.close();
          }, 10);
        });
        
        // Clear selections after successful print
        if (type === 'reg') {
          setSelectedTeams([]);
        } else {
          setSelectedAccommodations([]);
        }
      } else {
        alert('No invoice data found.');
      }
    } catch (error) {
      console.error("Error printing cards:", error);
      alert('Error occurred while printing. Please try again.');
    }
  };

  // Determine if print button should be visible
  const showPrintButton = selectedTeams.length > 0 || selectedAccommodations.length > 0;

  return (
    <Container sx={{ mt: 3, paddingBottom: '40px' }}>
      {/* Ambassador Name */}
      <Typography
        variant="h5"
        sx={{ fontWeight: 'bold', fontSize: '26px', mb: 1, color: '#ffc107' }}
      >
        {masterData[0] ? masterData[0].name : 'Ambassador Name'}
      </Typography>

      {/* Print button that appears when items are selected */}
      {showPrintButton && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            onClick={HandlePrint}
            sx={{
              textTransform: 'none',
              backgroundColor: '#ffc107',
              color: '#212121',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#ffca28',
              },
            }}
          >
            Print Selected Cards ({activeTab === 'teams' ? selectedTeams.length : selectedAccommodations.length})
          </Button>
        </Box>
      )}

      {/* Registrations Section */}
      <Typography
        variant="h4"
        sx={{ textAlign: 'left', mb: 2, fontWeight: 'bold', color: '#ffc107' }}
      >
        Registrations
      </Typography>

      {/* Team Search Bar */}
      <HeaderFieldsTeam masterData={masterData} setData={setFilteredTeams} />

      {/* Registration Table */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="invoice table">
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{
                  fontWeight: 'bold',
                  backgroundColor: '#ffc107',
                  color: '#212121',
                  width: '50px'
                }}
                align="center"
              >
                Select
              </TableCell>
              {[
                'Invoice Number',
                'Teams Approved',
                'Team Names',
                'Discount',
                'Paid Amount',
                'Time',
              ].map((header, index) => (
                <TableCell
                  key={index}
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor: '#ffc107',
                    color: '#212121',
                  }}
                  align={index === 0 ? 'left' : 'center'}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTeams.map((item) => (
              <TableRow 
                key={item.id}
                sx={{
                  backgroundColor: selectedTeams.includes(item.id) ? '#fff3cd' : 'inherit',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <TableCell align="center">
                  <Checkbox
                    checked={selectedTeams.includes(item.id)}
                    onChange={() => handleTeamSelect(item.id)}
                    disabled={selectedAccommodations.length > 0}
                    sx={{
                      color: '#ffc107',
                      '&.Mui-checked': {
                        color: '#ffc107',
                      },
                    }}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  {item.invoiceId}
                </TableCell>
                <TableCell align="center">{item.teamApproved.length}</TableCell>
                <TableCell align="center">
                  {item.teamApproved.join(', ')}
                </TableCell>
                <TableCell align="center">{item.discount}</TableCell>
                <TableCell align="center">{item.totalBill}</TableCell>
                <TableCell align="center">{item.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Accommodation Section */}
      <Typography
        variant="h4"
        sx={{
          textAlign: 'left',
          mt: 5,
          mb: 2,
          fontWeight: 'bold',
          color: '#ffc107',
        }}
      >
        Accommodation
      </Typography>

      {/* Accommodation Search Bar */}
      <HeaderFieldsAccommodation
        masterData={masterData}
        setData={setFilteredAccommodation}
      />

      {/* Accommodation Table */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="accommodation table">
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{
                  fontWeight: 'bold',
                  backgroundColor: '#ffc107',
                  color: '#212121',
                  width: '50px'
                }}
                align="center"
              >
                Select
              </TableCell>
              {[
                'Invoice Number',
                'Name',
                'CNIC Number',
                'Phone Number',
                'Time',
              ].map((header, index) => (
                <TableCell
                  key={index}
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor: '#ffc107',
                    color: '#212121',
                  }}
                  align={index === 0 ? 'left' : 'center'}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAccommodation.map((item) => (
              <TableRow 
                key={item.id}
                sx={{
                  backgroundColor: selectedAccommodations.includes(item.id) ? '#fff3cd' : 'inherit',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <TableCell align="center">
                  <Checkbox
                    checked={selectedAccommodations.includes(item.id)}
                    onChange={() => handleAccommodationSelect(item.id)}
                    disabled={selectedTeams.length > 0}
                    sx={{
                      color: '#ffc107',
                      '&.Mui-checked': {
                        color: '#ffc107',
                      },
                    }}
                  />
                </TableCell>
                <TableCell align="center">{item.invoiceId}</TableCell>
                <TableCell align="center">
                  {item.participantDetails
                    .map((participant) => participant.name)
                    .join(', ')}
                </TableCell>
                <TableCell align="center">
                  {item.participantDetails
                    .map((participant) => participant.cnic)
                    .join(', ')}
                </TableCell>
                <TableCell align="center">
                  {item.participantDetails
                    .map((participant) => participant.contactNumber)
                    .join(', ')}
                </TableCell>
                <TableCell align="center">{item.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Invoice;