import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Otp from "./Otp";
import Label from "@/components/ui/label";
import Input from "@/components/ui/input";
import FormErrorMessage from "@/components/ui/form-message";
import Button from "@/components/ui/button";
import { toast } from "sonner";
import { useLoginMutation } from "@/libs/features/userApi";

interface FormErrors {
  email?: string;
  password?: string;
}

interface ErrorResponse {
  status: number;
  data: {
    error: string;
  };
}

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loginUser] = useLoginMutation();
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await loginUser({ email, password }).unwrap();
      if (response.status === 200) {
        router.push("/dashboard");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      const err = error as ErrorResponse;
      if (err.status === 401) {
        setShowOTP(true);
      } else if (err.status === 400) {
        toast.error(err.data.error);
      } else {
        toast.error("Something went wrong !");
      }
    } finally {
      setLoading(false);
    }
  };

  if (showOTP) {
    return <Otp />;
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-subtitle mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email" className="text-subtitle text-b1">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className={`h-11 px-3 ${
              errors.email ? "border-red-500" : "border-gray-300 text-b1"
            }`}
          />
          {errors.email && <FormErrorMessage message={errors.email} />}
        </div>

        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password" className="text-subtitle">
            Password
          </Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className={`h-11 px-3 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "Hide" : "Show"}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </button>
          </div>
          {errors.password && <FormErrorMessage message={errors.password} />}
        </div>

        <Button
          loading={loading}
          type="submit"
          size="lg"
          variant="primary"
          className="w-full bg-accent-700 hover:opacity-90 h-11 mt-2"
        >
          Login
        </Button>

        <Link
          href="/register?step=1"
          className="text-accent-700 hover:opacity-90 text-sm text-center block mt-4"
        >
          Don&apos;t have an account? Sign up
        </Link>
      </form>
    </div>
  );
};

export default LoginForm;
