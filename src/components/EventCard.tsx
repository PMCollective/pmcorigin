import { Calendar, User, Tag } from "lucide-react";

const EventCard = ({
  event,
  onRegister,
}: {
  event: any;
  onRegister: () => void;
}) => {
  return (
    <div className="bg-white shadow-md hover:shadow-xl transition-all border border-blue-100 rounded-xl p-5 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold text-blue-700 mb-2">{event.title}</h2>
        <p className="text-gray-600 text-sm mb-4">{event.description}</p>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span>{new Date(event.dateTime).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-blue-500" />
            <span>{event.host}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-blue-500" />
            <span>{event.tags?.join(", ")}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onRegister}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition"
      >
        Register Now
      </button>
    </div>
  );
};

export default EventCard;
