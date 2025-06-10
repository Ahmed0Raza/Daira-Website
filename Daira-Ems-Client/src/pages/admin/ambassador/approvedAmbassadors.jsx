'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiDownload, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { DataGrid } from '@mui/x-data-grid';
import Columns from './header/columns';
import AmbassadorDetailsModal from './modal/ambassadorDetails';
import { useAppAmbassador } from '../../../service/approvedAmbassador';

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  box-sizing: border-box;
  margin: 0 auto;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const Title = styled.h3`
  color: #f59e0b;
  font-size: 1.25rem;
  font-weight: 700;
  position: relative;
  margin: 0;

  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #f59e0b, #d97706);
    border-radius: 2px;
  }

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const DataGridWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: relative;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none;

  /* Ensure the table doesn't cause page overflow */
  & .MuiDataGrid-root {
    min-width: 100%;
    width: max-content;
  }

  @media (max-width: 600px) {
    & .MuiDataGrid-cell {
      padding: 8px 4px;
      font-size: 0.8rem;
    }

    & .MuiDataGrid-columnHeader {
      padding: 8px 4px;
      font-size: 0.8rem;
    }
  }
`;

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
  width: 100%;
  font-size: 0.9rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(245, 158, 11, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (min-width: 768px) {
    width: auto;
    font-size: 1rem;
  }
`;

// Custom styles for MUI DataGrid
const dataGridStyles = {
  width: '100%',
  margin: 'auto',
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: '#ffffff',
    color: '#92400e',
    fontWeight: '600',
    fontSize: '0.9rem',
    padding: '16px 8px',
    whiteSpace: 'nowrap',
  },
  '& .MuiDataGrid-columnHeaders': {
    width: '100%',
    borderBottom: '2px solid #fde68a',
  },
  '& .MuiDataGrid-row': {
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: '#fffbeb',
    },
  },
  '& .MuiDataGrid-cell': {
    padding: '16px 8px',
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
  },
  '& .approved-ambassador': {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    '&:hover': {
      backgroundColor: 'rgba(245, 158, 11, 0.15)',
    },
  },
  '& .status-true-approved-true': {
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
    '&:hover': {
      backgroundColor: 'rgba(217, 119, 6, 0.15)',
    },
  },
  '& .MuiDataGrid-columnSeparator': {
    display: 'none',
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: 'none',
    backgroundColor: '#f8f9fa',
  },
  '& .MuiTablePagination-root': {
    color: '#92400e',
  },
  '@media (max-width: 600px)': {
    '& .MuiDataGrid-cell': {
      padding: '8px 4px',
      fontSize: '0.8rem',
    },
    '& .MuiDataGrid-columnHeader': {
      padding: '8px 4px',
      fontSize: '0.8rem',
    },
  },
};

function ExportButton({ rows }) {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const exportToCSV = (csvRows, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvRows);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <StyledButton onClick={() => exportToCSV(rows, 'ambassador_nominations')}>
      <FiDownload size={18} />
      Export to CSV
    </StyledButton>
  );
}

export default function ApprovedAmbassadorView() {
  const { getAmbassadors } = useAppAmbassador();
  const [ambassadors, setAmbassadors] = useState([]);
  const getRowId = (row) => row._id;
  const [open, setOpen] = useState(false);
  const [ambassadorID, setAmbassadorID] = useState('');

  const setModalOpen = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    getAmbassadors().then((res) => {
      setAmbassadors(res);
    });
  }, []);

  const getRowClassName = (params) => {
    if (params.row.status && params.row.approved) {
      return 'status-true-approved-true';
    } else if (!params.row.status && params.row.approved) {
      return 'approved-ambassador';
    }
    return '';
  };

  // Enhanced columns with icons
  const enhancedColumns = Columns.map((column) => {
    if (column.field === 'status' || column.field === 'approved') {
      return {
        ...column,
        renderCell: (params) => {
          const value = params.value;
          return (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '12px',
                backgroundColor: value
                  ? 'rgba(217, 119, 6, 0.1)'
                  : 'rgba(239, 68, 68, 0.1)',
                color: value ? '#b45309' : '#ef4444',
                fontWeight: '500',
                fontSize: '0.8rem',
              }}
            >
              {value ? (
                <FiCheckCircle size={16} color="#b45309" />
              ) : (
                <FiAlertTriangle size={16} color="#ef4444" />
              )}
              {value ? 'Active' : 'Inactive'}
            </div>
          );
        },
      };
    }
    return column;
  });

  return (
    <Container>
      <AmbassadorDetailsModal
        open={open}
        handleClose={closeModal}
        ambassadorID={ambassadorID}
      />

      <HeaderContainer>
        <Title>Ambassador View</Title>
        <ExportButton rows={ambassadors} />
      </HeaderContainer>

      <DataGridWrapper>
        <DataGrid
          sx={dataGridStyles}
          rows={ambassadors}
          columns={enhancedColumns}
          getRowId={getRowId}
          autoHeight={true}
          getRowClassName={getRowClassName}
          onRowClick={(params) => {
            setAmbassadorID(params.row._id);
            setModalOpen();
          }}
          disableColumnMenu
          disableSelectionOnClick
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
        />
      </DataGridWrapper>
    </Container>
  );
}
