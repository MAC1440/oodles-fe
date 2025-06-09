"use client";
import EmployeesTable from "@/features/employees/EmployeesTable";
import { withRole } from "@/lib/withRole";
import React from "react";

const Employees = () => {
  return <EmployeesTable />;
};

export default withRole(Employees, ["IT Manager"]);
