import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const EXPERIENCE_LEVELS = ["0-3", "3-6", "6-9", "9+"];
const PREPAREDNESS_LEVELS = ["Initial", "Beginner", "Intermediate", "Advanced"];

export default function ProfileSetup() {
  const { user } = useUser();
  const navigate = useNavigate();
  const createUser = useMutation(api.users.createUser);
  const updateUser = useMutation(api.users.updateUser);
  const currentUser = useQuery(api.users.getCurrentUser, 
    user ? { clerkId: user.id } : "skip"
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    linkedinUrl: "",
    experienceLevel: "",
    preparednessLevel: "",
    phoneNumber: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        linkedinUrl: currentUser.linkedinUrl,
        experienceLevel: currentUser.experienceLevel,
        preparednessLevel: currentUser.preparednessLevel,
        phoneNumber: currentUser.phoneNumber,
      });
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      if (currentUser) {
        await updateUser({
          clerkId: user.id,
          ...formData,
        });
        toast.success("Profile updated successfully!");
      } else {
        await createUser({
          clerkId: user.id,
          ...formData,
        });
        toast.success("Profile created successfully!");
      }
      navigate("/");
    } catch (error) {
      toast.error("Failed to save profile. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 lg:p-8">
        <div className="flex items-center mb-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {currentUser ? "Update Profile" : "Complete Your Profile"}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn Profile URL *
            </label>
            <input
              type="url"
              id="linkedinUrl"
              name="linkedinUrl"
              required
              placeholder="https://linkedin.com/in/yourprofile"
              value={formData.linkedinUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level (Years) *
            </label>
            <select
              id="experienceLevel"
              name="experienceLevel"
              required
              value={formData.experienceLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select experience level</option>
              {EXPERIENCE_LEVELS.map(level => (
                <option key={level} value={level}>{level} years</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="preparednessLevel" className="block text-sm font-medium text-gray-700 mb-2">
              Preparedness Level *
            </label>
            <select
              id="preparednessLevel"
              name="preparednessLevel"
              required
              value={formData.preparednessLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select preparedness level</option>
              {PREPAREDNESS_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              required
              placeholder="+1 (555) 123-4567"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-600 mt-1">
              Your phone number will remain confidential and will only be visible to your matched buddy.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : currentUser ? "Update Profile" : "Complete Setup"}
          </button>
        </form>
      </div>
    </div>
  );
}
