import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import { useLocation } from 'react-router-dom'; // If using React Router
import { initGA, logPageView } from './service/google-analytics.jsx';
import Home from './pages/Home';
import Profile from './pages/Profile';
import RuleBook from './pages/RuleBook';
import Schedule from './pages/Schedule';
import Registerations from './pages/Registerations';
import EmailVerification from './components/EmailVerification';
import Login from './pages/user/login';
import UserLayout from './pages/user/layout/userlayout';
import Signup from './pages/user/signup';
import UserNonLoginRoute from './pages/user/auth/nonProtectedRoutes';
import UserProtectedRoute from './pages/user/auth/protectedRoutes';
import Ambassador from './pages/Ambassador';
import AmbassadorPerks from './pages/AmbassadorsPerks';
import AdminLayout from './pages/admin/layout/adminLayout';
import AdminHome from './pages/admin/home/adminHome';
import AmbassadorReg from './pages/ambassador/registration/ambassadorReg';
import MeetTheTeam from './pages/MeetTheTeam';
import AmbassadorView from './pages/ambassador/ambassadorView/ambassadorView';
import AdminLogin from './pages/admin/login';
import AdminNonLoginRoute from './pages/admin/auth/nonProtectedRoute';
import AdminProtectedRoute from './pages/admin/auth/protectedRoute';
import ForgotPassword from './pages/ForgotPassword';
import AmbassadorSignup from './components/Ambassador-SignUp';
import { ApprovedAmbassadorProvider } from './service/approvedAmbassador';
import ApprovedAmbassadorView from './pages/admin/ambassador/approvedAmbassadors';
import GuideBookView from './pages/admin/GuideBook-view';
import ManageEvents from './pages/admin/ManageEvents';
import UploadEventData from './pages/admin/uploadEvents';
import ModifyEvents from './pages/admin/modifyEvents';
import EventsPage from './pages/Events';
import EventDetails from './pages/Event-Details';
import { useEffect } from 'react';
import { useGuidebook } from './service/guidebookService';
import AmbassadorLayout from './pages/ambassador/layout';
import Dashboard from './pages/ambassador/dashboard/dashboard';
import Register from './pages/ambassador/register/register';
import BrowseEvents from './pages/ambassador/browseEvent/event';
import Invoice from './pages/ambassador/invoice/invoice';
import ManageParticipants from './pages/ambassador/participants/participants';
import Categories from './pages/Categories';
import InvitationsProtectedRoute from './pages/invitations/auth/protectedRoute';
import InvitationsNonLoginRoute from './pages/invitations/auth/nonProtectedRoute';
import InvitationsLogin from './pages/invitations/login';
import InvitationsLayout from './pages/invitations/layout/invitationsLayout';
import NotFoundPage from './utils/NotFoundPage';
import EditTeam from './pages/ambassador/editTeam/editTeam';
import UnderConstruction from './utils/underconstruction';
import AmbassadorEventSpecific from './pages/AmbassadorEventSpecific';
import AgentLogin from './pages/agents/login';
import AgentDashboard from './pages/agents/home/dashboard';
import AgentProtectedRoute from './pages/agents/auth/protectedRoute';
import AgentNonLoginRoute from './pages/agents/auth/nonProtectedRoute';
import SocietyNonLoginRoute from './pages/society/auth/nonProtectedRoute';
import SocietyLogin from './pages/society/login';
import AccommodationNonLoginRoute from './pages/accommodation/auth/nonProtectedRoute';
import AccommodationLogin from './pages/accommodation/login';
import AddUser from './pages/admin/addUser';
import SponsershipPage from './components/SponsershipPage';
import RegisterationPage from './pages/agents/registration/registration';
import RegistrationAgentLayout from './pages/agents/layout/layout';
import About from './components/About';
import AmbassadorParticipantsSpecific from './pages/AmbassadorParticipantsSpecific';
import InvoiceCards from './pages/agents/invoiceCards/invoiceCards.jsx';
import SocietiesView from './pages/society/socitiesView';
import SocietyLayout from './pages/society/layout/layout';
import Details from './pages/society/eventDetails/index';
import BusSchedule from './pages/BusSchedule.jsx';
import SocietyProtectedRoute from './pages/society/auth/protectedRoute';
import AccommodationProtectedRoute from './pages/accommodation/auth/protectedRoute';
import ParticipantView from './pages/society/participantView';
import Accomdation from './pages/society/accomdationView/Accomdation.jsx';
import Socials from './pages/SocialsPage.jsx';
import AccommodationLayout from './pages/accommodation/layout/layout.jsx';
import UnregisteredParticipants from './pages/society/unregisteredParicipants/index.jsx';
import UpdateParticipants from './pages/agents/editParticipants/index.jsx';
import AccommodationDashboard from './pages/accommodation/dashboard/dashboard.jsx'

