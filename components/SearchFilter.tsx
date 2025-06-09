"use client";
import React, { useState, useEffect, useMemo } from "react";

interface SearchFilterProps {
  onSearch: (params: Record<string, string>) => void;
  initialParams?: Record<string, string>;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  initialParams = {},
}) => {
  const [params, setParams] = useState<Record<string, string>>(initialParams);
  const [debouncedParams, setDebouncedParams] = useState(params);

  // Debounce effect: update debouncedParams 500ms after params stop changing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedParams(params);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [params]);

  // Call onSearch when debouncedParams changes
  useEffect(() => {
    onSearch(debouncedParams);
  }, [debouncedParams, onSearch]);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      "checked" in e.target ? (e.target as HTMLInputElement).checked : false;
    setParams((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "true" : "") : value,
    }));
  };
  // Clear filters
  const handleClear = () => {
    setParams({});
  };

  // Detect if any filter is active
  const hasActiveFilters = useMemo(() => {
    return Object.entries(params).some(([_, val]) => val !== "");
  }, [params]);
  return (
    <div className="flex flex-wrap gap-4 items-end text-emerald-900">
      {/* Role */}
      <div>
        <div>Role</div>
        <select
          name="role"
          value={params.role || ""}
          onChange={handleChange}
          className="border p-2 rounded caret-emerald-700"
        >
          <option value="">All Roles</option>
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Sales</option>
        </select>
      </div>
      {/* Location */}
      <div>
        <div> Location</div>

        <select
          name="location"
          value={params.location || ""}
          onChange={handleChange}
          className="border p-2 rounded  caret-emerald-700"
        >
          <option value="">All Locations</option>
          <option value="UK">UK</option>
          <option value="Ireland">Ireland</option>
          <option value="EU">EU</option>
        </select>
      </div>
      {/* Status */}
      <div>
        <div>Status </div>

        <select
          name="status"
          value={params.status || ""}
          onChange={handleChange}
          className="border p-2 rounded  caret-emerald-700"
        >
          <option value="">Any Status</option>
          <option value="available">Available</option>
          <option value="in use">In Use</option>
        </select>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={handleClear}
          className="ml-auto bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default SearchFilter;
