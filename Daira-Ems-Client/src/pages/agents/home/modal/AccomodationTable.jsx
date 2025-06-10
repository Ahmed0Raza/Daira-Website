import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const AccommodationTable = ({ data, colorScheme }) => {
  const headers = ['Participant Name', 'CNIC', 'Contact Number', 'Team Names'];

  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: 'none',
        border: 'none',
        backgroundColor: colorScheme.bodyBg,
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((heading, idx) => (
              <TableCell
                key={idx}
                sx={{
                  fontWeight: 'bold',
                  backgroundColor: colorScheme.headerBg,
                  color: colorScheme.headerText || '#000',
                  border: 'none',
                  fontSize: '15px',
                }}
              >
                {heading}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(({ participantName, cnic, contactNumber, teamNames }, index) => (
            <TableRow key={index}>
              <TableCell sx={{ border: 'none', fontSize: '15px' }}>{participantName}</TableCell>
              <TableCell sx={{ border: 'none', fontSize: '15px' }}>{cnic}</TableCell>
              <TableCell sx={{ border: 'none', fontSize: '15px' }}>{contactNumber}</TableCell>
              <TableCell sx={{ border: 'none', fontSize: '15px' }}>
                {teamNames.length > 0 ? teamNames.join(', ') : 'Unknown'}
              </TableCell> 
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AccommodationTable;
