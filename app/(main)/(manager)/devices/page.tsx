"use client";
import { withRole } from "@/lib/withRole";
import React from "react";
import DevicesTable from "@/features/devices/DevicesTable";

const Devices = () => {
  return (
    <>
      <head>
        <title>Devices </title>
      </head>
      <DevicesTable />
    </>
  );
};

export default withRole(Devices, ["IT Manager"]);
