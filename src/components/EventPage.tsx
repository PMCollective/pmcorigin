import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import EventCard from "./EventCard";
import { useState } from "react";
import RegistrationModal from "./RegistrationModal";
import type { Id } from "../../convex/_generated/dataModel";

const EventPage = () => {
  const events = useQuery(api.events.getPublishedEvents);
  const [selectedEventId, setSelectedEventId] = useState<Id<"events"> | null>(null);

  // Separate events into past and upcoming
  const currentDate = new Date();
  const upcomingEvents = events?.filter(event => new Date(event.dateTime) > currentDate) || [];
  const pastEvents = events?.filter(event => new Date(event.dateTime) <= currentDate) || [];

  // Loader while fetching
  if (events === undefined) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-purple-50 to-purple-100 relative overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 bg-[url('/images/ai-hero-bg.jpg')] bg-cover bg-center opacity-10"></div>
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(139,92,246,0.1)_2px,transparent_0)] [background-size:24px_24px] opacity-70"></div>
        <div className="relative">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Loading Events</h1>
          {/* Outer ring */}
          <div className="w-16 h-16 border-4 border-purple-100 rounded-full animate-spin border-t-purple-600 mx-auto"></div>
          {/* Inner ring with slower spin */}
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-300 animate-spin"
            style={{ animationDuration: "1.5s" }}
          ></div>
        </div>
        <h2 className="mt-6 text-xl font-semibold text-gray-800">
          Loading Events
        </h2>
        <p className="text-gray-600 mt-1">
          Please wait while we fetch events...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-100 py-12 px-4 sm:px-8 relative overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0 bg-[url('/images/ai-hero-bg.jpg')] bg-cover bg-center opacity-10"></div>
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(139,92,246,0.1)_2px,transparent_0)] [background-size:24px_24px] opacity-70"></div>
      <div className="max-w-6xl mx-auto relative">
        <h1 className="text-4xl font-bold text-purple-900 mb-10 text-center">
          Events
        </h1>

        {/* Upcoming Events Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-purple-800 mb-6">
            Upcoming Events
          </h2>
          {upcomingEvents.length === 0 ? (
            <p className="text-center text-gray-600 text-lg bg-white/50 rounded-lg p-6">
              No upcoming events found.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...upcomingEvents].reverse().map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  isUpcoming={true}
                  onRegister={() =>
                    setSelectedEventId(event._id as Id<"events">)
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Past Events Section */}
        {pastEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Past Events
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...pastEvents].reverse().map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  isUpcoming={false}
                  onRegister={() => {}}
                />
              ))}
            </div>
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

export default EventPage;