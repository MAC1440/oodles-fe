import Modal from "@/components/Modal";
import Table, { Column } from "@/components/Table";
import { useGetUsersQuery } from "@/redux/services/users/usersApi";
import React, { useState } from "react";
import OnboardingForm from "../onboarding/OnboardingForm";
import { Employee } from "./types";

//column settings for table , Header column name , accessor with its values
const columns: Column<Employee>[] = [
  { header: "Name", accessor: "name" },
  { header: "Role", accessor: "role" },
  {
    header: "Location",
    accessor: "location",
  },
  {
    header: "Device",
    render: (row) => row.assignedDevice.model,
  },
];

const EmployeesTable = () => {
  const [isOpen, setIsOpen] = useState(false);
//api call for all employees
  const { data, isLoading, isFetching } = useGetUsersQuery({});
  return (
    <div className="p-3">
      <div className="w-full flex justify-end pe-5">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded cursor-pointer transition"
        >
          + Onboard
        </button>
      </div>
      {/* Modal for onboarding new employees */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Onboarding"
      >
        <OnboardingForm setIsOpen={() => setIsOpen(false)} />
      </Modal>
      {isLoading || isFetching ? (
        "Loading ..."
      ) : (
        <Table<Employee> columns={columns} data={data?.employees} />
      )}
    </div>
  );
};

export default EmployeesTable;
