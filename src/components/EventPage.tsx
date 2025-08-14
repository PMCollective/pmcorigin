import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import EventCard from "./EventCard";
import { useState } from "react";
import RegistrationModal from "./RegistrationModal";
import { Id } from "../../convex/_generated/dataModel";

const EventsPage = () => {
  const events = useQuery(api.events.getPublishedEvents);
  const [selectedEventId, setSelectedEventId] = useState<Id<"events"> | null>(null);

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-800 mb-10 text-center">
          Upcoming Events
        </h1>

        {events?.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No upcoming events found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events?.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onRegister={() => setSelectedEventId(event._id)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedEventId && (
        <RegistrationModal
          eventId={selectedEventId}
          onClose={() => setSelectedEventId(null)}
        />
      )}
    </div>
  );
};

export default EventsPage;
