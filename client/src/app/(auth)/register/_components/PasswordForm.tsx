"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import FormErrorMessage from "@/components/ui/form-message";
import { useSignupMutation } from "@/libs/features/userApi";

type PasswordFormProps = {
  setShowOtp: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PasswordForm({ setShowOtp }: PasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [registerUser] = useSignupMutation();

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (password.length > 20) {
      return "Password must not exceed 20 characters";
    }
    return "";
  };

  const handleBack = () => {
    router.push(`/register?step=1`);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!email) {
      console.error("Email not found.");
      return;
    }
    try {
      setLoading(true);
      const response = await registerUser({
        email,
        password,
      }).unwrap();
      if (response.status == 201) {
        setShowOtp(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold">Create a password</h2>
      <div>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full"
        />
        {error && <FormErrorMessage message={error} />}
      </div>
      <div className="flex justify-between">
        <Button disabled={loading} onClick={handleBack} variant="outline">
          Back
        </Button>
        <Button loading={loading} type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
}
