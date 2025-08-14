import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

interface UpdateEventModalProps {
  event: Doc<"events">;
  onClose: () => void;
}

const UpdateEventModal = ({ event, onClose }: UpdateEventModalProps) => {
  const updateEvent = useMutation(api.events.updateEvent);

  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [dateTime, setDateTime] = useState(event.dateTime);
  const [host, setHost] = useState(event.host);
  const [gmeetLink, setGmeetLink] = useState(event.gmeetLink);
  const [published, setPublished] = useState(event.published);
  const [tagsString, setTagsString] = useState(event.tags.join(", "));

  const handleSubmit = async () => {
    try {
      await updateEvent({
        id: event._id,
        title,
        description,
        dateTime,
        host,
        gmeetLink,
        published,
        tags: tagsString.split(",").map(tag => tag.trim()),
      });

      onClose();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update event.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[450px]">
        <h2 className="text-xl font-bold mb-4">Update Event</h2>

        <input
          className="w-full border p-2 mb-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-2"
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-2"
          placeholder="Host"
          value={host}
          onChange={(e) => setHost(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-2"
          placeholder="GMeet Link"
          value={gmeetLink}
          onChange={(e) => setGmeetLink(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-2"
          placeholder="Tags (comma separated)"
          value={tagsString}
          onChange={(e) => setTagsString(e.target.value)}
        />

        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="mr-2"
          />
          Published
        </label>

        <div className="flex justify-end">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
            onClick={handleSubmit}
          >
            Save
          </button>
          <button className="text-gray-600" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateEventModal;
