import PersonIcon from '@mui/icons-material/Person';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AppRegistrationSharpIcon from '@mui/icons-material/AppRegistrationSharp';
// import DescriptionSharpIcon from '@mui/icons-material/DescriptionSharp';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const NavigationItems = [
  {
    name: 'Go Back',
    link: '/',
    icon: <ArrowBackIcon />,
  },
  {
    name: 'Dashboard',
    link: '/ambassador/dashboard',
    icon: <DashboardIcon />,
  },
  {
    name: 'Manage Participants',
    link: '/ambassador/manageParticipants',
    icon: <PersonIcon />,
  },
  {
    name: 'Register in Event',
    link: '/ambassador/eventRegistration',
    icon: <AppRegistrationSharpIcon />,
  },
  {
    name: 'My Registrations',
    link: '/ambassador/editTeam',
    icon: <ListAltIcon />,
  },
  {
    name: 'Invoice',
    link: '/ambassador/invoice',
    icon: <ReceiptLongIcon />,
  },
  {
    name: 'Browse Events',
    link: '/categories',
    icon: <ConfirmationNumberIcon />,
  },
];

export default NavigationItems;
