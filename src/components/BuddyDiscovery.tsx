import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { ExternalLink, Send, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const EXPERIENCE_LEVELS = ["0-3", "3-6", "6-9", "9+"];
const PREPAREDNESS_LEVELS = ["Initial", "Beginner", "Intermediate", "Advanced"];

export default function BuddyDiscovery() {
  const { user } = useUser();
  const [filters, setFilters] = useState({
    experienceLevel: "",
    preparednessLevel: "",
  });

  const buddies = useQuery(api.users.searchBuddies, 
    user ? {
      currentUserClerkId: user.id,
      experienceLevel: filters.experienceLevel || undefined,
      preparednessLevel: filters.preparednessLevel || undefined,
    } : "skip"
  );

  const sendBuddyRequest = useMutation(api.buddyRequests.sendBuddyRequest);
  const [sendingRequest, setSendingRequest] = useState<string | null>(null);

  const handleSendRequest = async (receiverId: string) => {
    if (!user) return;

    setSendingRequest(receiverId);
    try {
      await sendBuddyRequest({
        senderClerkId: user.id,
        receiverId: receiverId as any,
      });
      toast.success("Buddy request sent!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send request");
    } finally {
      setSendingRequest(null);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center mb-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Discover Practice Buddies</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Experience Level
            </label>
            <select
              id="experienceLevel"
              name="experienceLevel"
              value={filters.experienceLevel}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All experience levels</option>
              {EXPERIENCE_LEVELS.map(level => (
                <option key={level} value={level}>{level} years</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="preparednessLevel" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Preparedness Level
            </label>
            <select
              id="preparednessLevel"
              name="preparednessLevel"
              value={filters.preparednessLevel}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All preparedness levels</option>
              {PREPAREDNESS_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {buddies?.map((buddy) => (
          <div key={buddy._id} className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{buddy.name}</h3>
                <p className="text-sm text-gray-600">
                  {buddy.experienceLevel} years experience
                </p>
                <p className="text-sm text-gray-600">
                  {buddy.preparednessLevel} preparedness
                </p>
              </div>
              <a
                href={buddy.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>

            <button
              onClick={() => handleSendRequest(buddy._id)}
              disabled={sendingRequest === buddy._id}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {sendingRequest === buddy._id ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Request Buddy
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {buddies?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No buddies found with the current filters.</p>
          <p className="text-sm text-gray-500 mt-2">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
}
