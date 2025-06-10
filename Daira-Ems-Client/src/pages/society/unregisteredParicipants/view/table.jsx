import * as React from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import {
  Select,
  MenuItem,
  Typography,
  Box,
  Card,
  Stack,
  Chip,
  Avatar,
  Tooltip,
  IconButton,
  Collapse,
  Paper,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import PhoneIcon from '@mui/icons-material/Phone';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const EventTeamsDataGrid = ({ eventsData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedTeam, setSelectedTeam] = React.useState({});
  const [expandedRow, setExpandedRow] = React.useState(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const handleSelectChange = (event, eventId) => {
    const teamIndex = event.target.value;

    if (selectedTeam[eventId]?.index === teamIndex && expandedRow === eventId) {
      setExpandedRow(null);
      return;
    }

    setSelectedTeam({
      ...selectedTeam,
      [eventId]: {
        index: teamIndex,
        name: eventsData[eventId].teams[teamIndex].teamName,
      },
    });
    setExpandedRow(eventId);
  };

  const handleToggleExpand = (eventId) => {
    setExpandedRow(expandedRow === eventId ? null : eventId);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSnackbarOpen(true);
  };

  const MobileEventItem = ({ row }) => (
    <Paper sx={{ mb: 2, p: 2, position: 'relative' }} elevation={2}>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
            {row.eventName.charAt(0)}
          </Avatar>
          <Typography variant="subtitle1" fontWeight="500">
            {row.eventName}
          </Typography>
        </Stack>

        <Select
          value={selectedTeam[row.id]?.index || ''}
          onChange={(event) => handleSelectChange(event, row.id)}
          displayEmpty
          fullWidth
          size="small"
        >
          <MenuItem value="" disabled>
            <GroupIcon sx={{ mr: 1 }} />
            Select Team
          </MenuItem>
          {row.teams.map((team, index) => (
            <MenuItem key={index} value={index}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <GroupIcon color="primary" fontSize="small" />
                <Typography variant="body2">{team.teamName}</Typography>
                <Chip
                  size="small"
                  label={`${team.participants.length}`}
                  color="primary"
                />
              </Stack>
            </MenuItem>
          ))}
        </Select>

        {selectedTeam[row.id] && (
          <IconButton
            onClick={() => handleToggleExpand(row.id)}
            size="small"
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              bgcolor: theme.palette.background.paper,
            }}
          >
            {expandedRow === row.id ? (
              <KeyboardArrowUpIcon fontSize="small" />
            ) : (
              <KeyboardArrowDownIcon fontSize="small" />
            )}
          </IconButton>
        )}
      </Stack>

      {renderTeamMembers(row, true)}
    </Paper>
  );

  const DesktopEventItem = ({ row }) => (
    <Box key={row.id} sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={5}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
              {row.eventName.charAt(0)}
            </Avatar>
            <Typography variant="subtitle1" color="text.primary">
              {row.eventName}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={10} md={5}>
          <Select
            value={selectedTeam[row.id]?.index || ''}
            onChange={(event) => handleSelectChange(event, row.id)}
            displayEmpty
            fullWidth
            size="small"
          >
            <MenuItem value="" disabled>
              <GroupIcon sx={{ mr: 1 }} />
              <em>Select Team</em>
            </MenuItem>
            {row.teams.map((team, index) => (
              <MenuItem key={index} value={index}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <GroupIcon color="primary" />
                  <Typography>{team.teamName}</Typography>
                  <Chip
                    size="small"
                    label={`${team.participants.length} members`}
                    color="primary"
                  />
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </Grid>

        {selectedTeam[row.id] && (
          <Grid item xs={2} md={2}>
            <Box display="flex" justifyContent="flex-end">
              <IconButton
                onClick={() => handleToggleExpand(row.id)}
                size="small"
                sx={{
                  bgcolor: theme.palette.primary.light,
                  color: 'white',
                  '&:hover': {
                    bgcolor: theme.palette.primary.main,
                  },
                }}
              >
                {expandedRow === row.id ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </IconButton>
            </Box>
          </Grid>
        )}
      </Grid>
      {renderTeamMembers(row)}
    </Box>
  );

  const renderTeamMembers = (row, isMobile = false) => {
    const selectedTeamData = selectedTeam[row.id];
    if (!selectedTeamData) return null;

    const team = row.teams[selectedTeamData.index];
    return (
      <Collapse in={expandedRow === row.id}>
        <Paper
          sx={{
            p: isMobile ? 1 : 2,
            mt: 2,
            bgcolor: 'background.paper',
            boxShadow: theme.shadows[1],
          }}
        >
          <Typography variant="subtitle2" color="primary" gutterBottom>
            {team.teamName} Members
          </Typography>
          <Stack spacing={1}>
            {team.participants.map((participant, index) => (
              <Paper
                key={index}
                sx={{
                  p: 1,
                  bgcolor: theme.palette.background.default,
                }}
                elevation={0}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.light,
                      width: 32,
                      height: 32,
                    }}
                  >
                    <PersonIcon fontSize="small" />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" fontWeight="500">
                      {participant.name}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {participant.contactNumber}
                      </Typography>
                      <Tooltip title="Copy number">
                        <IconButton
                          size="small"
                          onClick={() =>
                            copyToClipboard(participant.contactNumber)
                          }
                          sx={{ p: 0.5 }}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Paper>
      </Collapse>
    );
  };

  return (
    <>
      <Card
        sx={{
          width: '100%',
          boxShadow: theme.shadows[2],
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ width: '100%' }}>
          {eventsData.map((event, index) => {
            const row = {
              id: index,
              eventName: event.eventName,
              teams: event.teams,
            };
            return isMobile ? (
              <MobileEventItem key={row.id} row={row} />
            ) : (
              <DesktopEventItem key={row.id} row={row} />
            );
          })}
        </Box>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Phone number copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};

export default EventTeamsDataGrid;
