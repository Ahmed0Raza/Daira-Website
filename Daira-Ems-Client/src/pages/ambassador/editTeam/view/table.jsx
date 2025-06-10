import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Columns from './columns';
import { Box } from '@mui/material';
import { useRegistration } from '../../../../service/registerationService';
import EditRegisteration from '../EditRegisteration';

const EventTable = ({ rows, setUpdate, update }) => {
  const { deleteRegisterations } = useRegistration();
  const userData = JSON.parse(localStorage.getItem('userData'));
  const tokenData = userData.data;
  const token = tokenData.token;
  
  // setData(rows.event);
  // setIsEdit(true);
  const [isEdit, setIsEdit] = useState(false);
  const [data, setData] = useState('');

  const onEdit = (row) => {
    setData(row.event);
    setIsEdit(true);
  };

  const onDelete = async (row) => {
    await deleteRegisterations(row.id, token);
    setUpdate(!update);
  };

  return (
    <Box>
      {isEdit ? (
        <></>
      ) : (
        <DataGrid
          rows={rows}
          columns={Columns(onDelete)}
          pageSize={5}
          disableColumnSelector
          disableColumnMenu
          disableMultipleRowSelection
          disableRowSelectionOnClick
          autoHeight
          sx={{
            '& .MuiDataGrid-columnHeaderTitle': {
              color: 'white',
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#FFC107',
            },
          }}
        />
      )}
    </Box>
  );
};

export default EventTable;
