"use client";
import EmployeesTable from "@/features/employees/EmployeesTable";
import { withRole } from "@/lib/withRole";
import React from "react";

const Employees = () => {
  return (
    <>
      <head>
        <title>Employees </title>
      </head>
      <section>
        <EmployeesTable />
      </section>
    </>
  );
};

export default withRole(Employees, ["IT Manager"]);
