import React from "react";
import AttendanceList from "@/components/AttendanceList/AttendanceList";

function AdminPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <AttendanceList />
    </div>
  );
}

export default AdminPage;
