import { Calendar, User, Tag } from "lucide-react";

const EventCard = ({
  event,
  isUpcoming,
  onRegister,
}: {
  event: any;
  isUpcoming: boolean;
  onRegister: () => void;
}) => {
  return (
    <div className={`shadow-md hover:shadow-xl transition-all border rounded-xl p-5 flex flex-col justify-between ${
      isUpcoming 
        ? 'bg-white border-blue-100' 
        : 'bg-gray-50 border-gray-200 opacity-80'
    }`}>
      <div>
        <h2 className={`text-xl font-bold mb-2 ${
          isUpcoming ? 'text-purple-700' : 'text-gray-600'
        }`}>
          {event.title}
          {!isUpcoming && <span className="ml-2 text-sm font-normal text-gray-500">(Past Event)</span>}
        </h2>
        <p className="text-gray-600 text-sm mb-4">{event.description}</p>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className={`h-4 w-4 ${
              isUpcoming ? 'text-purple-500' : 'text-gray-400'
            }`} />
            <span>{new Date(event.dateTime).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className={`h-4 w-4 ${
              isUpcoming ? 'text-purple-500' : 'text-gray-400'
            }`} />
            <span>{event.host}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className={`h-4 w-4 ${
              isUpcoming ? 'text-purple-500' : 'text-gray-400'
            }`} />
            <span>{event.tags?.join(", ")}</span>
          </div>
        </div>
      </div>

      {isUpcoming && (
        <button
          onClick={onRegister}
          className="mt-6 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-semibold transition"
        >
          Register Now
        </button>
      )}
    </div>
  );
};

export default EventCard;
