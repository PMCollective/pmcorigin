import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface Props {
  eventId: Id<"events">;
  onClose: () => void;
}

export default function ViewRegistrationsModal({ eventId, onClose }: Props) {
  const registrations = useQuery(api.registrations.getRegistrationsByEvent, { eventId });

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Registered Users</h2>

        {registrations === undefined ? (
          <p>Loading...</p>
        ) : registrations.length === 0 ? (
          <p>No registered users.</p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {registrations.map((reg) => (
              <li key={reg._id} className="border-b py-2">
                <div className="font-medium">{reg.name}</div>
                <div className="text-sm text-gray-600">{reg.email}</div>
              </li>
            ))}
          </ul>
        )}

        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
