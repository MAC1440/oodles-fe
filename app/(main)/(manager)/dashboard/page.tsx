"use client";
import ITDashboard from "@/features/dashboard/ITDashboard";
import { withRole } from "@/lib/withRole";
import React from "react";

const Dashboard = () => {
  return (
    <>
      <head>
        <title>Dashboard </title>
      </head>
      <ITDashboard />
    </>
  );
};

export default withRole(Dashboard, ["IT Manager"]);
