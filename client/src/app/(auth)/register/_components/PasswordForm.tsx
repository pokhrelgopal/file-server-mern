"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import FormErrorMessage from "@/components/ui/form-message";
import { useSignupMutation } from "@/libs/features/userSlice";

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must not exceed 20 characters"),
});

type PasswordFormData = z.infer<typeof passwordSchema>;

type PasswordFormProps = {
  setShowOtp: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PasswordForm({ setShowOtp }: PasswordFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [registerUser] = useSignupMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  const handleBack = () => {
    router.push(`/register?step=1`);
  };

  const handleFormSubmit = async (data: PasswordFormData) => {
    if (!email) {
      console.error("Email not found.");
      return;
    }
    try {
      setLoading(true);
      const response = await registerUser({
        email,
        password: data.password,
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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <h2 className="text-2xl font-bold">Create a password</h2>
      <div>
        <Input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="w-full"
        />
        {errors.password && (
          <FormErrorMessage message={errors.password.message} />
        )}
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
