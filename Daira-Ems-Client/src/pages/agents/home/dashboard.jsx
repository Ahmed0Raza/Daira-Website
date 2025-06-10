'use client';

import { useEffect, useState } from 'react';
import { useRegistrationAgent } from '../../../service/registrationAgentService';
import Spinner from '../../../utils/spinner';
import ApprovedTeamDetails from './modal/ApprovedTeamDetails';
import UnapprovedTeamDetails from './modal/UnapprovedTeamDetails';
import ApprovedAccommodationDetails from './modal/ApprovedAccommodationDetails';
import UnapprovedAccommodationDetails from './modal/UnapprovedAccommodationDetails';
import RegisteredUserDetails from './modal/RegisteredUserDetails';
import ApprovedParticipantsDetails from './modal/ApprovedParticipantsDetails';
import ApprovedPaymentDetails from './modal/ApprovedPaymentDetails';
import ApprovedAccommodationPaymentDetails from './modal/ApprovedAccommodationPaymentDetails';
import {
  CheckCircle,
  Clock,
  Home,
  AlertCircle,
  Users,
  UserCheck,
  CreditCard,
  Building,
} from 'lucide-react';

const AgentDashboard = () => {
  const { getRegistrationAgentStats } = useRegistrationAgent();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [showApprovedTeams, setShowApprovedTeams] = useState(false);
  const [showUnapprovedTeams, setShowUnapprovedTeams] = useState(false);
  const [showApprovedAccommodations, setShowApprovedAccommodations] =
    useState(false);
  const [showUnapprovedAccommodations, setShowUnapprovedAccommodations] =
    useState(false);
  const [showRegisteredUsers, setShowRegisteredUsers] = useState(false);
  const [showApprovedParticipants, setShowApprovedParticipants] =
    useState(false);
  const [showApprovedPaymentDetails, setShowApprovedPaymentDetails] =
    useState(false);
  const [
    showApprovedAccommodationPaymentDetails,
    setShowApprovedAccommodationPaymentDetails,
  ] = useState(false);

  const userData = JSON.parse(localStorage.getItem('agentData'));
  const token = userData?.result;

  useEffect(() => {
    const fetchBaseStats = async () => {
      setLoading(true);
      const result = await getRegistrationAgentStats(token);
      if (result) {
        setStats(result);
      }
      setLoading(false);
    };

    fetchBaseStats();
  }, [token]);

  // Handle card click: reset all, then set the selected card's state to true.
  const handleCardClick = (cardId) => {
    setShowApprovedTeams(false);
    setShowUnapprovedTeams(false);
    setShowApprovedAccommodations(false);
    setShowUnapprovedAccommodations(false);
    setShowRegisteredUsers(false);
    setShowApprovedParticipants(false);
    setShowApprovedPaymentDetails(false);
    setShowApprovedAccommodationPaymentDetails(false);

    if (cardId === 1) setShowApprovedTeams(true);
    else if (cardId === 2) setShowUnapprovedTeams(true);
    else if (cardId === 3) setShowApprovedAccommodations(true);
    else if (cardId === 4) setShowUnapprovedAccommodations(true);
    else if (cardId === 5) setShowRegisteredUsers(true);
    else if (cardId === 6) setShowApprovedParticipants(true);
    else if (cardId === 7) setShowApprovedPaymentDetails(true);
    else if (cardId === 8) setShowApprovedAccommodationPaymentDetails(true);
  };

  const cardsData = [
    {
      id: 1,
      title: stats?.approvedTeams || 0,
      content: 'Approved Teams',
      icon: <CheckCircle className="w-8 h-8 text-emerald-500" />,
      activeColor: 'border-emerald-500 shadow-emerald-200',
      bgColor: 'bg-emerald-50',
    },
    {
      id: 2,
      title: stats?.unapprovedTeams || 0,
      content: 'Pending Teams',
      icon: <Clock className="w-8 h-8 text-amber-500" />,
      activeColor: 'border-amber-500 shadow-amber-200',
      bgColor: 'bg-amber-50',
    },
    {
      id: 3,
      title: stats?.approvedAccommodations || 0,
      content: 'Approved Accommodations',
      icon: <Home className="w-8 h-8 text-violet-500" />,
      activeColor: 'border-violet-500 shadow-violet-200',
      bgColor: 'bg-violet-50',
    },
    {
      id: 4,
      title: stats?.unapprovedAccommodations || 0,
      content: 'Unapproved Accommodations',
      icon: <AlertCircle className="w-8 h-8 text-rose-500" />,
      activeColor: 'border-rose-500 shadow-rose-200',
      bgColor: 'bg-rose-50',
    },
    {
      id: 5,
      title: stats?.registeredUsers || 0,
      content: 'Registered Users',
      icon: <Users className="w-8 h-8 text-sky-500" />,
      activeColor: 'border-sky-500 shadow-sky-200',
      bgColor: 'bg-sky-50',
    },
    {
      id: 6,
      title: stats?.approvedParticipants || 0,
      content: 'Approved Participants',
      icon: <UserCheck className="w-8 h-8 text-purple-500" />,
      activeColor: 'border-purple-500 shadow-purple-200',
      bgColor: 'bg-purple-50',
    },
    {
      id: 7,
      title: `Rs ${stats?.registrationRevenue?.toLocaleString() || 0}`,
      content: 'Registration Revenue',
      icon: <CreditCard className="w-8 h-8 text-green-600" />,
      activeColor: 'border-green-600 shadow-green-200',
      bgColor: 'bg-green-50',
      titleColor: 'text-green-600',
    },
    {
      id: 8,
      title: `Rs ${stats?.accommodationRevenue?.toLocaleString() || 0}`,
      content: 'Accommodation Revenue',
      icon: <Building className="w-8 h-8 text-green-600" />,
      activeColor: 'border-green-600 shadow-green-200',
      bgColor: 'bg-green-50',
      titleColor: 'text-green-600',
    },
  ];

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {cardsData.map((card) => (
              <div key={card.id} className="relative">
                <div
                  className={`h-[220px] sm:h-[240px] md:h-[260px] flex flex-col justify-center items-center text-center bg-white rounded-xl p-6 transition-all duration-300 ease-in-out hover:translate-y-[-5px] hover:shadow-lg cursor-pointer ${card.bgColor} ${
                    (card.id === 1 && showApprovedTeams) ||
                    (card.id === 2 && showUnapprovedTeams) ||
                    (card.id === 3 && showApprovedAccommodations) ||
                    (card.id === 4 && showUnapprovedAccommodations) ||
                    (card.id === 5 && showRegisteredUsers) ||
                    (card.id === 6 && showApprovedParticipants) ||
                    (card.id === 7 && showApprovedPaymentDetails) ||
                    (card.id === 8 && showApprovedAccommodationPaymentDetails)
                      ? `border-2 ${card.activeColor} shadow-lg`
                      : 'border border-gray-100 shadow-md'
                  }`}
                  onClick={() => handleCardClick(card.id)}
                >
                  <div className="mb-4">{card.icon}</div>
                  <h2
                    className={`text-2xl font-bold mb-2 ${card.titleColor || 'text-purple-700'}`}
                  >
                    {card.title}
                  </h2>
                  <p className="text-gray-600 font-medium">{card.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Conditionally render detail modals */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${showApprovedTeams ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}
          >
            <div className="w-full bg-white rounded-xl shadow-md p-4">
              <ApprovedTeamDetails token={token} />
            </div>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${showUnapprovedTeams ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}
          >
            <div className="w-full bg-white rounded-xl shadow-md p-4">
              <UnapprovedTeamDetails token={token} />
            </div>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${showApprovedAccommodations ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}
          >
            <div className="w-full bg-white rounded-xl shadow-md p-4">
              <ApprovedAccommodationDetails token={token} />
            </div>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${showUnapprovedAccommodations ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}
          >
            <div className="w-full bg-white rounded-xl shadow-md p-4">
              <UnapprovedAccommodationDetails token={token} />
            </div>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${showRegisteredUsers ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}
          >
            <div className="w-full bg-white rounded-xl shadow-md p-4">
              <RegisteredUserDetails token={token} />
            </div>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${showApprovedParticipants ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}
          >
            <div className="w-full bg-white rounded-xl shadow-md p-4">
              <ApprovedParticipantsDetails token={token} />
            </div>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${showApprovedPaymentDetails ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}
          >
            <div className="w-full bg-white rounded-xl shadow-md p-4">
              <ApprovedPaymentDetails token={token} />
            </div>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${showApprovedAccommodationPaymentDetails ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}
          >
            <div className="w-full bg-white rounded-xl shadow-md p-4">
              <ApprovedAccommodationPaymentDetails token={token} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AgentDashboard;
