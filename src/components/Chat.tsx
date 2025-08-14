import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useParams, Link } from "react-router-dom";
import { Send, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function Chat() {
  const { requestId } = useParams<{ requestId: string }>();
  const { user } = useUser();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = useQuery(api.messages.getMessages,
    user && requestId ? {
      clerkId: user.id,
      requestId: requestId as any,
    } : "skip"
  );

  const sendMessage = useMutation(api.messages.sendMessage);
  const [isSending, setIsSending] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !requestId || !message.trim()) return;

    setIsSending(true);
    try {
      await sendMessage({
        senderClerkId: user.id,
        requestId: requestId as any,
        content: message.trim(),
      });
      setMessage("");
    } catch (error: any) {
      toast.error(error.message || "FPMled to send message");
    } finally {
      setIsSending(false);
    }
  };

  if (!user || !requestId) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow h-[600px] flex flex-col">
        <div className="border-b border-gray-200 p-4 flex items-center">
          <Link
            to="/requests"
            className="text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h2 className="text-lg font-semibold text-gray-900">Chat with Buddy</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages?.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${msg.isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.isCurrentUser
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className={`text-xs mt-1 ${
                  msg.isCurrentUser ? "text-blue-100" : "text-gray-500"
                }`}>
                  {msg.senderName} • {new Date(msg._creationTime).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={isSending || !message.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
