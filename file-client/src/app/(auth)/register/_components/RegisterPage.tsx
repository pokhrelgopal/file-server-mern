"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import EmailForm from "./EmailForm";
import PasswordForm from "./PasswordForm";
import Otp from "./Otp";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const step = searchParams.get("step");
  const [showOtp, setShowOtp] = React.useState(false);
  return (
    <div className="w-fit min-w-[420px]">
      <div className="bg-form-background rounded-2xl shadow-2xs p-10">
        {!showOtp ? (
          <>
            {step === "1" || !step ? (
              <EmailForm />
            ) : (
              <PasswordForm setShowOtp={setShowOtp} />
            )}
          </>
        ) : (
          <Otp />
        )}
      </div>
    </div>
  );
}
