"use client";
import { withRole } from "@/lib/withRole";
import React from "react";

const EmployeeDashboard = () => {
  return <div>EmployeeDashboard</div>;
};

export default withRole(EmployeeDashboard, ["Employee"]);
