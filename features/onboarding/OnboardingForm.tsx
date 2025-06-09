"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGetDevicesQuery } from "@/redux/services/devices/devicesApi";
import {
  useAddUserMutation,
  useGetUsersQuery,
} from "@/redux/services/users/usersApi";
import { DEVICE } from "./types";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  role: yup
    .string()
    .oneOf(["Developer", "Designer", "Sales", "Marketing"])
    .required(),
  location: yup.string().oneOf(["UK", "Ireland", "EU"]).required(),
  assignedDevice: yup.string().required("Please select or confirm a device"),
});

const roles = ["Developer", "Designer", "Sales", "Marketing"];
const locations = ["UK", "Ireland", "EU"];

export default function OnboardingForm({
  setIsOpen,
}: {
  setIsOpen: (state: boolean) => void;
}) {
  const [recommendedDevice, setRecommendedDevice] = useState<DEVICE[]>([]);
  const [apiError, setApiError] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const selectedRole = watch("role");
  const selectedLocation = watch("location");

  const { data: deviceData } = useGetDevicesQuery({ status: "available" });
  const [addEmployee, addEmployeeStatus] = useAddUserMutation();

  // Clear API error when user changes any input
  useEffect(() => {
    setApiError("");
  }, [selectedRole, selectedLocation, watch("name"), watch("assignedDevice")]);

  // Filter recommended devices
  useEffect(() => {
    if (selectedRole && selectedLocation && deviceData?.devices?.length) {
      const filtered = deviceData.devices.filter((device: DEVICE) => {
        if (device.status !== "available") return false;
        if (!device.availableLocations.includes(selectedLocation)) return false;

        switch (selectedRole) {
          case "Developer":
            return device.ram >= 16;
          case "Designer":
            return device.screenSize >= 15;
          case "Marketing":
            return device.ram >= 8 && device.screenSize >= 13;
          case "Sales":
            return true;
          default:
            return false;
        }
      });

      setRecommendedDevice(filtered);
      setValue("assignedDevice", filtered[0]?.id || "");
    }
  }, [selectedRole, selectedLocation, deviceData, setValue]);

  const onSubmit = (data: any) => {
    addEmployee(data)
      .unwrap()
      .then(() => {
        reset();
        setRecommendedDevice([]);
        setApiError("");
        setIsOpen(false);
      })
      .catch((err) => {
        const errorMsg =
          err?.data?.error || "Something went wrong. Please try again.";
        setApiError(errorMsg);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 max-w-lg">
      <div>
        <label>Name</label>
        <input {...register("name")} className="input" />
        <p className="text-red-500 text-xs">{errors.name?.message}</p>
      </div>

      <div>
        <label>Role</label>
        <select {...register("role")} className="input">
          <option value="">Select Role</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <p className="text-red-500 text-xs">{errors.role?.message}</p>
      </div>

      <div>
        <label>Location</label>
        <select {...register("location")} className="input">
          <option value="">Select Location</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        <p className="text-red-500 text-xs">{errors.location?.message}</p>
      </div>

      <div>
        <label>Recommended Device</label>
        <select
          {...register("assignedDevice")}
          className="input"
          disabled={!recommendedDevice.length}
        >
          {recommendedDevice.length > 0 ? (
            recommendedDevice.map((device: DEVICE) => (
              <option key={device.id} value={device.id}>
                {device.model}
              </option>
            ))
          ) : (
            <option value="">No devices available</option>
          )}
        </select>
        <p className="text-red-500 text-xs">{errors.assignedDevice?.message}</p>
        {recommendedDevice.length > 0 && (
          <p className="text-sm text-green-500">
            Recommended: {recommendedDevice[0].model}
          </p>
        )}
      </div>

      {/* API error */}
      {apiError && <p className="text-xs text-red-600">{apiError}</p>}

      <button
        type="submit"
        className={`${
          apiError
            ? "bg-amber-600 hover:bg-amber-700"
            : "bg-emerald-600 hover:bg-emerald-700"
        } text-white px-4 py-2 rounded cursor-pointer w-full`}
        disabled={addEmployeeStatus.isLoading}
      >
        {addEmployeeStatus.isLoading
          ? "Submitting..."
          : apiError
          ? "Try Again"
          : "Submit"}
      </button>
    </form>
  );
}
