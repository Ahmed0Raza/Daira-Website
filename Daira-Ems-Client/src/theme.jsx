import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const Theme = createTheme({
  palette: {
    primary: {
      main: '#e89005',
      text: '#fff',
    },
    secondary: {
      main: '#f5b505',
      hover: '#629DBC',
    },
    buttons: {
      main: '#FFFFFF',
      text: '#121212',
      outline: '#f5b505',
      approve: '#e89005',
      approveHover: '#f5b505',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
      admin: '#191716',
    },
    text: {
      primary: '#2C2C2C',
      secondary: '#FFFFFF',
      light: '#E4E6C3',
      blue: 'rgba(0, 102, 140, 1)',
    },
    borderRadius: {
      blue: 'rgba(0, 102, 140, 1)',
    },
    buttonSidebar: {
      main: 'rgba(0, 102, 140, 0.4)',
      ColorActive: 'black',
      ColorActiveHover: 'white',
      BackgroundColorActive: 'transparent',
      BackgroundColorActiveHover: 'rgba(0, 102, 140, 1)',
      hovertextcolor: 'white',
      borderright: '4px solid rgba(0, 102, 140, 1)',
      sidebarshadow: '5px 2px 10px rgba(0, 0, 0, 0.1)',
    },
  },
  typography: {
    allVariants: {
      fontfamily: 'LemonMilk',
      color: '#2C2C2C',
    },
  },
});
responsiveFontSizes(Theme);

export default Theme;
