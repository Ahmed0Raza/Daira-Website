import React, { useEffect, useState } from 'react';
import { useAmbassador } from '../service/ambassadorService';
import Registered_Columns from '../components/registered_ambassadors_columns';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  Box,
} from '@mui/material';
import { styled } from '@mui/system';

const PageContainer = styled(Box)({
  padding: '2rem 1rem',
  minHeight: '100vh',
  marginTop: '100px',
  background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)',
});

const Heading = styled(Typography)({
  color: '#fc8b00',
  fontSize: '2.5rem',
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: '1rem',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
});

const Underline = styled('div')({
  height: '4px',
  width: '150px',
  background: 'linear-gradient(90deg, #fc8b00, #ffa726)',
  margin: '0 auto 2rem',
  borderRadius: '2px',
  boxShadow: '0 2px 4px rgba(252,139,0,0.2)',
});

const StyledHeaderCell = styled(TableCell)({
  background: 'linear-gradient(45deg, #fc8b00, #ffa726)',
  color: 'white',
  fontSize: '1rem',
  fontWeight: 'bold',
  textAlign: 'center',
  padding: '1rem',
  '&:hover': {
    background: 'linear-gradient(45deg, #e67e00, #f57c00)',
  },
});

const StyledBodyCell = styled(TableCell)({
  backgroundColor: '#fff',
  color: '#333',
  fontSize: '0.875rem',
  textAlign: 'center',
  padding: '1rem',
  borderBottom: '1px solid #eee',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#fff3e0',
    transform: 'scale(1.02)',
  },
});

const StyledTableContainer = styled(TableContainer)({
  width: '95%',
  margin: '2rem auto',
  borderRadius: '12px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  '& .MuiTable-root': {
    borderCollapse: 'separate',
    borderSpacing: 0,
  },
  '& .MuiTableRow-root': {
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
  },
});

const StyledTablePagination = styled(TablePagination)({
  borderTop: '1px solid #eee',
  '.MuiTablePagination-select': {
    color: '#fc8b00',
  },
  '.MuiTablePagination-selectIcon': {
    color: '#fc8b00',
  },
});

const Ambassador = () => {
  const { getActiveAmbassadors } = useAmbassador();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activeAmbassadors = await getActiveAmbassadors();
        const formattedRows = activeAmbassadors.map((ambassador) => ({
          name: ambassador.name,
          email: ambassador.email,
          contact: ambassador.contact,
          institute: ambassador.institute,
          campusName: ambassador.campusName,
        }));
        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching ambassadors:', error);
      }
    };
    fetchData();
  }, [getActiveAmbassadors]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <PageContainer>
      <Heading variant="h2">Our Ambassadors</Heading>
      <Underline />
      <StyledTableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {Registered_Columns.map((column) => (
                <StyledHeaderCell
                  key={column.field}
                  sx={{
                    minWidth: 120,
                    '@media (max-width: 600px)': {
                      fontSize: '0.875rem',
                      padding: '8px',
                    },
                  }}
                >
                  {column.headerName}
                </StyledHeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#fff3e0',
                    },
                  }}
                >
                  {Registered_Columns.map((column) => (
                    <StyledBodyCell
                      key={column.field}
                      sx={{
                        '@media (max-width: 600px)': {
                          fontSize: '0.75rem',
                          padding: '8px',
                        },
                      }}
                    >
                      {row[column.field]}
                    </StyledBodyCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <StyledTablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </StyledTableContainer>
    </PageContainer>
  );
};

export default Ambassador;
