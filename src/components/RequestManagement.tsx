import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation , useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Check, X, ExternalLink, MessageCircle, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";


export default function RequestManagement() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<"incoming" | "sent" | "accepted">("incoming");

  const incomingRequests = useQuery(api.buddyRequests.getIncomingRequests,
    user ? { clerkId: user.id } : "skip"
  );

  const sentRequests = useQuery(api.buddyRequests.getSentRequests,
    user ? { clerkId: user.id } : "skip"
  );

  const acceptedBuddies = useQuery(api.buddyRequests.getAcceptedBuddies,
    user ? { clerkId: user.id } : "skip"
  );

  const respondToBuddyRequest = useMutation(api.buddyRequests.respondToBuddyRequest);
  const withdrawBuddyRequest = useMutation(api.buddyRequests.withdrawBuddyRequest);
  const sendemail = useAction(api.buddyRequests.sendemail);

  const [processingRequest, setProcessingRequest] = useState<string | null>(null);

  const handleRespond = async (requestId: string, response: "accepted" | "rejected") => {
  setProcessingRequest(requestId);

  const request = incomingRequests?.find(r => r._id === requestId);
    

  try {
    await respondToBuddyRequest({
      requestId: requestId as any,
      response,
  
    });
    

    // Find the request object to get sender's email and name
    


    if (response === "accepted" && request?.sender?.email) {
      await sendemail({
        to: request.sender.email,
        subject: "Your buddy request was accepted!",
        text: `Hi ${request.sender.name},

Great news! ${user?.fullName || user?.username || "your buddy"} has accepted your buddy request.

You can now connect and start your journey together. Feel free to reach out and say hello!

Best wishes,
The PM Collective Team`,
      });
    }

    toast.success(`Request ${response}!`);
  } catch (error: any) {
    toast.error(error.message || "FPMled to respond to request");
  } finally {
    setProcessingRequest(null);
  }
};

  const handleWithdraw = async (requestId: string) => {
    if (!user) return;
    
    setProcessingRequest(requestId);
    try {
      await withdrawBuddyRequest({
        requestId: requestId as any,
        senderClerkId: user.id,
      });
      toast.success("Request withdrawn!");
    } catch (error: any) {
      toast.error(error.message || "FPMled to withdraw request");
    } finally {
      setProcessingRequest(null);
    }
  };

  if (!user) return null;

  const tabs = [
    { id: "incoming", label: "Incoming Requests", count: incomingRequests?.length || 0 },
    { id: "sent", label: "Sent Requests", count: sentRequests?.length || 0 },
    { id: "accepted", label: "Connected Buddies", count: acceptedBuddies?.length || 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center mb-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-800 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Manage Requests</h2>
          </div>
          <nav className="-mb-px flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 sm:py-4 sm:px-6 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === "incoming" && (
            <div className="space-y-4">
              {incomingRequests?.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No incoming requests</p>
              ) : (
                incomingRequests?.map((request) => (
                  <div key={request._id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">{request.sender?.name}</h3>
                            <p className="text-sm text-gray-600">
                              {request.sender?.experienceLevel} years • {request.sender?.preparednessLevel}
                            </p>
                          </div>
                          <a
                            href={request.sender?.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                        {request.message && (
                          <p className="text-sm text-gray-700 mt-2">{request.message}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleRespond(request._id, "accepted")}
                          disabled={processingRequest === request._id}
                          className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRespond(request._id, "rejected")}
                          disabled={processingRequest === request._id}
                          className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "sent" && (
            <div className="space-y-4">
              {sentRequests?.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No sent requests</p>
              ) : (
                sentRequests?.map((request) => (
                  <div key={request._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">{request.receiver?.name}</h3>
                            <p className="text-sm text-gray-600">
                              {request.receiver?.experienceLevel} years • {request.receiver?.preparednessLevel}
                            </p>
                          </div>
                          <a
                            href={request.receiver?.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                        <div className="mt-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            request.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                            request.status === "accepted" ? "bg-green-100 text-green-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      {request.status === "pending" && (
                        <button
                          onClick={() => handleWithdraw(request._id)}
                          disabled={processingRequest === request._id}
                          className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "accepted" && (
            <div className="space-y-4">
              {acceptedBuddies?.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No connected buddies yet</p>
              ) : (
                acceptedBuddies?.map((buddy) => (
                  <div key={buddy._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">{buddy.buddy?.name}</h3>
                            <p className="text-sm text-gray-600">
                              {buddy.buddy?.experienceLevel} years • {buddy.buddy?.preparednessLevel}
                            </p>
                           
                          </div>
                          <a
                            href={buddy.buddy?.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                      <Link
                        to={`/chat/${buddy._id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
