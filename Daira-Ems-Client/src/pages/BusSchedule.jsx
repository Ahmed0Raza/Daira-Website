import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Container, Button } from '@mui/material';
import ReactImageMagnify from 'react-image-magnify';
import ComingSoon from '../components/ComingSoon';

const images = [
  'https://daira-media.s3.ap-south-1.amazonaws.com/schedule/1.png',
  'https://daira-media.s3.ap-south-1.amazonaws.com/schedule/2.png',
  'https://daira-media.s3.ap-south-1.amazonaws.com/schedule/3.png',
];

function CustomTabPanel(props) {
  const { children, value, index, images, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <ReactImageMagnify
            {...{
              smallImage: {
                alt: 'Wristwatch by Ted Baker London',
                isFluidWidth: true,
                src: images[index],
                sizes:
                  '(min-width: 800px) 33.5vw, (min-width: 415px) 50vw, 100vw',
              },
              largeImage: {
                alt: '',
                src: images[index],
                width: 1500,
                height: 1800,
              },
              enlargedImagePosition: 'over',
              isHintEnabled: true,
            }}
          />
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BusSchedule() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDownloadClick = () => {
    window.open(
      'https://daira-media.s3.ap-south-1.amazonaws.com/Bus+Routes+Spring-24.pdf'
    );
  };

  return (
    <>
      {/* <Box
        sx={{
          marginTop: '7rem',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: '#fc8b00',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            fontWeight: 'bold',
            marginBottom: '20px',
            padding: { xs: '20px', sm: 'unset' },
            textAlign: 'center',
          }}
        >
          Buses Schedule
        </Typography>

        <Box sx={{ width: '100%' }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                sx={{
                  color: '#fc8b00',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  textTransform: 'capitalize',
                }}
                label="Day One"
                {...a11yProps(0)}
              />
              <Tab
                sx={{
                  color: '#fc8b00',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  textTransform: 'capitalize',
                }}
                label="Day Two"
                {...a11yProps(1)}
              />
              <Tab
                sx={{
                  color: '#fc8b00',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  textTransform: 'capitalize',
                }}
                label="Day Three"
                {...a11yProps(2)}
              />
            </Tabs>
          </Box>
          <CustomTabPanel
            value={value}
            index={0}
            images={images}
          ></CustomTabPanel>
          <CustomTabPanel
            value={value}
            index={1}
            images={images}
          ></CustomTabPanel>
          <CustomTabPanel
            value={value}
            index={2}
            images={images}
          ></CustomTabPanel>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          >
            <Button variant="contained" onClick={handleDownloadClick}>
              Download Bus Routes PDF
            </Button>
          </Box>
        </Box>
      </Box> */}
      <ComingSoon />
    </>
  );
}
