import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import { Users, MessageCircle, UserPlus, Settings } from "lucide-react";

export default function Dashboard() {
  const { user } = useUser();
  const currentUser = useQuery(api.users.getCurrentUser, 
    user ? { clerkId: user.id } : "skip"
  );

  const incomingRequests = useQuery(api.buddyRequests.getIncomingRequests,
    user ? { clerkId: user.id } : "skip"
  );

  const acceptedBuddies = useQuery(api.buddyRequests.getAcceptedBuddies,
    user ? { clerkId: user.id } : "skip"
  );

  if (!user) return null;

  // If user hasn't completed profile setup, redirect them
  if (currentUser === null) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Buddy Finder!</h2>
        <p className="text-gray-600 mb-6">Let's set up your profile to find the perfect practice buddy.</p>
        <Link
          to="/profile-setup"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          Complete Profile Setup
        </Link>
      </div>
    );
  }

  if (currentUser === undefined) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {currentUser.name}!
        </h2>
        <p className="text-gray-600">
          Experience: {currentUser.experienceLevel} years • 
          Preparedness: {currentUser.preparednessLevel}
        </p>
      </div>
      

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Link
          to="/discover"
          className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            <div className="ml-3 sm:ml-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Discover Buddies</h3>
              <p className="text-xs sm:text-sm text-gray-600">Find practice partners</p>
            </div>
          </div>
        </Link>

        <Link
          to="/requests"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <UserPlus className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Requests</h3>
              <p className="text-sm text-gray-600">
                {incomingRequests?.length || 0} pending
              </p>
            </div>
          </div>
        </Link>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <MessageCircle className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Active Buddies</h3>
              <p className="text-sm text-gray-600">
                {acceptedBuddies?.length || 0} connected
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/profile-setup"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <Settings className="h-8 w-8 text-gray-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
              <p className="text-sm text-gray-600">Update settings</p>
            </div>
          </div>
        </Link>
      </div>

      {acceptedBuddies && acceptedBuddies.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Your Practice Buddies</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {acceptedBuddies.map((buddy) => (
              <div key={buddy._id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{buddy.buddy?.name}</h4>
                  <p className="text-sm text-gray-600">
                    {buddy.buddy?.experienceLevel} years • {buddy.buddy?.preparednessLevel}
                  </p>
                  
                </div>
                <Link
                  to={`/chat/${buddy._id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Chat
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
