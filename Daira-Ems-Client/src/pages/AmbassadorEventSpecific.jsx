'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Box,
  Chip,
  Skeleton,
  InputAdornment,
  Avatar,
  LinearProgress,
  Badge,
} from '@mui/material';
import { useAmbassador } from '../service/ambassadorService';
import { useSnackbar } from '../utils/snackbarContextProvider';
import {
  FiSearch,
  FiUsers,
  FiAward,
  FiBriefcase,
  FiCode,
  FiActivity,
  FiBookOpen,
  FiMonitor,
  FiPenTool,
} from 'react-icons/fi';

// Styled components for enhanced UI
const PageWrapper = styled.div`
  min-height: 100vh;
  padding: 1rem 0;

  @media (min-width: 768px) {
    padding: 2rem 0;
  }
`;

const StyledContainer = styled(Container)`
  padding: 0 1rem;
  max-width: 100vw;
  overflow-x: hidden;
  box-sizing: border-box;

  @media (min-width: 768px) {
    padding: 0 2rem;
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #f59e0b, #d97706);
    border-radius: 2px;
  }
`;

const Title = styled(Typography)`
  color: #1f2937;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #f59e0b, #d97706);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(Typography)`
  color: #6b7280;
  font-size: 1rem;
  max-width: 600px;
  margin: 0 auto;

  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const SearchContainer = styled(Paper)`
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  background: white;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  }
`;

const SearchField = styled(TextField)`
  .MuiOutlinedInput-root {
    border-radius: 12px;
    transition: all 0.2s ease;

    &:hover fieldset {
      border-color: #f59e0b;
    }
    &.Mui-focused fieldset {
      border-color: #f59e0b;
      border-width: 2px;
    }
  }

  .MuiInputLabel-root.Mui-focused {
    color: #f59e0b;
  }

  .MuiInputAdornment-root {
    color: #9ca3af;
  }
`;

const StyledAccordion = styled(Accordion)`
  margin-bottom: 1rem;
  border-radius: 16px !important;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
  transition: all 0.3s ease;

  &:before {
    display: none;
  }

  &.Mui-expanded {
    margin-bottom: 1.5rem;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08) !important;
  }

  .MuiAccordionSummary-root {
    background-color: #fff;
    padding: 0 1.5rem;
    min-height: 72px;
    transition: all 0.2s ease;

    &:hover {
      background-color: #fffbeb;
    }

    &.Mui-expanded {
      background: linear-gradient(to right, #fef3c7, #fff);
      border-bottom: 1px solid rgba(245, 158, 11, 0.1);
    }
  }

  .MuiAccordionSummary-content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .MuiAccordionDetails-root {
    padding: 1.5rem;
  }
`;

const AmbassadorAvatar = styled(Avatar)`
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  font-weight: 600;
  width: 40px;
  height: 40px;
  box-shadow: 0 2px 10px rgba(245, 158, 11, 0.2);
`;

const AmbassadorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AmbassadorName = styled(Typography)`
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
`;

const AmbassadorInstitute = styled(Typography)`
  color: #6b7280;
  font-size: 0.875rem;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 1.5rem;
  border-radius: 12px;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const StyledTableContainer = styled(TableContainer)`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const StyledTableCell = styled(TableCell)`
  white-space: nowrap;
  padding: 1rem;

  &.header {
    background: linear-gradient(90deg, #f59e0b, #d97706);
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const StyledTableRow = styled(TableRow)`
  transition: background-color 0.2s ease;

  &:nth-of-type(odd) {
    background-color: rgba(245, 158, 11, 0.05);
  }

  &:hover {
    background-color: rgba(245, 158, 11, 0.1);
  }

  &:last-child td,
  &:last-child th {
    border: 0;
  }
`;

const CategoryIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: #f59e0b;
  }
`;

const CountChip = styled(Chip)`
  font-weight: 600;
  padding: 0.5rem 0.25rem;
  height: auto;
  border-radius: 8px;

  &.registered {
    background-color: rgba(16, 185, 129, 0.1);
    color: #059669;
    border: 1px solid rgba(16, 185, 129, 0.2);
  }

  &.unregistered {
    background-color: rgba(239, 68, 68, 0.1);
    color: #dc2626;
    border: 1px solid rgba(239, 68, 68, 0.2);
  }
`;

