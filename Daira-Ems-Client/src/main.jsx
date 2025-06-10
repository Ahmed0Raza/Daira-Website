import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from '@emotion/react';
import Theme from './theme';
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from './utils/snackbarContextProvider.jsx';
import { UserAuthProvider } from './pages/user/auth/userAuth.jsx';
import { AmbassadorProvider } from './service/ambassadorService.jsx';
import { GuidebookProvider } from './service/guidebookService.jsx';
import {AccommodationProvider } from './service/accommodationService.jsx'
import { AdminAuthProvider } from './pages/admin/auth/adminAuth.jsx';
import { EventProvider } from './service/eventService.jsx';
import { InvitationsAuthProvider } from './pages/invitations/auth/invitationsAuth.jsx';
import { RegistrationProvider } from './service/registerationService.jsx';
import { SocietyAuthProvider } from './pages/society/auth/societyAuth.jsx';
import { AgentAuthProvider } from './pages/agents/auth/agentAuth.jsx';
import { RegistrationAgentProvider } from './service/registrationAgentService.jsx';
import { SocietyProvider } from './service/societyService.jsx';
import { AccommodationAuthProvider } from './pages/accommodation/auth/accommodationAuth.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <SnackbarProvider>
        <AccommodationProvider>
      <AccommodationAuthProvider>
        <AdminAuthProvider>
          <AgentAuthProvider>
            <UserAuthProvider>
              <AmbassadorProvider>
                <GuidebookProvider>
                  <EventProvider>
                    <InvitationsAuthProvider>
                      <RegistrationProvider>
                        <RegistrationAgentProvider>
                          <SocietyAuthProvider>
                            <SocietyProvider>
                              
                              <App />
                              
                            </SocietyProvider>
                          </SocietyAuthProvider>
                        </RegistrationAgentProvider>
                      </RegistrationProvider>
                    </InvitationsAuthProvider>
                  </EventProvider>
                </GuidebookProvider>
              </AmbassadorProvider>
            </UserAuthProvider>
          </AgentAuthProvider>
        </AdminAuthProvider>
        </AccommodationAuthProvider>
        </AccommodationProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>
);
