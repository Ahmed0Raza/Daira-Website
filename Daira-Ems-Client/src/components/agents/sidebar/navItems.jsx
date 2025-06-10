import PersonIcon from '@mui/icons-material/Person';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AppRegistrationSharpIcon from '@mui/icons-material/AppRegistrationSharp';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReceiptIcon from '@mui/icons-material/Receipt';
import GroupIcon from '@mui/icons-material/Group'; // Added for Approved Team Details

const NavigationItems = [
  {
    name: 'Go Back',
    link: '/',
    icon: <ArrowBackIcon />,
  },
  {
    name: 'Dashboard',
    link: '/agents/dashboard',
    icon: <DashboardIcon />,
  },
  {
    name: 'Registeration Portal',
    link: '/agents/register',
    icon: <PersonIcon />,
  },
  {
    name: 'Invoice Portal',
    link: '/agents/invoice-cards',
    icon: <ReceiptIcon />,
  },
  {
    name: 'Update Participants',
    link: '/agents/update-participants',
    icon: <ReceiptIcon />,
  },
];

export default NavigationItems;
