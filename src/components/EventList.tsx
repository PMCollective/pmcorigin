import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import EventRow from "./EventRow";
import { Id } from "../../convex/_generated/dataModel";
import ViewRegistrationsModal from "./ViewRegistrationModal";
import { useState } from "react";
import toast from "react-hot-toast";
const EventList = () => {
  const events = useQuery(api.events.getAllEvents);
  const deleteEvent = useMutation(api.events.deleteEvent);

  const [selectedEventId, setSelectedEventId] = useState<Id<"events"> | null>(null);


const handleDelete = (id: Id<"events">) => {
  toast((t) => (
    <div className="p-3">
      <p className="text-sm mb-2 font-medium text-gray-800">
        Are you sure you want to delete this event?
      </p>
      <div className="flex justify-end gap-2">
        <button
          className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700"
          onClick={async () => {
            toast.dismiss(t.id); // Close the prompt
            try {
              await deleteEvent({ id });
              toast.success("Event deleted successfully!");
            } catch (err) {
              toast.error("FPMled to delete the event.");
            }
          }}
        >
          Yes, Delete
        </button>
        <button
          className="bg-gray-200 text-gray-800 px-3 py-1 text-sm rounded hover:bg-gray-300"
          onClick={() => toast.dismiss(t.id)}
        >
          Cancel
        </button>
      </div>
    </div>
  ));
};


  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">All Events</h2>
      <ul className="space-y-2">
        {events?.map((event) => (
          <li key={event._id} className="border p-4 rounded">
            <EventRow event={event} onDelete={() => handleDelete(event._id)} />

            <button
              className="text-sm text-blue-600 underline mt-2"
              onClick={() => setSelectedEventId(event._id)}
            >
              View Registrations
            </button>
          </li>
        ))}
      </ul>

      {selectedEventId && (
        <ViewRegistrationsModal
          eventId={selectedEventId}
          onClose={() => setSelectedEventId(null)}
        />
      )}
    </div>
  );
};

export default EventList;
