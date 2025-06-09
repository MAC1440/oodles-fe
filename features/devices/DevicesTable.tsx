import { Column } from "@/components/Table";
import ClickTooltip from "@/components/Tooltip";
import React, { useCallback, useState } from "react";
import { Device } from "./types";
import { useGetDevicesQuery } from "@/redux/services/devices/devicesApi";
import SearchFilter from "@/components/SearchFilter";
import Table from "@/components/Table";
import { Settings } from "lucide-react";
import Modal from "@/components/Modal";
import AddDeviceForm from "./AddDeviceForm";

//column settings for table , Header column name , accessor with its values
const columns: Column<Device>[] = [
  { header: "Model", accessor: "model" },
  { header: "Processor", accessor: "processor" },
  {
    header: "Ram",
    accessor: "ram",
  },
  {
    header: "Locations Available",
    render: (row) => row.availableLocations.join(", "),
  },
  {
    header: "Status",
    render: (row) =>
      row.status === "available" ? (
        <p className="text-emerald-500  text-center">Available</p>
      ) : (
        <div className="flex justify-center items-center gap-2 ">
          <div className="h-full text-amber-600 text-xs">In Use</div>
          {/* tooltip whenever device is assigned */}
          <ClickTooltip
            content={
              <div>
                <p>
                  <span className="font-bold mx-2">Name:</span>
                  {row?.user?.name || "-"}
                </p>
                <p>
                  <span className="font-bold mx-2"> Role:</span>

                  {row?.user?.role || "-"}
                </p>
                <p>
                  <span className="font-bold mx-2">Location:</span>
                  {row?.user?.location || "-"}
                </p>
              </div>
            }
          >
            <div className="flex gap-2 items-center">
              <Settings size={12} />
            </div>
          </ClickTooltip>
        </div>
      ),
  },
];
const DevicesTable = () => {
  const [searchParams, setSearchParams] = useState<Record<string, string>>({});

  // Memoized callback for onSearch to avoid re-creating on each render
  const handleSearch = useCallback((params: Record<string, string>) => {
    // Remove empty params
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== "" && v !== undefined)
    );
    setSearchParams(filteredParams);
  }, []);

  // api call for devices
  const { data, isLoading, isFetching } = useGetDevicesQuery(searchParams);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-3">
      <div className="py-4 px-5">
        <SearchFilter onSearch={handleSearch} />
      </div>
      <div className="w-full flex justify-end pe-5">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded cursor-pointer transition"
        >
          + Add Device
        </button>
      </div>

      {isLoading || isFetching ? (
        "Loading ..."
      ) : (
        <>
          <Table<Device> columns={columns} data={data?.devices} />
        </>
      )}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Onboarding"
      >
        <AddDeviceForm setIsOpen={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
};

export default DevicesTable;