function TrackPageViews() {
  const location = useLocation();

  useEffect(() => {
    logPageView();
  }, [location]);

  return null;
}

export default function App() {
  // const location = useLocation(); // For React Router
  const { getGuidebook } = useGuidebook();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    const fetchAndCacheGuidebook = async () => {
      try {
        const cache = await caches.open('guidebook-cache');
        const cachedResponse = await cache.match('guidebook');

        if (!cachedResponse) {
          const { blob, url } = await getGuidebook();
          if (blob) {
            const response = new Response(blob, {
              headers: {
                Expires: new Date(Date.now() + 1000 * 60 * 60).toUTCString(), // Expires in 1 hour
              },
            });
            try {
              await cache.put('guidebook', response);
            } catch (error) {
              console.error('Error updating cache:', error);
            }
          } else {
            console.error('Error fetching guidebook');
          }
        } else {
          const expirationTime = cachedResponse.headers.get('Expires');
          if (!expirationTime || new Date(expirationTime) < new Date()) {
            const { blob, url } = await getGuidebook();
            if (blob) {
              const response = new Response(blob, {
                headers: {
                  Expires: new Date(Date.now() + 1000 * 60 * 60).toUTCString(), // Expires in 1 hour
                },
              });
              try {
                await cache.put('guidebook', response);
              } catch (error) {
                console.error('Error updating cache:', error);
              }
            } else {
              console.error('Error fetching guidebook');
            }
          }
        }
      } catch (error) {
        console.error('Error caching guidebook:', error);
      }
    };
    fetchAndCacheGuidebook();
  }, []);

  // useEffect(() => {
  //   initGA();
  // }, []);

  // useEffect(() => {
  //   logPageView();
  // }, [location]);

  return (
    <ApprovedAmbassadorProvider>
      <BrowserRouter>
        <TrackPageViews />
        <Routes>
          {/* Non-Protected Routes Socials */}
          <Route path="/socials" element={<Socials />} />
          {/* Non-Protected Routes User */}
          <Route element={<UserNonLoginRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/ambassador-activation"
              element={<AmbassadorSignup />}
            />
          </Route>

          {/* Protected Routes User */}
          <Route element={<UserProtectedRoute />}>
            <Route element={<AmbassadorLayout />}>
              <Route path="/ambassador/dashboard" element={<Dashboard />} />
              <Route
                path="/ambassador/manageParticipants"
                element={<ManageParticipants />}
              />
              <Route
                path="/ambassador/eventRegistration"
                element={<Register />}
              />
              <Route path="/ambassador/editTeam" element={<EditTeam />} />
              <Route path="/ambassador/invoice" element={<Invoice />} />
              <Route
                path="/ambassador/browseEvents"
                element={<BrowseEvents />}
              />
            </Route>
          </Route>

          {/* User Layout */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/user-profile" element={<Profile />} />
            <Route path="/rule-book" element={<RuleBook />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/ambassador" element={<Ambassador />} />
            <Route path="/ambassadors-perks" element={<AmbassadorPerks />} />
            <Route path="/ambassador-application" element={<AmbassadorReg />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/event-details/:id" element={<EventDetails />} />
            <Route path="/meet-the-team" element={<MeetTheTeam />} />
            <Route path="/sponsors" element={<SponsershipPage />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/bus-schedule" element={<BusSchedule />} />
          </Route>

          {/** Admin Routes */}
          <Route element={<AdminNonLoginRoute />}>
            <Route path={'/batman/admin/login'} element={<AdminLogin />} />
          </Route>

          <Route element={<AdminProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path={'/batman/admin/'} element={<AdminHome />} />
              <Route path={'/batman/admin/home'} element={<AdminHome />} />
              <Route
                path={'/batman/admin/approvedAmbassador'}
                element={<ApprovedAmbassadorView />}
              />
              <Route
                path={'/batman/admin/ambassadorNomination'}
                element={<AmbassadorView />}
              />
              <Route
                path={'/batman/admin/guidebook'}
                element={<GuideBookView />}
              />
              <Route
                path={'/batman/admin/ambassador-event-specific'}
                element={<AmbassadorEventSpecific />}
              />
              <Route path={'/batman/admin/events'} element={<ManageEvents />} />
              <Route
                path={'/batman/admin/events/upload-events'}
                element={<UploadEventData />}
              />
              <Route
                path={'/batman/admin/events/manage-events'}
                element={<ModifyEvents />}
              />
              <Route path={'/batman/admin/addusers'} element={<AddUser />} />
            </Route>
          </Route>

          {/* Invitation Team Routes */}
          <Route element={<InvitationsNonLoginRoute />}>
            <Route
              path={'/coolboi69/invitation/login'}
              element={<InvitationsLogin />}
            />
          </Route>

          <Route element={<InvitationsProtectedRoute />}>
            <Route element={<InvitationsLayout />}>
              <Route path={'/coolboi69/invitation'} element={<AdminHome />} />
              <Route
                path={'/coolboi69/invitation/home'}
                element={<AdminHome />}
              />
              <Route
                path={'/coolboi69/invitation/approvedAmbassador'}
                element={<ApprovedAmbassadorView />}
              />
              <Route
                path={'/coolboi69/invitation/ambassadorNomination'}
                element={<AmbassadorView />}
              />
              <Route
                path={'/coolboi69/invitation/ambassador-event-specific'}
                element={<AmbassadorEventSpecific />}
              />
              <Route
                path={'/coolboi69/invitation/ambassador-participants-specific'}
                element={<AmbassadorParticipantsSpecific />}
              />
            </Route>
          </Route>

          <Route element={<AgentNonLoginRoute />}>
            <Route path="/agents/login" element={<AgentLogin />} />
          </Route>

          <Route element={<AgentProtectedRoute />}>
            <Route element={<RegistrationAgentLayout />}>
              <Route path="/agents/register" element={<RegisterationPage />} />
              <Route path="/agents/dashboard" element={<AgentDashboard />} />
              <Route path="/agents/invoice-cards" element={<InvoiceCards />} />
              <Route
                path="/agents/update-participants"
                element={<UpdateParticipants />}
              />
            </Route>
          </Route>

          {/* Accommodation Head Route */}
          <Route element={<AccommodationNonLoginRoute />}>
            <Route
              path={'/accommodation/login'}
              element={<AccommodationLogin />}
            />
          </Route>

          <Route element={<AccommodationProtectedRoute />}>
            <Route element={<AccommodationLayout />}>
              <Route
                path={'/accommodation/dashboard'}
                element={<AccommodationDashboard />} // Replace with actual dashboard component when ready
              />
            </Route>
          </Route>

          {/* Society President Route */}
          <Route element={<SocietyNonLoginRoute />}>
            <Route path={'/coolboi69/login'} element={<SocietyLogin />} />
          </Route>

          <Route element={<SocietyProtectedRoute />}>
            <Route element={<SocietyLayout />}>
              <Route
                path={'/coolboi69/analytics'}
                element={<SocietiesView />}
              />
              <Route
                path={'/coolboi69/event-details'}
                element={<ParticipantView />}
              />
              <Route
                path={'/coolboi69/accomdation-count'}
                element={<Accomdation />}
              />
              <Route
                path={'/coolboi69/un-registered-participants'}
                element={<UnregisteredParticipants />}
              />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ApprovedAmbassadorProvider>
  );
}
