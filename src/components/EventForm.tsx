import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";

const EventForm = () => {
  const createEvent = useMutation(api.events.createEvent);

  const [form, setForm] = useState({
    title: "",
    description: "",
    dateTime: "",
    host: "",
    tags: "",
    published: true,
    gmeetLink: "",
    
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  if (!name) return; // Ignore fields without a name
  setForm((prev) => ({ ...prev, [name]: value }));
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEvent({
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()),
      
    });
    alert("Event Created!");
    setForm({ title: "", description: "", dateTime: "", host: "", tags: "", published: true , gmeetLink: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="title" placeholder="Event Title" value={form.title} onChange={handleChange} required className="w-full border p-2" />
      <textarea name="description" placeholder="Short Description" value={form.description} onChange={handleChange} required className="w-full border p-2" />
      <input name="dateTime" type="datetime-local" value={form.dateTime} onChange={handleChange} required className="w-full border p-2" />
      <input name="host" placeholder="Host Name" value={form.host} onChange={handleChange} required className="w-full border p-2" />
      <input name="tags" placeholder="Comma-separated tags" value={form.tags} onChange={handleChange} className="w-full border p-2" />
      <input name="gmeetLink" placeholder="Link" value={form.gmeetLink} onChange={handleChange} className="w-full border p-2" />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create Event</button>
    </form>
  );
};

export default EventForm;
