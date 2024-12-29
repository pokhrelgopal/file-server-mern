"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import FormErrorMessage from "@/components/ui/form-message";

export default function EmailForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Invalid email address");
      return;
    }
    setError("");
    router.push(`/register?step=2&email=${encodeURIComponent(email)}`);
  };

  return (
    <form onSubmit={handleNext} className="space-y-4">
      <h2 className="text-2xl font-bold">Enter your email</h2>
      <div>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
        />
        {error && <FormErrorMessage message={error} />}
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="w-full">
          Next
        </Button>
      </div>
    </form>
  );
}
