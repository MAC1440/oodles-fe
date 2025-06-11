"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAddDeviceMutation } from "@/redux/services/devices/devicesApi";

const schema = yup.object().shape({
  model: yup.string().required("Model is required"),
  screenSize: yup
    .number()
    .typeError("Screen size must be a number")
    .positive("Screen size must be positive")
    .required("Screen size is required"),
  processor: yup.string().required("Processor is required"),
  ram: yup
    .number()
    .typeError("RAM must be a number")
    .positive("RAM must be positive")
    .required("RAM is required"),
  availableLocations: yup
    .array()
    .typeError("Select at least one location")
    .of(yup.string().oneOf(["UK", "Ireland", "EU"]))
    .min(1, "Select at least one location"),
});

const locations = ["UK", "Ireland", "EU"];

export default function AddDeviceForm({
  setIsOpen,
}: {
  setIsOpen: (state: boolean) => void;
}) {
  const [apiError, setApiError] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [addDevice, addDeviceStatus] = useAddDeviceMutation();

  const onSubmit = (data: any) => {
    addDevice(data)
      .unwrap()
      .then(() => {
        reset();
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
        <label>Model</label>
        <input {...register("model")} className="input" />
        <p className="text-red-500 text-xs">{errors.model?.message}</p>
      </div>

      <div>
        <label>Screen Size (inches)</label>
        <input type="text" {...register("screenSize")} className="input" />
        <p className="text-red-500 text-xs">{errors.screenSize?.message}</p>
      </div>

      <div>
        <label>Processor</label>
        <input {...register("processor")} className="input" />
        <p className="text-red-500 text-xs">{errors.processor?.message}</p>
      </div>

      <div>
        <label>RAM (GB)</label>
        <input type="text" {...register("ram")} className="input" />
        <p className="text-red-500 text-xs">{errors.ram?.message}</p>
      </div>

      <div>
        <label>Available Locations</label>
        <div className="space-x-4">
          {locations.map((loc) => (
            <label key={loc} className="inline-flex items-center space-x-1">
              <input
                type="checkbox"
                value={loc}
                {...register("availableLocations")}
              />
              <span>{loc}</span>
            </label>
          ))}
        </div>
        <p className="text-red-500 text-xs">
          {errors.availableLocations?.message}
        </p>
      </div>

      {apiError && <p className="text-xs text-red-600">{apiError}</p>}

      <button
        type="submit"
        className={`${
          apiError
            ? "bg-amber-600 hover:bg-amber-700"
            : "bg-emerald-600 hover:bg-emerald-700"
        } text-white px-4 py-2 rounded cursor-pointer w-full`}
        disabled={addDeviceStatus.isLoading}
      >
        {addDeviceStatus.isLoading
          ? "Submitting..."
          : apiError
          ? "Try Again"
          : "Add Device"}
      </button>
    </form>
  );
}
