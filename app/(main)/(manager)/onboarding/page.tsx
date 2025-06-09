"use client";
import OnboardingForm from "@/features/onboarding/OnboardingForm";
import { withRole } from "@/lib/withRole";
import React from "react";

const Onboarding = () => {
  return (
    <div className="p-5 mt-5">
      <OnboardingForm />
    </div>
  );
};

export default withRole(Onboarding, ["IT Manager"]);
