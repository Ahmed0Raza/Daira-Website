import TextWithTable from '../components/TextWithTable';

const columns = [
  { id: 'perks', label: 'Package', minWidth: 170 },
  { id: 'platinum', label: 'Platinum Perks 50+ Participants', minWidth: 170 },
  { id: 'gold', label: 'Gold Perks 30+ Participants', minWidth: 170 },
  { id: 'silver', label: 'Silver Perks 20+ Participants', minWidth: 170 },
  { id: 'bronze', label: 'Bronze Perks 10+ Participants', minWidth: 170 },
];

const data = [
  {
    perks: 'Cash Prize',
    platinum: 'PKR 5000/-',
    gold: '‐',
    silver: '‐',
    bronze: '‐',
  },
  {
    perks: 'Daira’25 Shield',
    platinum: '✓',
    gold: '✓',
    silver: '‐',
    bronze: '‐',
  },
  {
    perks: 'Daira’25 Polo Shirt',
    platinum: '✓',
    gold: '✓',
    silver: '✓',
    bronze: '‐',
  },
  {
    perks: 'Free Socials Pass',
    platinum: '4 persons',
    gold: '3 persons',
    silver: '2 persons',
    bronze: '1 person',
  },
  {
    perks: 'Free registration (for one event)',
    platinum: '3 persons',
    gold: '2 persons',
    silver: '‐',
    bronze: '‐',
  },
  {
    perks: 'Social Media Promotion',
    platinum: '✓',
    gold: '✓',
    silver: '‐',
    bronze: '‐',
  },
];

const rows = data.map((row, index) => ({
  id: index,
  perks: row.perks,
  platinum: row.platinum,
  gold: row.gold,
  silver: row.silver,
  bronze: row.bronze,
}));

const AmbassadorPerks = () => {
  return (
    <>
      <TextWithTable
        text={'AMBASSADOR PACKAGE'}
        rows={rows}
        columns={columns}
      />
    </>
  );
};

export default AmbassadorPerks;
