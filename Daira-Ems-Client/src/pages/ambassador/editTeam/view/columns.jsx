import React from 'react';
import { IconButton, Box } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';

const Columns = (onDelete) => [
  {
    field: 'sr',
    headerName: 'SR',
    width: 70,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) => (
      <Box
        sx={{
          color: 'gray',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'medium',
        }}
      >
        {params.value}
      </Box>
    ),
  },
  {
    field: 'event',
    headerName: 'Event Name',
    minWidth: 350,
    flex: 2,
    editable: true,
    renderCell: (params) => (
      <Box
        sx={{
          width: '100%',
          py: 1,
          whiteSpace: 'normal',
          lineHeight: '1.4em',
          fontWeight: 'medium',
        }}
      >
        {params.value}
      </Box>
    ),
  },
  {
    field: 'team',
    headerName: 'Team Name',
    minWidth: 200,
    flex: 1,
    editable: true,
    renderCell: (params) => (
      <Box
        sx={{
          width: '100%',
          py: 1,
          whiteSpace: 'normal',
          lineHeight: '1.4em',
        }}
      >
        {params.value}
      </Box>
    ),
  },
  {
    field: 'participants',
    headerName: 'Participants',
    width: 130,
    align: 'center',
    headerAlign: 'center',
    editable: true,
  },
  {
    field: 'participantsName',
    headerName: 'Participant Names',
    minWidth: 300,
    flex: 2,
    renderCell: (params) => {
      const names = params.row.participantsName;
      if (!names || !Array.isArray(names)) {
        return '-';
      }
      
      const nameString = names.join(', ');
      return (
        <Box
          sx={{
            width: '100%',
            py: 1,
            px: 1,
            whiteSpace: 'normal',
            lineHeight: '1.4em',
          }}
        >
          {nameString}
        </Box>
      );
    },
  },
  {
    field: 'registrations',
    headerName: 'Registration Fee',
    width: 180,
    align: 'right',
    headerAlign: 'right',
    editable: true,
    renderCell: (params) => (
      <Box
        sx={{
          fontSize: '15px',
          fontWeight: 'medium',
          pr: 2,
        }}
      >
        {Number(params.value).toLocaleString()}
      </Box>
    ),
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 100,
    align: 'center',
    headerAlign: 'center',
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <IconButton
          onClick={() => onDelete(params.row)}
          sx={{ 
            color: 'red',
            '&:hover': {
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
            }
          }}
        >
          <DeleteForeverIcon />
        </IconButton>
      </Box>
    ),
  },
];

export default Columns;