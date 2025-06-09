// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
// import { useGetDevicesQuery } from "@/redux/services/devices/devicesApi";
// import { useGetUsersQuery } from "@/redux/services/users/usersApi";
// import { useRouter } from "next/navigation";
// import { subMonths } from "date-fns";
// import { Employee } from "../employees/types";
// import { Device } from "../devices/types";

// const COLORS = ["#34D399", "#F59E0B"]; // green for available, amber for assigned

// const ITDashboard = () => {
//   const router = useRouter();

//   const { data: devicesData, isLoading: devicesLoading } = useGetDevicesQuery(
//     {}
//   );
//   const { data: usersData, isLoading: usersLoading } = useGetUsersQuery({});

//   const devices = devicesData?.devices || [];
//   const employees = usersData?.employees || [];

//   // DEVICE STATS
//   const available = devices.filter(
//     (d: Device) => d.status === "available"
//   ).length;
//   const assigned = devices.length - available;

//   const devicePieData = [
//     { name: "Available", value: available },
//     { name: "Assigned", value: assigned },
//   ];

//   // EMPLOYEE STATS
//   const lastMonth = subMonths(new Date(), 1);
//   const employeesLastMonth = employees.filter((emp: Employee) => {
//     const joinedDate = new Date(emp.createdAt);
//     return joinedDate >= lastMonth;
//   }).length;

//   const employeePieData = [
//     { name: "Joined Last Month", value: employeesLastMonth },
//     { name: "Others", value: employees.length - employeesLastMonth },
//   ];

//   return (
//     <div className="p-6 space-y-6">
//       {/* CHART CARDS */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Devices Card */}
//         <div className="bg-white rounded-xl shadow-md p-5">
//           <h2 className="text-lg font-semibold mb-3">Devices Overview</h2>
//           {devicesLoading ? (
//             "Loading..."
//           ) : (
//             <ResponsiveContainer width="100%" height={250}>
//               <PieChart>
//                 <Pie
//                   data={devicePieData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={90}
//                   fill="#8884d8"
//                   paddingAngle={2}
//                   dataKey="value"
//                 >
//                   {devicePieData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           )}
//         </div>

//         {/* Employees Card */}
//         <div className="bg-white rounded-xl shadow-md p-5">
//           <h2 className="text-lg font-semibold mb-3">Employee Growth</h2>
//           {usersLoading ? (
//             "Loading..."
//           ) : (
//             <ResponsiveContainer width="100%" height={250}>
//               <PieChart>
//                 <Pie
//                   data={employeePieData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={90}
//                   fill="#82ca9d"
//                   paddingAngle={2}
//                   dataKey="value"
//                 >
//                   <Cell fill="#3B82F6" /> {/* Blue for new */}
//                   <Cell fill="#A5B4FC" /> {/* Light blue for old */}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           )}
//         </div>
//       </div>

//       {/* EMPLOYEE ACTION SECTION */}
//       <div
//         className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-6 rounded-xl cursor-pointer transition"
//         onClick={() => router.push("/employees")}
//       >
//         <h3 className="text-xl font-semibold">Onboard an Employee</h3>
//         <p className="text-sm">Click here to view or onboard a new employee</p>
//       </div>
//     </div>
//   );
// };

// export default ITDashboard;
"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useGetDevicesQuery } from "@/redux/services/devices/devicesApi";
import { useGetUsersQuery } from "@/redux/services/users/usersApi";
import { useRouter } from "next/navigation";
import { subDays, subWeeks, subMonths, format } from "date-fns";
import { useMemo, useState } from "react";
import { Employee } from "../employees/types";
import { Device } from "../devices/types";

const COLORS = ["#34D399", "#F59E0B"];

const ITDashboard = () => {
  const router = useRouter();
  const [employeeView, setEmployeeView] = useState<"daily" | "weekly" | "monthly">("monthly");

  const { data: devicesData, isLoading: devicesLoading } = useGetDevicesQuery({});
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery({});

  const devices = devicesData?.devices || [];
  const employees = usersData?.employees || [];

  // DEVICE STATS
  const available = devices.filter((d: Device) => d.status === "available").length;
  const assigned = devices.length - available;

  const devicePieData = [
    { name: "Available", value: available },
    { name: "Assigned", value: assigned },
  ];

  // EMPLOYEE GROUPED DATA BY VIEW
  const employeeBarData = useMemo(() => {
    const group: Record<string, number> = {};
    const now = new Date();

    employees.forEach((emp: Employee) => {
      const joinedDate = new Date(emp.createdAt);

      let key = "";
      if (employeeView === "daily") {
        key = format(joinedDate, "dd MMM");
      } else if (employeeView === "weekly") {
        const weekStart = format(subDays(joinedDate, joinedDate.getDay()), "dd MMM");
        key = `Week of ${weekStart}`;
      } else if (employeeView === "monthly") {
        key = format(joinedDate, "MMM yyyy");
      }

      if (group[key]) {
        group[key] += 1;
      } else {
        group[key] = 1;
      }
    });

    return Object.entries(group)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  }, [employees, employeeView]);

  const recentCutoff = {
    daily: subDays(new Date(), 1),
    weekly: subWeeks(new Date(), 1),
    monthly: subMonths(new Date(), 1),
  }[employeeView];

  const recentEmployeesCount = employees.filter(
    (emp: Employee) => new Date(emp.createdAt) >= recentCutoff
  ).length;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Devices Card */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <h2 className="text-lg font-semibold mb-3">Devices Overview</h2>
          {devicesLoading ? (
            "Loading..."
          ) : (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={devicePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {devicePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              {/* Summary below donut */}
              <div className="mt-4 space-y-1 text-sm text-gray-700">
                <p>Total Devices: {devices.length}</p>
                <p>Available: {available}</p>
                <p>Assigned: {assigned}</p>
              </div>
            </>
          )}
        </div>

        {/* Employees Card */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Employee Growth</h2>
            {/* View Toggle */}
            <div className="space-x-2">
              {["daily", "weekly", "monthly"].map((v) => (
                <button
                  key={v}
                  onClick={() => setEmployeeView(v as typeof employeeView)}
                  className={`px-3 py-1 text-xs rounded cursor-pointer hover:bg-emerald-700 hover:text-white ${
                    employeeView === v
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {usersLoading ? (
            "Loading..."
          ) : (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={employeeBarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-1 text-sm text-gray-700">
                <p>Total Employees: {employees.length}</p>
                <p>New {employeeView.charAt(0).toUpperCase() + employeeView.slice(1)}: {recentEmployeesCount}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* EMPLOYEE ACTION SECTION */}
      <div
        className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-6 rounded-xl cursor-pointer transition"
        onClick={() => router.push("/employees")}
      >
        <h3 className="text-xl font-semibold">Onboard an Employee</h3>
        <p className="text-sm">Click here to view or onboard a new employee</p>
      </div>
    </div>
  );
};

export default ITDashboard;
