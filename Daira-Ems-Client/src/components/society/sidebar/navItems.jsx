import PersonIcon from '@mui/icons-material/Person';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AppRegistrationSharpIcon from '@mui/icons-material/AppRegistrationSharp';
// import DescriptionSharpIcon from '@mui/icons-material/DescriptionSharp';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { icons } from 'lucide-react';

const societyRoute = '/coolboi69';

const NavigationItems = [
  {
    name: 'Go Back',
    link: '/',
    icon: <ArrowBackIcon />,
  },
  {
    name: 'Analytics',
    link: `${societyRoute}/analytics`,
    icon: <DashboardIcon />,
  },
  {
    name: 'Event Wise Details',
    link: `${societyRoute}/event-details`,
    icon: <ConfirmationNumberIcon />,
  },
  {
    name: 'Accomdation Count',
    link: `${societyRoute}/accomdation-count`,
    icon: <ConfirmationNumberIcon />,
  },
  {
    name: 'Un Registered Participants',
    link: `${societyRoute}/un-registered-participants`,
    icons: <ConfirmationNumberIcon />,
  },
];

export default NavigationItems;
