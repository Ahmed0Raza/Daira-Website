import { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import TickPlacementBars from '../../../components/BarChart';
import { useRegistration } from '../../../service/registerationService';
import Spinner from '../../../utils/spinner';

const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(
    localStorage.getItem('dashboardViewed') === 'true' ? false : true
  );
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleNextStep = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      setModalOpen(false);
      localStorage.setItem('dashboardViewed', 'true');
    }
  };

  const userData = JSON.parse(localStorage.getItem('userData'));
  const userId = userData.data.result._id;
  const token = userData.data.token;
  const { getStatistics, getParticipantsByDay } = useRegistration();

  const [dataset, setDataset] = useState();
  const [statistics, setStatistics] = useState({});
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      const stats = await getStatistics(userId, token);
      if (stats) {
        setStatistics(stats);
      }

      const pieData = [];
      for (const key in stats.registrationsByCategory) {
        pieData.push({
          id: key,
          value: stats.registrationsByCategory[key],
          label: key,
        });
      }
      setPieChartData(pieData);
      setLoading(false);
    };

    const fetchParticipantsByDay = async () => {
      await getParticipantsByDay(userId, token)
        .then((data) => {
          setDataset(data);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    fetchStatistics();
    fetchParticipantsByDay();
  }, []);

  const unAssignedParticipant =
    statistics?.totalParticipants - statistics?.assignedParticipants;

  const cardsData = [
    {
      id: 1,
      title: statistics?.totalRegistrations,
      content: 'Teams registered',
    },
    {
      id: 2,
      title: statistics?.totalParticipants,
      content: 'Total Participants',
    },
    {
      id: 3,
      title: statistics?.totalPayable,
      content: 'Unpaid pending amount',
    },
    {
      id: 4,
      title: statistics?.total_accomodation,
      content: 'Total accommodations',
    },
  ];

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
            <DialogTitle
              sx={{
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              Get Started
            </DialogTitle>
            <DialogContent>
              {step === 0 && (
                <>
                  <Typography>
                    <span className="font-bold">Step 1:</span> Add Participants
                    from the participant tab.
                  </Typography>
                  {/* <img
                src="https://daira-media.s3.ap-south-1.amazonaws.com/1.png"
                alt="steps"
              /> */}
                </>
              )}
              {step === 1 && (
                <>
                  <Typography>
                    <span className="font-bold">Step 2:</span> Enter the
                    participants details, from the Manage Participants tab.
                  </Typography>
                  {/* <img
                src="https://daira-media.s3.ap-south-1.amazonaws.com/2.png"
                alt="steps"
              /> */}
                </>
              )}
              {step === 2 && (
                <>
                  <Typography>
                    <span className="font-bold">Step 3:</span> Register in the
                    events in the My Registrations tab with the participatns you
                    added in the previous steps.
                  </Typography>
                  {/* <img
                src="https://daira-media.s3.ap-south-1.amazonaws.com/3.png"
                alt="steps"
              /> */}
                </>
              )}
            </DialogContent>
            <DialogActions>
              {step < 2 ? (
                <Button onClick={handleNextStep}>Next</Button>
              ) : (
                <Button onClick={handleNextStep}>Finish</Button>
              )}
            </DialogActions>
          </Dialog>
          <Box
            sx={{
              padding: '0px 10px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Grid container spacing={2}>
              {cardsData.map((card) => (
                <Grid key={card.id} item xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      height: { xs: 200, sm: 220, md: 250 },
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      padding: 2,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0px 4px 15px rgba(0,0,0,0.2)',
                      },
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          fontSize: { xs: '20px', sm: '22px', md: '24px' },
                          color: '#50149F',
                          fontWeight: 'bold',
                        }}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: '14px', sm: '15px', md: '16px' },
                          color: '#444',
                          marginTop: '10px',
                        }}
                      >
                        {card.content}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {/* Pie Chart */}
              <Grid item xs={12} md={6}>
                <Card
                  style={{
                    backgroundColor: 'white',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  <CardContent>
                    <Typography
                      sx={{
                        fontSize: '24px',
                        fontWeight: 500,
                        textAlign: 'center',
                        marginBottom: '16px',
                      }}
                    >
                      Participants Comparison
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        width: '100%',
                      }}
                    >

                      <PieChart
                        series={[
                          {
                            data: [
                              {
                                id: 0,
                                value: statistics?.assignedParticipants,
                                label: 'Assigned',
                                color: '#50149F',
                              },
                              {
                                id: 1,
                                value: unAssignedParticipant,
                                label: 'Unassigned',
                                color: '#FFC107',
                              },
                            ],
                            innerRadius: 60,
                            outerRadius: 120,
                            paddingAngle: 3,
                            cornerRadius: 5,
                            startAngle: -90,
                            endAngle: 270,
                            cx: 200,
                            cy: 130,
                            highlightScope: {
                              faded: 'global',
                              highlighted: 'item',
                            },
                            faded: {
                              innerRadius: 60,
                              additionalRadius: -20,
                              color: 'rgba(0, 0, 0, 0.15)',
                            },
                            arcLabel: null,
                            valueFormatter: () => '',
                          },
                        ]}
                        width={400}
                        height={300}
                        slotProps={{
                          legend: { hidden: true },
                        }}
                      />

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '40px',
                          marginTop: '16px',
                          marginBottom: '8px',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <Box
                            sx={{
                              width: '16px',
                              height: '16px',
                              backgroundColor: '#50149F',
                              borderRadius: '2px',
                            }}
                          />
                          <Typography sx={{ fontSize: '14px' }}>
                            Assigned: {statistics?.assignedParticipants}%
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <Box
                            sx={{
                              width: '16px',
                              height: '16px',
                              backgroundColor: '#FFC107',
                              borderRadius: '2px',
                            }}
                          />
                          <Typography sx={{ fontSize: '14px' }}>
                            Unassigned: {unAssignedParticipant}%
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card
                  style={{
                    backgroundColor: 'white',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  <CardContent>
                    <Typography
                      sx={{
                        fontSize: '24px',
                        fontWeight: 500,
                        textAlign: 'center',
                        marginBottom: '16px',
                      }}
                    >
                      Registrations by Category
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        width: '100%',
                      }}
                    >
                      <PieChart
                        series={[
                          {
                            data: pieChartData.map((item, index) => ({
                              ...item,
                              color: [
                                '#50149F',
                                '#FFC107',
                                '#FF5733',
                                '#00A86B',
                              ][index % 4],
                            })),
                            innerRadius: 60,
                            outerRadius: 120,
                            paddingAngle: 3,
                            cornerRadius: 5,
                            startAngle: -90,
                            endAngle: 270,
                            cx: 200,
                            cy: 130,
                            highlightScope: {
                              faded: 'global',
                              highlighted: 'item',
                            },
                            faded: {
                              innerRadius: 60,
                              additionalRadius: -20,
                              color: 'rgba(0, 0, 0, 0.15)',
                            },
                            arcLabel: null,
                            valueFormatter: () => '',
                          },
                        ]}
                        width={400}
                        height={300}
                        slotProps={{ legend: { hidden: true } }}
                      />

                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'center',
                          gap: '16px',
                          maxWidth: '80%',
                          maxHeight: { xs: 'none', md: '30px' },
                          overflowY: { xs: 'visible', md: 'auto' },
                          marginTop: '16px',
                        }}
                      >
                        {pieChartData.map((item, index) => (
                          <Box
                            key={item.label}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <Box
                              sx={{
                                width: '16px',
                                height: '16px',
                                backgroundColor: [
                                  '#50149F',
                                  '#FFC107',
                                  '#FF5733',
                                  '#00A86B',
                                ][index % 4],
                                borderRadius: '2px',
                              }}
                            />
                            <Typography sx={{ fontSize: '14px' }}>
                              {item.label}: {item.value}%
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card
                  style={{
                    backgroundColor: 'white',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <CardContent sx={{ width: '100%', textAlign: 'center' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        overflow: 'hidden',
                      }}
                    >
                      <Box sx={{ maxWidth: '100%', width: '100%' }}>
                        <TickPlacementBars
                          dataset={dataset}
                          color="#FFC107"
                          style={{ width: '100%' }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </>
  );
};

export default Dashboard;
