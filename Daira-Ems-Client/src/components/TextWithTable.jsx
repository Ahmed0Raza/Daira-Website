/* eslint-disable react/prop-types */
import { Typography, Divider, styled, Box } from '@mui/material';
import ReuseableTable from './ReuseableTable';

const CenteredHeading = styled('div')({
  textAlign: 'center',
});

const ThickerDivider = styled(Divider)({
  '&::before': {
    borderBottomWidth: '3px',
  },
  '&::after': {
    borderBottomWidth: '1px',
  },
});

const TextWithTable = ({ text, rows, columns }) => {
  return (
    <Box
      sx={{
        padding: { xs: '20px', sm: '50px', md: '100px', lg: '150px' },
        background:
          'linear-gradient(180deg, rgba(252,139,0,0.05) 0%, rgba(252,139,0,0) 100%)',
        borderRadius: '16px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(5px)',
        border: '1px solid rgba(252,139,0,0.1)',
      }}
    >
      <CenteredHeading>
        <Typography
          variant="h4"
          sx={{
            background: 'linear-gradient(45deg, #fc8b00 30%, #ff9f40 90%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            fontWeight: '800',
            marginBottom: '20px',
            padding: { xs: '20px', sm: 'unset' },
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {text}
        </Typography>
        <ThickerDivider
          sx={{
            background:
              'linear-gradient(90deg, transparent, #fc8b00, transparent)',
            width: { xs: '150px', sm: '200px' },
            margin: 'auto',
            height: '3px',
            borderRadius: '2px',
            '&::before, &::after': {
              display: 'none',
            },
          }}
        />
        <Box
          sx={{
            paddingTop: { xs: '3rem', sm: '4rem', md: '5rem' },
            '& .MuiTableCell-root': {
              borderColor: 'rgba(252,139,0,0.2)',
            },
            '& .MuiTableHead-root': {
              background:
                'linear-gradient(45deg, rgba(252,139,0,0.1), rgba(252,139,0,0.05))',
            },
          }}
        >
          <ReuseableTable columns={columns} rows={rows} />
        </Box>
      </CenteredHeading>
    </Box>
  );
};

export default TextWithTable;
