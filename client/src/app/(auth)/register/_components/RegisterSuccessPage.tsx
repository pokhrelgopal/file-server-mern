import Button from "@/components/ui/button";
import { TickCircle } from "iconsax-react";
import Link from "next/link";
import React from "react";

const RegisterSuccess = () => {
  return (
    <div>
      <TickCircle className="size-10 stroke-success-base" />
      <h1 className="text-h4 my-4">You&apos;re all set</h1>
      <p>Your account has been successfully created.</p>
      <Link href="/login">
        <Button className="mt-6 w-full">Login to your account</Button>
      </Link>
    </div>
  );
};

export default RegisterSuccess;