const SummarySection = styled(Box)`
  background-color: #fffbeb;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: space-between;
`;

const SummaryItem = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 150px;
  flex: 1;
`;

const SummaryLabel = styled(Typography)`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const SummaryValue = styled(Typography)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
`;

const ProgressContainer = styled(Box)`
  margin-top: 0.5rem;
`;

const ProgressLabel = styled(Box)`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;

  span {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 500;
  }
`;

const StyledLinearProgress = styled(LinearProgress)`
  height: 8px;
  border-radius: 4px;
  background-color: rgba(245, 158, 11, 0.1);

  .MuiLinearProgress-bar {
    background-color: #f59e0b;
  }
`;

const EmptyState = styled(Box)`
  text-align: center;
  padding: 3rem 1rem;

  svg {
    font-size: 3rem;
    color: #e5e7eb;
    margin-bottom: 1rem;
  }
`;

const EmptyText = styled(Typography)`
  color: #9ca3af;
  font-size: 1.1rem;
  font-weight: 500;
`;

const getCategoryIcon = (category) => {
  switch (category.toLowerCase()) {
    case 'bussiness':
    case 'business':
      return <FiBriefcase size={18} />;
    case 'creative':
      return <FiPenTool size={18} />;
    case 'e-sports':
      return <FiMonitor size={18} />;
    case 'literature':
      return <FiBookOpen size={18} />;
    case 'sports':
      return <FiActivity size={18} />;
    case 'technical':
      return <FiCode size={18} />;
    default:
      return <FiAward size={18} />;
  }
};

const AmbassadorEventSpecific = () => {
  const [openAccordionId, setOpenAccordionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [ambassadors, setAmbassadors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState({});
  const [ambassadorsData, setAmbassadorsData] = useState([
    {
      category: 'Bussiness',
      registered: 0,
      unregistered: 0,
    },
    {
      category: 'Creative',
      registered: 0,
      unregistered: 0,
    },
    {
      category: 'E-sports',
      registered: 0,
      unregistered: 0,
    },
    {
      category: 'Literature',
      registered: 0,
      unregistered: 0,
    },
    {
      category: 'Sports',
      registered: 0,
      unregistered: 0,
    },
    {
      category: 'Technical',
      registered: 0,
      unregistered: 0,
    },
  ]);

  const { getAllAmbassadors, getAmbassadorData } = useAmbassador();
  const { show } = useSnackbar();

  const handleAccordionChange = (id) => {
    if (openAccordionId === id) {
      setOpenAccordionId(null);
    } else {
      setOpenAccordionId(id);
    }
  };

  const handleClick = async (id) => {
    try {
      if (!dataLoading[id]) {
        setDataLoading((prev) => ({ ...prev, [id]: true }));

        let tokenData = JSON.parse(localStorage.getItem('adminData'));
        if (!tokenData) {
          tokenData = JSON.parse(localStorage.getItem('iAdminData'));
        }
        const token = tokenData && tokenData.result;
        const response = await getAmbassadorData(token, id);

        if (response) {
          setAmbassadorsData(response);
        } else {
          show('Network Error', 'error');
        }

        setDataLoading((prev) => ({ ...prev, [id]: false }));
      }
    } catch (error) {
      console.error('Error fetching ambassador data:', error);
      show('Error fetching data', 'error');
      setDataLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getAllAmbassadors();
        setAmbassadors(response);
      } catch (error) {
        console.error('Error fetching ambassadors:', error);
        show('Error fetching ambassadors', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = ambassadors.filter((data) =>
    data.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRegistered = ambassadorsData.reduce(
    (accumulator, current) => accumulator + current.registered,
    0
  );

  const totalUnregistered = ambassadorsData.reduce(
    (accumulator, current) => accumulator + current.unregistered,
    0
  );

  const totalParticipants = totalRegistered + totalUnregistered;
  const registeredPercentage =
    totalParticipants > 0
      ? Math.round((totalRegistered / totalParticipants) * 100)
      : 0;

  return (
    <PageWrapper>
      <StyledContainer>
        <HeaderSection>
          <Title variant="h4">Ambassador Event Analytics</Title>
          <Subtitle variant="body1">
            Detailed breakdown of ambassador performance across different event
            categories
          </Subtitle>
        </HeaderSection>

        {loading ? (
          <>
            <Skeleton
              variant="rectangular"
              height={80}
              sx={{ borderRadius: '16px', mb: 3 }}
            />
            <Skeleton
              variant="rectangular"
              height={400}
              sx={{ borderRadius: '16px' }}
            />
          </>
        ) : (
          <>
            <SearchContainer elevation={0}>
              <SearchField
                label="Search Ambassador"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiSearch size={20} />
                    </InputAdornment>
                  ),
                }}
                placeholder="Type ambassador name to search..."
              />
            </SearchContainer>

            {filteredData.length > 0 ? (
              filteredData.map((data) => (
                <StyledAccordion
                  key={data._id}
                  expanded={openAccordionId === data._id}
                  onChange={() => handleAccordionChange(data._id)}
                  onClick={() => handleClick(data._id)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel-${data._id}-content`}
                    id={`panel-${data._id}-header`}
                  >
                    <AmbassadorAvatar>
                      {data.name ? data.name.charAt(0).toUpperCase() : 'A'}
                    </AmbassadorAvatar>
                    <AmbassadorInfo>
                      <AmbassadorName>{data.name}</AmbassadorName>
                      <AmbassadorInstitute>
                        {data.institute || 'No Institute'}
                      </AmbassadorInstitute>
                    </AmbassadorInfo>
                    {dataLoading[data._id] && (
                      <Badge
                        color="warning"
                        variant="dot"
                        sx={{ ml: 'auto', mr: 2 }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Loading...
                        </Typography>
                      </Badge>
                    )}
                  </AccordionSummary>
                  <AccordionDetails>
                    {dataLoading[data._id] ? (
                      <Box sx={{ width: '100%', py: 4 }}>
                        <LinearProgress color="warning" />
                      </Box>
                    ) : (
                      <>
                        <TableWrapper>
                          <StyledTableContainer component={Paper} elevation={0}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell className="header">
                                    Category
                                  </StyledTableCell>
                                  <StyledTableCell
                                    className="header"
                                    align="center"
                                  >
                                    Registered
                                  </StyledTableCell>
                                  <StyledTableCell
                                    className="header"
                                    align="center"
                                  >
                                    Unregistered
                                  </StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {ambassadorsData &&
                                  ambassadorsData.map((categoryData, index) => (
                                    <StyledTableRow key={index}>
                                      <StyledTableCell>
                                        <CategoryIcon>
                                          {getCategoryIcon(
                                            categoryData.category
                                          )}
                                          <Typography fontWeight={500}>
                                            {categoryData.category}
                                          </Typography>
                                        </CategoryIcon>
                                      </StyledTableCell>
                                      <StyledTableCell align="center">
                                        <CountChip
                                          label={categoryData.registered}
                                          className="registered"
                                        />
                                      </StyledTableCell>
                                      <StyledTableCell align="center">
                                        <CountChip
                                          label={categoryData.unregistered}
                                          className="unregistered"
                                        />
                                      </StyledTableCell>
                                    </StyledTableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </StyledTableContainer>
                        </TableWrapper>

                        <SummarySection>
                          <SummaryItem>
                            <SummaryLabel>Total Registrations</SummaryLabel>
                            <SummaryValue>{totalRegistered}</SummaryValue>
                          </SummaryItem>

                          <SummaryItem>
                            <SummaryLabel>Total Unregistered</SummaryLabel>
                            <SummaryValue>{totalUnregistered}</SummaryValue>
                          </SummaryItem>

                          <SummaryItem>
                            <SummaryLabel>Total Participants</SummaryLabel>
                            <SummaryValue>{totalParticipants}</SummaryValue>

                            <ProgressContainer>
                              <ProgressLabel>
                                <span>Registered</span>
                                <span>{registeredPercentage}%</span>
                              </ProgressLabel>
                              <StyledLinearProgress
                                variant="determinate"
                                value={registeredPercentage}
                              />
                            </ProgressContainer>
                          </SummaryItem>
                        </SummarySection>
                      </>
                    )}
                  </AccordionDetails>
                </StyledAccordion>
              ))
            ) : (
              <EmptyState>
                <FiUsers size={48} />
                <EmptyText>No ambassadors found matching your search</EmptyText>
              </EmptyState>
            )}
          </>
        )}
      </StyledContainer>
    </PageWrapper>
  );
};

export default AmbassadorEventSpecific;
