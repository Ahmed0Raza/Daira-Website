import React, { useEffect, useState } from 'react';
import CreateAxiosInstance from '../../utils/axiosInstance';
import { useSnackbar } from '../../utils/snackbarContextProvider';
import { CircularProgress, Alert } from '@mui/material';

const ModifyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    eventName: '',
    date: '',
    description: '',
    eventCategory: '',
    status: 'active',
    societyName: '',
    rules: '',
    minTeamSize: 1,
    maxTeamSize: 1,
    headName: '',
    contactNumber: '',
    nuEmailAddress: '',
    registrationType: 'Individual',
    prizeMoney: 0,
    registrationFee: 0,
  });
  const { show } = useSnackbar();

  const getAxiosInstance = () => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('adminData'));
      const token = tokenData?.result;
      if (!token) {
        throw new Error('No token found');
      }

      const instance = CreateAxiosInstance();
      instance.defaults.headers.common['Authorization'] = token;
      return instance;
    } catch (error) {
      console.error('Error getting axios instance:', error);
      throw new Error('Invalid or missing admin token. Please login again.');
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const axios = getAxiosInstance();
      const response = await axios.get('/backend/admin/get-all-events');

      if (response.data?.data) {
        console.log('Fetched events data:', response.data.data); // Debug log
        setEvents(response.data.data);
      } else {
        console.error('Invalid response format:', response.data); // Debug log
        setError('Failed to load events');
        setEvents([]);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      if (err?.response?.status === 401) {
        localStorage.removeItem('adminData');
        window.location.href = '/admin/login';
      } else {
        setError(
          err?.response?.status === 401
            ? 'Unauthorized access. Please login again.'
            : 'Failed to load events. Please try again later.'
        );
      }
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const resetForm = () => {
    setSelectedEvent(null);
    setFormData({
      eventName: '',
      date: '',
      description: '',
      eventCategory: '',
      status: 'active',
      societyName: '',
      rules: '',
      minTeamSize: 1,
      maxTeamSize: 1,
      headName: '',
      contactNumber: '',
      nuEmailAddress: '',
      registrationType: 'Individual',
      prizeMoney: 0,
      registrationFee: 0,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const axios = getAxiosInstance();
      const url = selectedEvent
        ? `/backend/admin/update-event/${selectedEvent._id}`
        : '/backend/admin/create-event';

      const method = selectedEvent ? 'patch' : 'post';
      const { data } = await axios[method](url, formData);

      if (data?.success) {
        show('Event saved successfully', 'success');
        await fetchEvents();
        resetForm();
      } else {
        show('Failed to save event', 'error');
      }
    } catch (err) {
      console.error('Error saving event:', err);
      if (err?.response?.status === 401) {
        localStorage.removeItem('adminData');
        window.location.href = '/admin/login';
      } else {
        show(
          err?.response?.status === 401
            ? 'Unauthorized. Please login again.'
            : 'Failed to save event. Please try again.',
          'error'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setFormData({
      eventName: event.eventName || '',
      date: event.date?.split('T')[0] || '',
      description: event.description || '',
      eventCategory: event.eventCategory || '',
      status: event.status || 'active',
      societyName: event.societyName || '',
      rules: event.rules || '',
      minTeamSize: event.minTeamSize || 1,
      maxTeamSize: event.maxTeamSize || 1,
      headName: event.headName || '',
      contactNumber: event.contactNumber || '',
      nuEmailAddress: event.nuEmailAddress || '',
      registrationType: event.registrationType || 'Individual',
      prizeMoney: event.prizeMoney || 0,
      registrationFee: event.registrationFee || 0,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    setLoading(true);
    try {
      const axios = getAxiosInstance();
      const { data } = await axios.delete(`/backend/admin/delete-event/${id}`);

      if (data?.success) {
        show('Event deleted successfully', 'success');
        setEvents((prev) => prev.filter((e) => e._id !== id));
      } else {
        show('Failed to delete event', 'error');
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      if (err?.response?.status === 401) {
        localStorage.removeItem('adminData');
        window.location.href = '/admin/login';
      } else {
        show(
          err?.response?.status === 401
            ? 'Unauthorized. Please login again.'
            : 'Failed to delete event. Please try again.',
          'error'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    setLoading(true);
    try {
      const axios = getAxiosInstance();
      const { data } = await axios.patch(
        `/backend/admin/toggle-event-status/${id}`
      );

      if (data?.success) {
        show('Event status updated successfully', 'success');
        setEvents((prev) =>
          prev.map((event) => (event._id === id ? data.data : event))
        );
      } else {
        show('Failed to update event status', 'error');
      }
    } catch (err) {
      console.error('Error toggling event status:', err);
      if (err?.response?.status === 401) {
        localStorage.removeItem('adminData');
        window.location.href = '/admin/login';
      } else {
        show(
          err?.response?.status === 401
            ? 'Unauthorized. Please login again.'
            : 'Failed to update event status. Please try again.',
          'error'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr || 'N/A';
    }
  };

  const filteredEvents = events.filter((event) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      event.eventName?.toLowerCase().includes(searchLower) ||
      event.societyName?.toLowerCase().includes(searchLower) ||
      event.eventCategory?.toLowerCase().includes(searchLower)
    );
  });

  if (loading && !events.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Modify Events</h1>
      </div>

      {/* Event Form */}
      <div className="bg-gray-100 p-4 mb-6 rounded">
        <h2 className="text-xl mb-4">
          {selectedEvent ? 'Edit Event' : 'Create New Event'}
        </h2>
        <form onSubmit={handleSubmit}>
          {[
            { field: 'eventName', label: 'Event Name' },
            { field: 'societyName', label: 'Society Name' },
            { field: 'eventCategory', label: 'Category' },
            { field: 'description', label: 'Description' },
            { field: 'rules', label: 'Rules' },
            { field: 'headName', label: 'Head Name' },
            { field: 'contactNumber', label: 'Contact Number' },
            { field: 'nuEmailAddress', label: 'NU Email' },
            { field: 'registrationType', label: 'Registration Type' },
            { field: 'prizeMoney', label: 'Prize Money' },
            { field: 'registrationFee', label: 'Registration Fee' },
            { field: 'minTeamSize', label: 'Min Team Size' },
            { field: 'maxTeamSize', label: 'Max Team Size' },
          ].map(({ field, label }) => (
            <div className="mb-4" key={field}>
              <label className="block mb-2">{label}:</label>
              {field === 'description' || field === 'rules' ? (
                <textarea
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  rows="3"
                />
              ) : (
                <input
                  type={
                    field === 'date'
                      ? 'date'
                      : field === 'prizeMoney' ||
                          field === 'registrationFee' ||
                          field === 'minTeamSize' ||
                          field === 'maxTeamSize'
                        ? 'number'
                        : 'text'
                  }
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required={field !== 'category'}
                />
              )}
            </div>
          ))}

          <div className="mb-4">
            <label className="block mb-2">Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading
                ? 'Saving...'
                : selectedEvent
                  ? 'Update Event'
                  : 'Create Event'}
            </button>
            {selectedEvent && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <input
        type="text"
        placeholder="Search events..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-2 border rounded"
      />

      {/* Events Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-200">
            <tr>
              {['Event Name', 'Society', 'Category', 'Status', 'Actions'].map(
                (col) => (
                  <th className="p-2 border" key={col}>
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  {searchQuery
                    ? 'No events found matching your search'
                    : 'No events found'}
                </td>
              </tr>
            ) : (
              filteredEvents.map((event) => (
                <tr key={event._id}>
                  <td className="p-2 border">{event.eventName}</td>
                  <td className="p-2 border">{event.societyName}</td>
                  <td className="p-2 border">{event.eventCategory}</td>
                  <td className="p-2 border">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        event.status === 'active'
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }`}
                    >
                      {event.status}
                    </span>
                  </td>
                  <td className="p-2 border">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 disabled:bg-gray-400"
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(event._id)}
                        className={`px-3 py-1 rounded text-white ${
                          event.status === 'active'
                            ? 'bg-orange-500 hover:bg-orange-600'
                            : 'bg-green-500 hover:bg-green-600'
                        } disabled:bg-gray-400`}
                        disabled={loading}
                      >
                        {event.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:bg-gray-400"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModifyEvents;
