// src/pages/admin/AdminDashboardPage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EventForm from "./EventForm";
import EventList from "./EventList";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      navigate("/admin-dashboard/8f4a1e2c-74db-4b91-b732-1e3e9d57ac3e/secure-panel");
    }
  }, [navigate]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <EventForm />
      <EventList />
    </div>
  );
};

export default AdminDashboard;
