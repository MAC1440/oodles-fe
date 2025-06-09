// "use client";
// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useGetDevicesQuery } from "@/redux/services/devices/devicesApi";
// import {
//   useAddUserMutation,
//   useGetUsersQuery,
// } from "@/redux/services/users/usersApi";
// import { DEVICE } from "./types";

// const schema = yup.object().shape({
//   name: yup.string().required("Name is required"),
//   role: yup
//     .string()
//     .oneOf(["Developer", "Designer", "Sales", "Marketing"])
//     .required(),
//   location: yup.string().oneOf(["UK", "Ireland", "EU"]).required(),
//   assignedDevice: yup.string().required("Please select or confirm a device"),
// });

// const roles = ["Developer", "Designer", "Sales", "Marketing"];
// const locations = ["UK", "Ireland", "EU"];

// export default function OnboardingForm({
//   setIsOpen,
// }: {
//   setIsOpen: (state: boolean) => void;
// }) {
//   const [recommendedDevice, setRecommendedDevice] = useState<DEVICE[] | null>(
//     null
//   );
//   // const [tab, setTab] = useState<string>("available");
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//     reset,
//   } = useForm({
//     resolver: yupResolver(schema),
//   });

//   const selectedRole = watch("role");
//   const selectedLocation = watch("location");

//   const { data } = useGetDevicesQuery({ status: "available" });
//   const employees = useGetUsersQuery({});
//   const [addEmployee, addEmployeeStatus] = useAddUserMutation();

//   useEffect(() => {
//     if (selectedRole && selectedLocation) {
//       const filtered = data?.devices.filter((device: DEVICE) => {
//         // Must be available and match location
//         const isAvailable = device.status === "available";
//         const matchesLocation =
//           device.availableLocations.includes(selectedLocation);

//         if (!isAvailable || !matchesLocation) return false;

//         // Role-based requirements
//         switch (selectedRole) {
//           case "Developer":
//             return device.ram >= 16;
//           case "Designer":
//             return device.screenSize >= 15;
//           case "Marketing":
//             return device.ram >= 8 && device.screenSize >= 13;
//           case "Sales":
//             return true; // Assumed : Only needs to be available in location
//           default:
//             return false;
//         }
//       });

//       if (filtered && filtered.length > 0) {
//         setRecommendedDevice(filtered);
//         setValue("assignedDevice", filtered[0].id); // Auto-set first recommended
//       } else {
//         setRecommendedDevice([]); // no match
//         setValue("assignedDevice", ""); // reset
//       }
//     }
//   }, [selectedRole, selectedLocation, data, setValue]);

//   const onSubmit = (data: any) => {
//     // POST API here
//     addEmployee(data)
//       .unwrap()
//       .then(() => {
//         reset();
//         setRecommendedDevice([]);
//         setIsOpen(false);
//       })
//       .catch((err) => {
//         console.log(err?.data?.error);
//       });
//   };
//   return (
//     <>
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="space-y-4 p-4 max-w-lg"
//       >
//         <div>
//           <label>Name</label>
//           <input {...register("name")} className="input" />
//           <p className="text-red-500 text-xs">{errors.name?.message}</p>
//         </div>

//         <div>
//           <label>Role</label>
//           <select {...register("role")} className="input">
//             <option value="">Select Role</option>
//             {roles.map((role) => (
//               <option key={role} value={role}>
//                 {role}
//               </option>
//             ))}
//           </select>
//           <p className="text-red-500 text-xs">{errors.role?.message}</p>
//         </div>

//         <div>
//           <label>Location</label>
//           <select {...register("location")} className="input">
//             <option value="">Select Location</option>
//             {locations.map((loc) => (
//               <option key={loc} value={loc}>
//                 {loc}
//               </option>
//             ))}
//           </select>
//           <p className="text-red-500 text-xs">{errors.location?.message}</p>
//         </div>

//         <div>
//           <label>Recommended Device</label>
//           <select
//             {...register("assignedDevice")}
//             className="input"
//             disabled={!!!recommendedDevice?.length}
//           >
//             {/* {data?.devices?.length ? (
//               data?.devices?.map((device: DEVICE) => ( */}
//             {recommendedDevice?.length ? (
//               recommendedDevice?.map((device: DEVICE) => (
//                 <option key={device.id} value={device.id}>
//                   {device.model}
//                 </option>
//               ))
//             ) : (
//               <option value="">No devices Available</option>
//             )}
//           </select>
//           <p className="text-red-500 text-xs">
//             {errors.assignedDevice?.message}
//           </p>
//           {Boolean(recommendedDevice?.length) && (
//             <p className="text-sm text-green-500">
//               Recommended: {recommendedDevice?.[0]?.model}
//             </p>
//           )}
//         </div>

//         <p className="text-xs text-red-600">
//           {addEmployeeStatus.isError
//             ? (addEmployeeStatus.error as { data: { error: string } })?.data
//                 ?.error
//             : ""}
//         </p>
//         <button
//           type="submit"
//           className={`${
//             addEmployeeStatus.isError
//               ? "bg-amber-600 hover:bg-amber-700"
//               : "bg-amber-600 hover:bg-emerald-700"
//           } text-white px-4 py-2 rounded cursor-pointer w-full`}
//           disabled={addEmployeeStatus.isLoading}
//         >
//           {addEmployeeStatus.isLoading
//             ? "Submitting ..."
//             : addEmployeeStatus.isError
//             ? "Try Again"
//             : "Submit"}
//         </button>
//       </form>
//       {/* devices cards  */}
//       {/* <div className="flex gap-2 flex-wrap">
//         <div className="w-full">
//           <button
//             onClick={() => {
//               setTab("recommended");
//             }}
//             className={`${
//               tab !== "recommended" ? "bg-gray-600" : "bg-emerald-900"
//             } text-white px-4 py-2 rounded cursor-pointer hover:bg-emerald-700`}
//           >
//             Recommended Devices
//           </button>{" "}
//           <button
//             onClick={() => {
//               setTab("available");
//             }}
//             className={`${
//               tab !== "available" ? "bg-gray-600" : "bg-emerald-900"
//             } text-white px-4 py-2 rounded cursor-pointer hover:bg-emerald-700`}
//           >
//             All Available Devices
//           </button>
//         </div>
//         {tab === "recommended" &&
//           recommendedDevice?.map((device: DEVICE) => (
//             <div
//               key={device.id}
//               className="bg-emerald-700 p-3 rounded rounded-3"
//             >
//               <p className="text-xl text-center">{device.model}</p>
//               <p className="text">{device.ram}GB Ram</p>
//               <p className="text">{device.screenSize}" Screen</p>
//             </div>
//           ))}
//         {tab === "available" &&
//           data?.devices?.map((device: DEVICE) => (
//             <div
//               key={device.id}
//               className="bg-emerald-700 p-3 rounded rounded-3"
//             >
//               <p className="text-xl text-center">{device.model}</p>
//               <p className="text">{device.ram}GB Ram</p>
//               <p className="text">{device.screenSize}" Screen</p>
//             </div>
//           ))}
//       </div> */}
//     </>
//   );
// }
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 max-w-lg"
    >
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
        <p className="text-red-500 text-xs">
          {errors.assignedDevice?.message}
        </p>
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
