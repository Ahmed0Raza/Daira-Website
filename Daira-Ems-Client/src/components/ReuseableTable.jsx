/* eslint-disable react/prop-types */
import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  styled,
  Typography,
} from '@mui/material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  overflow: 'hidden',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(252,139,0,0.15)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(252,139,0,0.2)',
  background: 'rgba(255, 255, 255, 0.95)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(252,139,0,0.2)',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-head': {
    background: 'linear-gradient(45deg, #fc8b00 30%, #ff9f40 90%)',
    color: 'white',
    fontWeight: '800',
    fontSize: '1rem',
    padding: '16px',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
  },
  '&.MuiTableCell-body': {
    fontSize: '0.9rem',
    padding: '16px',
    borderBottom: '1px solid rgba(252,139,0,0.15)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(252,139,0,0.05)',
    },
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'rgba(252,139,0,0.03)',
  },
  '&:hover': {
    backgroundColor: 'rgba(252,139,0,0.08)',
    transform: 'scale(1.01)',
    transition: 'all 0.3s ease',
  },
}));

const ValueCell = styled(Typography)(({ theme }) => ({
  fontWeight: '600',
  color: '#333',
  '&.highlight': {
    color: '#fc8b00',
    fontWeight: '700',
  },
}));

const ReuseableTable = ({ columns, rows }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const renderCellValue = (value) => {
    if (value === '✓') {
      return (
        <ValueCell className="highlight" sx={{ fontSize: '1.2rem' }}>
          {value}
        </ValueCell>
      );
    }
    if (value === '‐') {
      return (
        <ValueCell sx={{ color: '#999', fontSize: '1rem' }}>{value}</ValueCell>
      );
    }
    return <ValueCell>{value}</ValueCell>;
  };

  return (
    <StyledPaper>
      <TableContainer>
        <Table aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align="center"
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <StyledTableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.name}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <StyledTableCell key={column.id} align="center">
                          {renderCellValue(value)}
                        </StyledTableCell>
                      );
                    })}
                  </StyledTableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          '.MuiTablePagination-select': {
            color: '#fc8b00',
            fontWeight: '600',
          },
          '.MuiTablePagination-selectIcon': {
            color: '#fc8b00',
          },
          '.MuiTablePagination-displayedRows': {
            color: '#666',
            fontWeight: '500',
          },
        }}
      />
    </StyledPaper>
  );
};

export default ReuseableTable;
