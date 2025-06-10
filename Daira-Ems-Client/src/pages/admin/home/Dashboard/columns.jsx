import React from 'react';
import { IconButton, Box } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const Columns = (onDelete) => [
  {
    field: 'sr',
    headerName: 'Sr',
    width: 80,
  },
  {
    field: 'ambassador',
    headerName: 'Amabassador',
    width: 250,
  },
  {
    field: 'teamName',
    headerName: 'Team Name',
    width: 250,
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 200,
  },
  {
    field: 'event',
    headerName: 'Event',
    width: 350,
  },
  {
    field: 'participants',
    headerName: 'No of Participants',
    width: 250,
  },
  {
    field: 'amountPayable',
    headerName: 'Amount Payable',
    width: 205,
  },
  // {
  //   field: 'action',
  //   headerName: 'Action',
  //   width: 150,
  //   renderCell: (params) => (
  //     <Box
  //       sx={{
  //         display: 'flex',
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //       }}
  //     >
  //       <IconButton onClick={() => onDelete(params.row)} sx={{ color: 'red' }}>
  //         <DeleteForeverIcon />
  //       </IconButton>
  //     </Box>
  //   ),
  // },
];

export default Columns;
