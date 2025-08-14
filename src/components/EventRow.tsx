import { useState } from "react";
import { Doc } from "../../convex/_generated/dataModel";
import UpdateEventModal from "./UpdateEventModal"; // adjust path if needed

const EventRow = ({
  event,
  onDelete,
}: {
  event: Doc<"events">;
  onDelete: () => void;
}) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  return (
    <>
      <li className="border p-3 rounded shadow-sm flex justify-between items-center">
        <div>
          <strong>{event.title}</strong> —{" "}
          {new Date(event.dateTime).toLocaleString()}
          <p className="text-sm text-gray-500">{event.description}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowUpdateModal(true)}
            className="bg-yellow-500 text-white px-3 py-1 rounded"
          >
            Update
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </li>

      {showUpdateModal && (
        <UpdateEventModal
          event={event}
          onClose={() => setShowUpdateModal(false)}
        />
      )}
    </>
  );
};

export default EventRow;
