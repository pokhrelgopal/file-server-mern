"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/utils/tw-merge";
import Image from "next/image";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useOtpVerifyMutation } from "@/libs/features/userApi";
import { useRouter } from "next/navigation";

const Otp = () => {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyOtp] = useOtpVerifyMutation();
  const router = useRouter();
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const focusInput = (index: number) => {
    if (inputs.current[index]) {
      inputs.current[index]?.focus();
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      focusInput(index - 1);
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    } else if (e.key === "ArrowRight" && index < 5) {
      focusInput(index + 1);
    }
  };

  const handleVerify = useCallback(async () => {
    if (code.join("").length !== 6) return;
    setIsVerifying(true);
    try {
      const email = localStorage?.getItem("email");
      if (!email) {
        console.error("Email not found in local storage");
        return;
      }
      const response = await verifyOtp({ otp: code.join(""), email }).unwrap();
      if (response.status === 200) {
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
      alert("Verification failed");
    } finally {
      setIsVerifying(false);
    }
  }, [code, verifyOtp, router]);

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleVerify();
    }
  }, [code, handleVerify]);

  useEffect(() => {
    focusInput(0);
  }, []);

  return (
    <div className="mx-auto ">
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-12 rounded-full flex items-center justify-center mb-4">
          <Image src="/icons/lock.svg" alt="Lock" width={50} height={50} />
        </div>
        <h2 className="text-h4 font-semibold mb-2">
          Two-Factor Authentication
        </h2>
        <p className="text-sm text-gray-500 text-center">
          Enter the six-digit code sent to your email
        </p>
      </div>
      <div className="flex justify-center gap-2 mb-6">
        {code.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => {
              inputs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={isVerifying}
            className={cn(
              "w-12 h-12 text-center text-lg",
              "focus:ring-2 focus:ring-accent-700 focus:border-accent-700"
            )}
          />
        ))}
      </div>
      <Button
        onClick={handleVerify}
        disabled={code.join("").length !== 6 || isVerifying}
        loading={isVerifying}
        className={cn(
          "w-full py-2 px-4 rounded-md",
          "bg-accent-700 text-white font-medium",
          "hover:opacity-90 transition-colors",
          "focus:outline-none focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {isVerifying ? "Verifying..." : "Verify"}
      </Button>
      <div className="text-center mt-4">
        <p className="text-b2 text-accent-700 hover:text-gray-700">
          Having trouble getting code?
        </p>
      </div>
    </div>
  );
};

export default Otp;
