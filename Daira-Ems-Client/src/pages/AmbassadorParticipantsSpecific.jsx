import { useEffect, useState } from 'react';
import styled from 'styled-components';
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
} from '@mui/material';
import { useAmbassador } from '../service/ambassadorService';
import { useSnackbar } from '../utils/snackbarContextProvider';
import {
  FiSearch,
  FiUser,
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiAward,
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

const StatsContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(Paper)`
  padding: 1.25rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background: white;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }
`;

const StatValue = styled(Typography)`
  font-size: 2rem;
  font-weight: 700;
  color: #f59e0b;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled(Typography)`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;

  svg {
    color: #f59e0b;
    font-size: 1.75rem;
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  background: white;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const StyledTableContainer = styled(TableContainer)`
  border-radius: 16px;
  overflow: hidden;
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

  &.bold {
    font-weight: 600;
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

const CountChip = styled(Chip)`
  font-weight: 600;
  padding: 0.5rem 0.25rem;
  height: auto;
  border-radius: 8px;

  &.in-team {
    background-color: rgba(16, 185, 129, 0.1);
    color: #059669;
    border: 1px solid rgba(16, 185, 129, 0.2);
  }

  &.not-in-team {
    background-color: rgba(239, 68, 68, 0.1);
    color: #dc2626;
    border: 1px solid rgba(239, 68, 68, 0.2);
  }

  &.total {
    background-color: rgba(245, 158, 11, 0.1);
    color: #d97706;
    border: 1px solid rgba(245, 158, 11, 0.2);
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

const AmbassadorParticipantsSpecific = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [ambassadors, setAmbassadors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAllAmbassadorsParticitants } = useAmbassador();
  const { show } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getAllAmbassadorsParticitants();
        setAmbassadors(response);
      } catch (error) {
        console.error('Error fetching ambassadors:', error);
        show('Error fetching data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = ambassadors.filter((data) =>
    data.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate totals for stats
  const totalAmbassadors = ambassadors.length;
  const totalRegistered = ambassadors.reduce(
    (acc, curr) => acc + (curr.registeredCount || 0),
    0
  );
  const totalUnregistered = ambassadors.reduce(
    (acc, curr) => acc + (curr.unregisteredCount || 0),
    0
  );
  const totalParticipants = totalRegistered + totalUnregistered;

  return (
    <PageWrapper>
      <StyledContainer>
        <HeaderSection>
          <Title variant="h4">Ambassador Participants</Title>
          <Subtitle variant="body1">
            Track and manage all ambassador participants across different
            institutes
          </Subtitle>
        </HeaderSection>

        {loading ? (
          <>
            <Skeleton
              variant="rectangular"
              height={80}
              sx={{ borderRadius: '16px', mb: 3 }}
            />
            <StatsContainer>
              <Skeleton
                variant="rectangular"
                height={120}
                sx={{ borderRadius: '16px' }}
              />
              <Skeleton
                variant="rectangular"
                height={120}
                sx={{ borderRadius: '16px' }}
              />
              <Skeleton
                variant="rectangular"
                height={120}
                sx={{ borderRadius: '16px' }}
              />
              <Skeleton
                variant="rectangular"
                height={120}
                sx={{ borderRadius: '16px' }}
              />
            </StatsContainer>
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

            <StatsContainer>
              <StatCard elevation={0}>
                <IconWrapper>
                  <FiUsers />
                </IconWrapper>
                <StatValue>{totalAmbassadors}</StatValue>
                <StatLabel>Ambassadors</StatLabel>
              </StatCard>

              <StatCard elevation={0}>
                <IconWrapper>
                  <FiUserCheck />
                </IconWrapper>
                <StatValue>{totalRegistered}</StatValue>
                <StatLabel>In Teams</StatLabel>
              </StatCard>

              <StatCard elevation={0}>
                <IconWrapper>
                  <FiUserX />
                </IconWrapper>
                <StatValue>{totalUnregistered}</StatValue>
                <StatLabel>Not In Teams</StatLabel>
              </StatCard>

              <StatCard elevation={0}>
                <IconWrapper>
                  <FiAward />
                </IconWrapper>
                <StatValue>{totalParticipants}</StatValue>
                <StatLabel>Total Participants</StatLabel>
              </StatCard>
            </StatsContainer>

            {filteredData.length > 0 ? (
              <TableWrapper>
                <StyledTableContainer component={Paper} elevation={0}>
                  <Table aria-label="ambassador participants table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell className="header">
                          Ambassador
                        </StyledTableCell>
                        <StyledTableCell className="header">
                          Institute
                        </StyledTableCell>
                        <StyledTableCell className="header" align="center">
                          In Team
                        </StyledTableCell>
                        <StyledTableCell className="header" align="center">
                          Not In Team
                        </StyledTableCell>
                        <StyledTableCell className="header" align="center">
                          Total
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredData.map((data, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell component="th" scope="row">
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <FiUser size={16} />
                              <Typography fontWeight={500}>
                                {data.name}
                              </Typography>
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell>
                            {data.institute ? data.institute : 'Not specified'}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <CountChip
                              label={data.registeredCount || '0'}
                              className="in-team"
                            />
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <CountChip
                              label={data.unregisteredCount || '0'}
                              className="not-in-team"
                            />
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <CountChip
                              label={
                                (data.registeredCount || 0) +
                                (data.unregisteredCount || 0)
                              }
                              className="total"
                            />
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </StyledTableContainer>
              </TableWrapper>
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

export default AmbassadorParticipantsSpecific;
