const adminRoute = '/batman/admin';

const NavigationItems = [
  {
    name: 'Dashboard',
    link: adminRoute + '/home',
  },
  {
    name: 'Ambassadors',
    link: adminRoute + '/approvedAmbassador',
  },
  {
    name: 'Ambassador Approval',
    link: adminRoute + '/ambassadorNomination',
  },
  {
    name: 'Guide Book',
    link: adminRoute + '/guidebook',
  },
  {
    name: 'View Ambassador Events',
    link: adminRoute + '/ambassador-event-specific',
  },
  {
    name: 'Add Users',
    link: adminRoute + '/addusers',
  },
  {
    name: 'Events',
    link: adminRoute + '/events',
    subItems: [
      {
        name: 'Manage Events',
        link: adminRoute + '/events/manage-events',
      },
      {
        name: 'Upload Events',
        link: adminRoute + '/events/upload-events',
      },
    ],
  },
];

export default NavigationItems;
