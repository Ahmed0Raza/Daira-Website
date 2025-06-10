import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  FiUsers,
  FiUserPlus,
  FiDollarSign,
  FiPieChart,
  FiSearch,
  FiFilter,
  FiTrash2,
  FiRefreshCw,
  FiBarChart2,
  FiActivity,
  FiAward,
  FiBookOpen,
  FiMonitor,
  FiCode,
  FiBriefcase,
} from 'react-icons/fi';
import { DataGrid } from '@mui/x-data-grid';
import Columns from './Dashboard/columns';
import column from './Dashboard/columns1';
import { useAdminAuth } from '../auth/adminAuth';
import Spinner from '../../../utils/spinner';
import { useRegistration } from '../../../service/registerationService';

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: #ffffff;
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  box-sizing: border-box;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const HeaderContainer = styled.div`
  margin-bottom: 2rem;
  width: 100%;
`;

const Title = styled.h3`
  color: #f59e0b;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 cards per row */
  gap: 1.5rem;
  margin-bottom: 2rem;
  width: 100%;
`;

const Card = styled.div`
  background: ${(props) =>
    props.gradient || 'linear-gradient(135deg, #f59e0b, #d97706)'};
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h4`
  color: white;
  font-size: 1.1rem;
  font-weight: 500;

  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

const IconContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const CardValue = styled.h2`
  color: white;
  font-size: 1.75rem;
  font-weight: 700;

  @media (min-width: 768px) {
    font-size: 2.25rem;
  }
`;

const CardFooter = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const Panel = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #eaeaea;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const PanelTitle = styled.h4`
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    width: auto;
  }
