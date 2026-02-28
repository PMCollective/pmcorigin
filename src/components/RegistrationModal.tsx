import {  useState } from "react";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

const RegistrationModal = ({
  eventId,
  onClose,
}: {
  eventId: Id<"events">;
  onClose: () => void;
}) => {
  const event = useQuery(api.events.getEventById, { id: eventId });
  const register = useMutation(api.registrations.registerForEvent);
  const sendEventRegistrationemail = useAction(api.registrations.sendEventRegistrationemail);

  const [name, setName] = useState("");
  const [email, setemail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validateemail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    if (!event) return;

    if (!name.trim() || !email.trim()) {
      setError("Both fields are required.");
      return;
    }

    if (!validateemail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      // Register the user for the event
      await register({ eventId, name, email });

      // Send email confirmation
      await sendEventRegistrationemail({
        to: email,
        eventTitle: event.title,
        gmeetLink: event.gmeetLink  // fallback
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong or this email is already registered for this event" );
    }
  };

  if (!event) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">Loading event...</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-lg font-bold mb-4">Registration Successful!</h2>
          <p>You will be sent an email on the day of the event.</p>
          <button className="mt-4 text-blue-500" onClick={onClose}>
            Close
            
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">Register for {event.title}</h2>
        <input
          className="w-full border p-2 mb-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          className="w-full border p-2 mb-2"
          placeholder="email"
          value={email}
          onChange={(e) => setemail(e.target.value)}
        />
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <button className="ml-2 text-gray-600" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RegistrationModal;
