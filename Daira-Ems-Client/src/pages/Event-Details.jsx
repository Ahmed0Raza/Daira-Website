import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { useEvent } from '../service/eventService';

const EventDetails = ({ eventId }) => {
  const [event, setEvent] = useState(null);
  const { getEventById } = useEvent();
  const { id } = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      const fetchedEvent = await getEventById(id);
      setEvent(fetchedEvent);
    };

    fetchEvent();
  }, [id, getEventById]);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto flex flex-col">
          <div className="lg:w-4/6 mx-auto">
            <div className="flex flex-col sm:flex-row mt-10">
              <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
                <div className="flex flex-col items-center text-center justify-center">
                  <h2 className="font-medium title-font mt-4 text-gray-900 text-2xl">
                    {event.eventName}
                  </h2>
                  <div className="w-12 h-1 bg-[#fc8b00] rounded mt-2 mb-4"></div>
                </div>
              </div>
              <div className="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left">
                <p className="leading-relaxed text-lg mb-4">
                  {event.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Box>
  );
};

export default EventDetails;
