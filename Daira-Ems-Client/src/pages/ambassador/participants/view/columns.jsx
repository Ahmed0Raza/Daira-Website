import React from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { IconButton } from '@mui/material';

const Columns = (onDelete) => [
  { field: 'id', headerName: 'Sr.', width: 20 },
  { field: 'name', headerName: 'Name', width: 100 },
  {
    field: 'contactNumber',
    headerName: 'Phone',
    width: 110,
  },
  {
    field: 'accomodation',
    headerName: 'Accommodation',
    width: 120,
    renderCell: (params) => (
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        {params.value}
      </div>
    ),
  },
  {
    field: 'gender',
    headerName: 'Gender',
    width: 90,
  },
  {
    field: 'actions',
    headerName: '',
    width: 100,
    renderCell: (params) => (
      <IconButton aria-label="delete" onClick={() => onDelete(params.row)}>
        <DeleteForeverIcon sx={{ color: 'red' }} />
      </IconButton>
    ),
  },
];

export default Columns;
