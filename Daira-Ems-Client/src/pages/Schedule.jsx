// import { Box, Typography } from '@mui/material';
// import ComingSoon from '../components/ComingSoon';

// const Schedule = () => {
//   return (
//     <>
//       {/* <Box
//         sx={{
//           width: '100%',
//           height: '100vh',
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'center',
//           alignItems: 'center',
//           paddingTop: '200px',
//         }}
//       >
//         <Typography
//           variant="h4"
//           sx={{
//             color: '#fc8b00',
//             WebkitBackgroundClip: 'text',
//             backgroundClip: 'text',
//             fontWeight: 'bold',
//             marginBottom: '20px',
//             padding: { xs: '20px', sm: 'unset' },
//           }}
//         >
//           Schedule
//         </Typography>
//         <Box
//           sx={{
//             width: '90%',
//             height: '100%',
//           }}
//         >
//           <iframe
//             src="https://docs.google.com/spreadsheets/d/1KJxaSW3JPDKSBGF0TX1udwBynBItvglURPg2ob8WxzY/edit?usp=sharing&rm=minimal"
//             style={{
//               width: '100%',
//               height: '100%',
//             }}
//             frameborder="0"
//             allowFullScreen
//           ></iframe>
//         </Box>
//       </Box> */}
//       <ComingSoon />
//     </>
//   );
// };

// export default Schedule;

import React from 'react';

const Schedual = () => {
  const sheetSrc =
    'https://docs.google.com/spreadsheets/d/16HOSVv2djRo8m4H6Gw9rNEAOAt7qpZNqbUK32gpMQqE/edit?usp=sharing';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-6xl h-[80vh] border shadow-xl rounded-xl overflow-hidden">
        <iframe
          title="Schedule"
          src={sheetSrc}
          width="100%"
          height="100%"
          className="border-none"
        ></iframe>
      </div>
    </div>
  );
};

export default Schedual;
