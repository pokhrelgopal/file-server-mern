"use client";
import React from "react";
import LoginForm from "./LoginForm";
import { useSearchParams } from "next/navigation";
import RegisterSuccess from "../../register/_components/RegisterSuccessPage";

export default function LoginPage() {
  const params = useSearchParams();
  const isRedirected = params.get("redirected");
  const isValidated = params.get("validated");

  const allOk = isRedirected && isValidated;
  return (
    <div className="w-fit min-w-[420px]">
      <div className="bg-form-background rounded-2xl shadow-2xs p-10">
        {!allOk ? <LoginForm /> : <RegisterSuccess />}
      </div>
    </div>
  );
}
