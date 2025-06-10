import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRegistrationAgent } from '../../../../service/registrationAgentService';
import { useSnackbar } from '../../../../utils/snackbarContextProvider';

function InvoiceModal({ invoiceData }) {
  const { show } = useSnackbar();

  const { approveRegistration, createRegistrationInvoice } =
    useRegistrationAgent();
  const userData = JSON.parse(localStorage.getItem('agentData'));
  const [state, setState] = useState({
    invoiceRows: [],
    accommodationRows: [],
    selectedInvoiceRows: [],
    invoiceId: '',
    selectedAccommodationRows: [],
    totalTeams: 0,
    totalAccommodations: 0,
    totalParticipantsInTeams: 0,
    totalFees: 0,
    totalSelectedParticipants: 0,
    comments: '',
    discountType: 'fixed',
    discountValue: 0,
    grandTotal: 0,
  });

  useEffect(() => {
    if (invoiceData) {
      console.log(invoiceData);
      setState((prev) => ({
        ...prev,
        invoiceRows: invoiceData.filteredRegistrationTableData || [],
        accommodationRows: invoiceData.filteredAccommodationTableData || [],
        totalParticipantsInTeams: invoiceData.totalParticipantsInTeams || 0,
      }));
    }
  }, [invoiceData]);

  useEffect(() => {
    calculateTotals();
  }, [
    state.selectedInvoiceRows,
    state.selectedAccommodationRows,
    state.discountType,
    state.discountValue,
  ]);

  const calculateTotals = () => {
    let regFees = 0,
      teams = 0,
      accFees = 0,
      accommodations = 0,
      selectedParticipants = 0;

    state.selectedInvoiceRows.forEach((id) => {
      const found = state.invoiceRows.find((item) => item.id === id);
      if (found) {
        regFees += found.fee;
        teams += 1;
        selectedParticipants += found.participantsCount;
      }
    });

    state.selectedAccommodationRows.forEach((id) => {
      const found = state.accommodationRows.find((item) => item.id === id);
      if (found) {
        accFees += found.fee;
        accommodations++;
      }
    });

    const totalFees = regFees + accFees;
    const finalDiscount =
      state.discountType === 'percentage'
        ? totalFees * (state.discountValue / 100)
        : state.discountValue;
    let grandTotal = totalFees - finalDiscount;

    if (grandTotal < 0) grandTotal = 0;

    setState((prev) => ({
      ...prev,
      totalTeams: teams,
      totalAccommodations: accommodations,
      totalFees: totalFees,
      totalSelectedParticipants: selectedParticipants,
      grandTotal: grandTotal,
    }));
  };

  const handleCheckboxChange = (id, type) => {
    setState((prev) => ({
      ...prev,
      [type]: prev[type].includes(id)
        ? prev[type].filter((item) => item !== id)
        : [...prev[type], id],
    }));
  };

  const handleDiscountChange = (e) => {
    setState((prev) => ({
      ...prev,
      discountValue: e.target.value < 0 ? e.target.value * -1 : e.target.value,
    }));
  };

  const handleChange = (event, key) => {
    setState((prev) => ({
      ...prev,
      [key]: event.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (state.invoiceId) {
      const data = {
        userId: invoiceData.userId,
        registration_ids: state.selectedInvoiceRows,
        participant_ids: state.selectedAccommodationRows,
        amount_payable: state.grandTotal,
        discount: state.discountValue,
        log: state.comments,
        agentId: userData.id,
        invoiceId: state.invoiceId,
      };

      await approveRegistration(userData.result, data);

      // reset state
      setState({
        invoiceRows: [],
        accommodationRows: [],
        selectedInvoiceRows: [],
        invoiceId: '',
        selectedAccommodationRows: [],
        totalTeams: 0,
        totalAccommodations: 0,
        totalParticipantsInTeams: 0,
        totalFees: 0,
        totalSelectedParticipants: 0,
        comments: '',
        discountType: 'fixed',
        discountValue: 0,
        grandTotal: 0,
      });
    } else {
      show('Generate Invoice First', 'error');
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();

    const data = {
      userId: invoiceData.userId,
      registration_ids: state.selectedInvoiceRows,
      participant_ids: state.selectedAccommodationRows,
      amount_payable: state.grandTotal,
      discount: state.discountValue,
      log: state.comments,
      agentId: userData.id,
    };

    const { invoice, invoiceId } = await createRegistrationInvoice(
      userData.result,
      data
    );
    if (invoice) {
      setState((prev) => ({
        ...prev,
        invoiceId: invoiceId,
      }));
      const printWindow = window.open(
        '',
        '_blank',
        'width=1000,height=1000,left=100,top=100'
      );

      printWindow.document.write(invoice);
      printWindow.document.close();
      printWindow.addEventListener('load', function () {
        printWindow.focus();
        printWindow.print();
        setTimeout(() => {
          printWindow.close();
        }, 10);
      });
    }
  };

  return (
    <div>
      <Container>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 'bold', marginBottom: '10px', color: '#FFC107' }}
          >
            REGISTRATIONS
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead sx={{ backgroundColor: '#FFC107', color: 'white' }}>
                <TableRow>
                  <TableCell padding="checkbox"></TableCell>
                  <TableCell>Team Name</TableCell>
                  <TableCell align="right">Fee</TableCell>
                  <TableCell align="right">Event Name</TableCell>
                  <TableCell align="right">Status</TableCell>
                  <TableCell align="center">Participants</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.invoiceRows.map((row) => (
                  <TableRow
                    key={row.id}
                    selected={state.selectedInvoiceRows.includes(row.id)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={state.selectedInvoiceRows.includes(row.id)}
                        onChange={() =>
                          handleCheckboxChange(row.id, 'selectedInvoiceRows')
                        }
                        sx={{
                          '& .MuiSvgIcon-root': {
                            border: '2px solid',
                            borderColor: 'primary.dark',
                            borderRadius: '3px',
                            backgroundColor: 'background.paper',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.teamName}
                    </TableCell>
                    <TableCell align="right">{row.fee}</TableCell>
                    <TableCell align="right">{row.eventName}</TableCell>
                    <TableCell align="right">{row.status}</TableCell>
                    <TableCell align="left">
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                        >
                          <Typography>
                            Participants: {row.participantsCount}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <TableContainer component={Paper}>
                            <Table
                              sx={{ minWidth: 200 }}
                              aria-label="simple table"
                            >
                              <TableHead
                                sx={{
                                  backgroundColor: '#FFC107',
                                  color: 'white',
                                }}
                              >
                                <TableRow>
                                  <TableCell>Participant Name</TableCell>
                                  <TableCell align="right">
                                    Participant CNIC
                                  </TableCell>
                                  <TableCell align="right">
                                    Accommodation
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {row.participants.map((participant, key) => (
                                  <TableRow key={key}>
                                    <TableCell component="th" scope="row">
                                      {participant?.name}
                                    </TableCell>
                                    <TableCell align="right">
                                      {participant?.cnic}
                                    </TableCell>
                                    <TableCell align="right">
                                      {participant?.accommodation
                                        ? 'Yes'
                                        : 'No'}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </AccordionDetails>
                      </Accordion>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ marginTop: '20px' }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 'bold', marginBottom: '10px', color: '#FFC107' }}
          >
            ACCOMMODATION
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead sx={{ backgroundColor: '#FFC107', color: 'white' }}>
                <TableRow>
                  <TableCell padding="checkbox"></TableCell>
                  <TableCell>Participant Name</TableCell>
                  <TableCell align="right">Number of Teams</TableCell>
                  <TableCell align="right">Gender</TableCell>
                  <TableCell align="right">Fee</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.accommodationRows.map((row) => (
                  <TableRow
                    key={row.id}
                    selected={state.selectedAccommodationRows.includes(row.id)}
                    sx={{
                      backgroundColor: row.processable ? 'inherit' : '#f0f0f0',
                      pointerEvents: row.processable ? 'auto' : 'none',
                      color: row.processable ? 'inherit' : '#999',
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={state.selectedAccommodationRows.includes(
                          row.id
                        )}
                        disabled={!row.processable}
                        onChange={() =>
                          handleCheckboxChange(
                            row.id,
                            'selectedAccommodationRows'
                          )
                        }
                        sx={{
                          '& .MuiSvgIcon-root': {
                            border: '2px solid',
                            borderColor: 'primary.dark',
                            borderRadius: '3px',
                            backgroundColor: 'background.paper',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.participantName}
                    </TableCell>
                    <TableCell align="right">{row.numberOfTeams}</TableCell>
                    <TableCell align="right">{row.gender}</TableCell>
                    <TableCell align="right">{row.fee}</TableCell>
                    <TableCell align="right">{row.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              marginTop: '30px',
              marginBottom: '30px',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="discount-type-label">
                    Discount Type
                  </InputLabel>
                  <Select
                    labelId="discount-type-label"
                    id="discount-type-select"
                    value={state.discountType}
                    label="Discount Type"
                    onChange={(e) => handleChange(e, 'discountType')}
                    size="small"
                  >
                    <MenuItem value="fixed">Fixed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Discount Value"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={state.discountValue}
                  onChange={(e) => handleDiscountChange(e)}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Comments"
              variant="outlined"
              value={state.comments}
              onChange={(e) => handleChange(e, 'comments')}
              multiline
              rows={4}
              sx={{ marginTop: 2 }}
            />

            <Grid container spacing={2} sx={{ marginTop: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  Total Participants in Teams: {state.totalParticipantsInTeams}
                </Typography>
                <Typography variant="body1">
                  Total Selected Participants: {state.totalSelectedParticipants}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  Total Teams: {state.totalTeams}
                </Typography>
                <Typography variant="body1">
                  Total Accommodations: {state.totalAccommodations}
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ marginTop: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 'bold', color: 'error.main' }}
                >
                  Discount: -{state.discountValue} PKR
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 'bold', color: 'success.main' }}
                >
                  Grand Total: {state.grandTotal.toFixed(2)} PKR
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Button
                    onClick={handleGenerate}
                    variant="contained"
                    fullWidth
                    size="medium"
                    sx={{
                      backgroundColor: '#FFC107',
                      color: '#000',
                      '&:hover': {
                        backgroundColor: '#E0A800',
                      },
                    }}
                  >
                    Generate Invoice
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="medium"
                    sx={{
                      backgroundColor: '#FFC107',
                      color: '#000',
                      '&:hover': {
                        backgroundColor: '#E0A800',
                      },
                    }}
                  >
                    Submit
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </form>
      </Container>
    </div>
  );
}

export default InvoiceModal;
