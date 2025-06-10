'use client';

import { useEffect, useState } from 'react';
import { Home, AlertCircle } from 'lucide-react';
import { useAccommodation } from '../../../service/accommodationService';

const AccommodationDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [approvedAccommodations, setApprovedAccommodations] = useState([]);
  const [unapprovedAccommodations, setUnapprovedAccommodations] = useState([]);
  const [showApprovedAccommodations, setShowApprovedAccommodations] = useState(false);
  const [showUnapprovedAccommodations, setShowUnapprovedAccommodations] = useState(false);
  const data = localStorage.getItem('isAccommodationData');
  const parsedData = JSON.parse(data);
  const token = parsedData.result;
  
  // Using the context hook instead of direct axios calls
  const { getAccommodationDetails } = useAccommodation();
  
  useEffect(() => {
    console.log(token);
    const fetchAccommodations = async () => {
      setLoading(true);
      try {
        // Use the context function instead of direct axios calls
        const accommodationData = await getAccommodationDetails(token);
        
        // Set state with the response data
        setApprovedAccommodations(accommodationData.approved.result);
        setUnapprovedAccommodations(accommodationData.unapproved.result);
      } catch (error) {
        console.error('Error fetching accommodations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  },[]);

  // Handle card click: reset all, then set the selected card's state to true
  const handleCardClick = (cardId) => {
    if (cardId === 1) {
      setShowApprovedAccommodations(true);
      setShowUnapprovedAccommodations(false);
    } else if (cardId === 2) {
      setShowApprovedAccommodations(false);
      setShowUnapprovedAccommodations(true);
    }
  };

  const cardsData = [
    {
      id: 1,
      title: approvedAccommodations.length || 0,
      content: 'Approved Accommodations',
      icon: <Home className="w-8 h-8 text-violet-500" />,
      activeColor: 'border-violet-500 shadow-violet-200',
      bgColor: 'bg-violet-50',
    },
    {
      id: 2,
      title: unapprovedAccommodations.length || 0,
      content: 'Unapproved Accommodations',
      icon: <AlertCircle className="w-8 h-8 text-rose-500" />,
      activeColor: 'border-rose-500 shadow-rose-200',
      bgColor: 'bg-rose-50',
    }
  ];

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cardsData.map((card) => (
              <div key={card.id} className="relative">
                <div
                  className={`h-[220px] sm:h-[240px] md:h-[260px] flex flex-col justify-center items-center text-center bg-white rounded-xl p-6 transition-all duration-300 ease-in-out hover:translate-y-[-5px] hover:shadow-lg cursor-pointer ${card.bgColor} ${
                    (card.id === 1 && showApprovedAccommodations) ||
                    (card.id === 2 && showUnapprovedAccommodations)
                      ? `border-2 ${card.activeColor} shadow-lg`
                      : 'border border-gray-100 shadow-md'
                  }`}
                  onClick={() => handleCardClick(card.id)}
                >
                  <div className="mb-4">{card.icon}</div>
                  <h2 className="text-2xl font-bold mb-2 text-purple-700">
                    {card.title}
                  </h2>
                  <p className="text-gray-600 font-medium">{card.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Approved Accommodations Table */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${showApprovedAccommodations ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}
          >
            <div className="w-full bg-white rounded-xl shadow-md p-4">
              <h2 className="text-lg font-bold mb-4">Approved Accommodations</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CNIC</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {approvedAccommodations.map((accommodation) => (
                      <tr key={accommodation._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{accommodation.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{accommodation.cnic}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{accommodation.contactNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{accommodation.gender}</td>
                      </tr>
                    ))}
                    {approvedAccommodations.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No approved accommodations found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Unapproved Accommodations Table */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${showUnapprovedAccommodations ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}
          >
            <div className="w-full bg-white rounded-xl shadow-md p-4">
              <h2 className="text-lg font-bold mb-4">Unapproved Accommodations</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CNIC</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {unapprovedAccommodations.map((accommodation) => (
                      <tr key={accommodation._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{accommodation.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{accommodation.cnic}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{accommodation.contactNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{accommodation.gender}</td>
                      </tr>
                    ))}
                    {unapprovedAccommodations.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No unapproved accommodations found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccommodationDashboard;