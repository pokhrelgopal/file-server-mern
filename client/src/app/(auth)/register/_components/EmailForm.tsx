"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import FormErrorMessage from "@/components/ui/form-message";

// Zod schema for email validation
const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type EmailFormData = z.infer<typeof emailSchema>;

export default function EmailForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleNext = (data: EmailFormData) => {
    router.push(`/register?step=2&email=${data.email}`);
  };

  return (
    <form onSubmit={handleSubmit(handleNext)} className="space-y-4">
      <h2 className="text-2xl font-bold">Enter your email</h2>
      <div>
        <Input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="w-full"
        />
        {errors.email && <FormErrorMessage message={errors.email.message} />}
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="w-full">
          Next
        </Button>
      </div>
    </form>
  );
}