`;

const Select = styled.select`
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  width: 100%;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
  }

  @media (min-width: 768px) {
    width: auto;
    min-width: 200px;
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;

  @media (min-width: 768px) {
    width: auto;
  }
`;

const SelectIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
`;

const SearchInput = styled.div`
  position: relative;
  width: 100%;

  @media (min-width: 768px) {
    min-width: 300px;
    width: auto;
  }

  input {
    width: 100%;
    padding: 0.5rem 1rem 0.5rem 2.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 0.875rem;

    &:focus {
      outline: none;
      border-color: #f59e0b;
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
    }
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1.5rem 0;
  width: 100%;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background-color: ${(props) =>
    props.color ? `rgba(${props.color}, 0.1)` : 'rgba(0, 0, 0, 0.05)'};
  color: ${(props) => props.textColor || '#6b7280'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) =>
      props.color ? `rgba(${props.color}, 0.2)` : 'rgba(0, 0, 0, 0.1)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  &.spinning {
    svg {
      animation: spin 1s linear infinite;
    }
  }
`;

// Responsive wrapper for tables
const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 0;
  padding: 0;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  /* Ensure the table doesn't cause page overflow */
  & .MuiDataGrid-root {
    min-width: 100%;
    width: max-content;
  }
`;

// Custom styles for MUI DataGrid
const dataGridStyles = {
  border: 'none',
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    borderRadius: 1,
    fontWeight: 600,
  },
  '& .MuiDataGrid-cell': {
    fontSize: '0.95rem',
    whiteSpace: 'nowrap',
  },
  '& .MuiDataGrid-row': {
    '&:nth-of-type(odd)': {
      backgroundColor: 'rgba(0, 0, 0, 0.02)',
    },
    '&:hover': {
      backgroundColor: 'rgba(245, 158, 11, 0.05)',
    },
  },
};

const AdminHome = () => {
  const { getStatistics, loading, setLoading } = useAdminAuth();
  const [statistics, setStatistics] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropTerm, setDropTerm] = useState('');
  const [rows, setRows] = useState([]);
  const { deleteSpecificRegistrationAndTeam } = useRegistration();
  const [refreshing, setRefreshing] = useState(false);

  const [participantCount, setParticipantCount] = useState(0);
  const [business, setBusiness] = useState(0);
  const [creative, setCreative] = useState(0);
  const [eSports, setESports] = useState(0);
  const [literature, setLiterature] = useState(0);
  const [sports, setSports] = useState(0);
  const [technical, setTechnical] = useState(0);

  const onDelete = async (row) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('adminData'));
      const response = await deleteSpecificRegistrationAndTeam(
        row.registrationId,
        tokenData.result
      );

      if (response) {
        const newRows = rows.filter(
          (data) => data.registrationId !== row.registrationId
        );
        setRows(newRows);
      }
    } catch (error) {
      console.error('Error deleting registration:', error);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchStatistics();
    setRefreshing(false);
  };

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      let tokenData = JSON.parse(localStorage.getItem('adminData'));
      if (!tokenData) {
        tokenData = JSON.parse(localStorage.getItem('iAdminData'));
      }
      const token = tokenData && tokenData.result;
      const stats = await getStatistics(token);
      setStatistics(stats);

      // Reset counters
      setParticipantCount(0);
      setBusiness(0);
      setCreative(0);
      setESports(0);
      setLiterature(0);
      setSports(0);
      setTechnical(0);

      // Process data
      if (stats && stats.tableData) {
        processStatisticsData(stats.tableData);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processStatisticsData = (tableData) => {
    let participantTotal = 0;
    let businessCount = 0;
    let creativeCount = 0;
    let eSportsCount = 0;
    let literatureCount = 0;
    let sportsCount = 0;
    let technicalCount = 0;

    tableData.forEach((data) => {
      participantTotal += data.numOfParticipants;

      switch (data.categoryName) {
        case 'Business':
          businessCount++;
          break;
        case 'Creative':
          creativeCount++;
          break;
        case 'E-sports':
          eSportsCount++;
          break;
        case 'Literature':
          literatureCount++;
          break;
        case 'Sports':
          sportsCount++;
          break;
        case 'Technical':
          technicalCount++;
          break;
      }
    });

    setParticipantCount(participantTotal);
    setBusiness(businessCount);
    setCreative(creativeCount);
    setESports(eSportsCount);
    setLiterature(literatureCount);
    setSports(sportsCount);
    setTechnical(technicalCount);

    // Update rows with all data initially
    updateRows(tableData);
  };

  const updateRows = (data) => {
    const updatedRows = data.map((item, index) => ({
      sr: index + 1,
      registrationId: item.registrationId,
      ambassador: item.ambassadorName,
      teamName: item.teamName,
      category: item.categoryName,
      event: item.eventName,
      participants: item.numOfParticipants,
      amountPayable: `Rs ${item.payable}`,
    }));
    setRows(updatedRows);
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  useEffect(() => {
    if (statistics && statistics.tableData) {
      let filteredData = [...statistics.tableData];

      // Apply search filter
      if (searchTerm) {
        filteredData = filteredData.filter((item) =>
          item.ambassadorName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply category filter
      if (dropTerm && dropTerm !== 'All') {
        filteredData = filteredData.filter(
          (item) => item.categoryName.toLowerCase() === dropTerm.toLowerCase()
        );
      }

      updateRows(filteredData);
    }
  }, [searchTerm, dropTerm, statistics]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDropDown = (e) => {
    setDropTerm(e.target.value);
  };

  const getRowId = (row) => row.sr;

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'business':
        return <FiBriefcase size={16} />;
      case 'creative':
        return <FiAward size={16} />;
      case 'e-sports':
        return <FiMonitor size={16} />;
      case 'literature':
        return <FiBookOpen size={16} />;
      case 'sports':
        return <FiActivity size={16} />;
      case 'technical':
        return <FiCode size={16} />;
      default:
        return <FiPieChart size={16} />;
    }
  };

  const filterItems = [
    'All',
    'Business',
    'Creative',
    'E-sports',
    'Literature',
    'Sports',
    'Technical',
  ];

  // Enhanced columns with icons
  const enhancedColumns = column.map((col) => {
    if (col.field === 'business') {
      return {
        ...col,
        renderHeader: () => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiBriefcase size={16} /> {col.headerName}
          </div>
        ),
      };
    }
    if (col.field === 'creative') {
      return {
        ...col,
        renderHeader: () => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiAward size={16} /> {col.headerName}
          </div>
        ),
      };
    }
    if (col.field === 'eSports') {
      return {
        ...col,
        renderHeader: () => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiMonitor size={16} /> {col.headerName}
          </div>
        ),
      };
    }
    if (col.field === 'literature') {
      return {
        ...col,
        renderHeader: () => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiBookOpen size={16} /> {col.headerName}
          </div>
        ),
      };
    }
    if (col.field === 'sports') {
      return {
        ...col,
        renderHeader: () => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiActivity size={16} /> {col.headerName}
          </div>
        ),
      };
    }
    if (col.field === 'technical') {
      return {
        ...col,
        renderHeader: () => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiCode size={16} /> {col.headerName}
          </div>
        ),
      };
    }
    return col;
  });

  if (loading) {
    return <Spinner />;
  }

  return (
    <Container>
      <HeaderContainer>
        <Title>Dashboard Overview</Title>
        <Subtitle>
          Welcome to the admin dashboard. Here's an overview of all
          registrations and statistics.
        </Subtitle>
      </HeaderContainer>

      <CardGrid>
        {/* Row 1: OC Team Participants */}
        <Card gradient="linear-gradient(135deg, #34d399, #10b981)">
          <CardHeader>
            <CardTitle>OC Team Participants</CardTitle>
            <IconContainer>
              <FiUsers size={20} color="white" />
            </IconContainer>
          </CardHeader>
          <CardValue>
            {statistics?.segregatedStats?.ocTeam?.totalParticipants || 0}
          </CardValue>
          <CardFooter>Total participants from the OC team</CardFooter>
        </Card>

        <Card gradient="linear-gradient(135deg, #34d399, #10b981)">
          <CardHeader>
            <CardTitle>OC Team Registrations</CardTitle>
            <IconContainer>
              <FiUsers size={20} color="white" />
            </IconContainer>
          </CardHeader>
          <CardValue>
            {statistics?.segregatedStats?.ocTeam?.totalRegistrations || 0}
          </CardValue>
          <CardFooter>Total registrations from the OC team</CardFooter>
        </Card>

        <Card gradient="linear-gradient(135deg, #34d399, #10b981)">
          <CardHeader>
            <CardTitle>OC Team Payable Amount</CardTitle>
            <IconContainer>
              <FiDollarSign size={20} color="white" />
            </IconContainer>
          </CardHeader>
          <CardValue>
            Rs. {statistics?.segregatedStats?.ocTeam?.totalPayableAmount || 0}
          </CardValue>
          <CardFooter>Total payable amount from the OC team</CardFooter>
        </Card>

        {/* Row 2: University Participants (Non-OC) */}
        <Card gradient="linear-gradient(135deg, #60a5fa, #3b82f6)">
          <CardHeader>
            <CardTitle>University Participants (Non-OC)</CardTitle>
            <IconContainer>
              <FiUsers size={20} color="white" />
            </IconContainer>
          </CardHeader>
          <CardValue>
            {statistics?.segregatedStats?.universityNonOC?.totalParticipants ||
              0}
          </CardValue>
          <CardFooter>
            Total participants from the university (Non-OC)
          </CardFooter>
        </Card>

        <Card gradient="linear-gradient(135deg, #60a5fa, #3b82f6)">
          <CardHeader>
            <CardTitle>University Registrations (Non-OC)</CardTitle>
            <IconContainer>
              <FiUsers size={20} color="white" />
            </IconContainer>
          </CardHeader>
          <CardValue>
            {statistics?.segregatedStats?.universityNonOC?.totalRegistrations ||
              0}
          </CardValue>
          <CardFooter>
            Total registrations from the university (Non-OC)
          </CardFooter>
        </Card>

        <Card gradient="linear-gradient(135deg, #60a5fa, #3b82f6)">
          <CardHeader>
            <CardTitle>University Payable Amount (Non-OC)</CardTitle>
            <IconContainer>
              <FiDollarSign size={20} color="white" />
            </IconContainer>
          </CardHeader>
          <CardValue>
            Rs.{' '}
            {statistics?.segregatedStats?.universityNonOC?.totalPayableAmount ||
              0}
          </CardValue>
          <CardFooter>
            Total payable amount from the university (Non-OC)
          </CardFooter>
        </Card>

        {/* Row 3: Outsiders */}
        <Card gradient="linear-gradient(135deg, #f87171, #ef4444)">
          <CardHeader>
            <CardTitle>Outsider Participants</CardTitle>
            <IconContainer>
              <FiUsers size={20} color="white" />
            </IconContainer>
          </CardHeader>
          <CardValue>
            {statistics?.segregatedStats?.outsiders?.totalParticipants || 0}
          </CardValue>
          <CardFooter>Total participants from outsiders</CardFooter>
        </Card>

        <Card gradient="linear-gradient(135deg, #f87171, #ef4444)">
          <CardHeader>
            <CardTitle>Outsider Registrations</CardTitle>
            <IconContainer>
              <FiUsers size={20} color="white" />
            </IconContainer>
          </CardHeader>
          <CardValue>
            {statistics?.segregatedStats?.outsiders?.totalRegistrations || 0}
          </CardValue>
          <CardFooter>Total registrations from outsiders</CardFooter>
        </Card>

        <Card gradient="linear-gradient(135deg, #f87171, #ef4444)">
          <CardHeader>
            <CardTitle>Outsider Payable Amount</CardTitle>
            <IconContainer>
              <FiDollarSign size={20} color="white" />
            </IconContainer>
          </CardHeader>
          <CardValue>
            Rs.{' '}
            {statistics?.segregatedStats?.outsiders?.totalPayableAmount || 0}
          </CardValue>
          <CardFooter>Total payable amount from outsiders</CardFooter>
        </Card>
      </CardGrid>

      <Panel>
        <PanelHeader>
          <PanelTitle>
            <FiBarChart2 size={20} /> Category Wise Count
          </PanelTitle>
          <IconButton
            onClick={refreshData}
            disabled={refreshing}
            className={refreshing ? 'spinning' : ''}
          >
            <FiRefreshCw size={18} />
          </IconButton>
        </PanelHeader>

        <TableWrapper>
          <DataGrid
            sx={dataGridStyles}
            columns={enhancedColumns}
            autoHeight
            rows={[
              {
                id: 1,
                business: business,
                creative: creative,
                eSports: eSports,
                literature: literature,
                sports: sports,
                technical: technical,
              },
            ]}
            disableRowSelectionOnClick
            disableColumnMenu
          />
        </TableWrapper>
      </Panel>

      <Panel>
        <PanelHeader>
          <PanelTitle>
            <FiUsers size={20} /> Registrations
          </PanelTitle>

          <FilterContainer>
            <SelectWrapper>
              <SelectIcon>
                <FiFilter size={16} />
              </SelectIcon>
              <Select value={dropTerm} onChange={handleDropDown}>
                {filterItems.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </SelectWrapper>

            <SearchInput>
              <SearchIcon>
                <FiSearch size={16} />
              </SearchIcon>
              <input
                type="text"
                placeholder="Search by Ambassador"
                value={searchTerm}
                onChange={handleSearch}
              />
            </SearchInput>
          </FilterContainer>
        </PanelHeader>

        <Divider />

        <TableWrapper>
          <DataGrid
            sx={dataGridStyles}
            columns={Columns((row) => (
              <IconButton
                onClick={() => onDelete(row)}
                color="239, 68, 68"
                textColor="#ef4444"
              >
                <FiTrash2 size={16} />
              </IconButton>
            ))}
            rows={rows}
            getRowId={getRowId}
            autoHeight
            disableRowSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            loading={loading}
          />
        </TableWrapper>
      </Panel>
    </Container>
  );
};

export default AdminHome;
