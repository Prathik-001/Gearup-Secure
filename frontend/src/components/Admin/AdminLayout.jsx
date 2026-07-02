import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="w-full h-screen bg-gray-50">
      <Outlet /> {/* ← All nested admin routes render here */}
    </div>
  );
};

export default AdminLayout;
