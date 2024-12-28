import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Otp from "./Otp";
import Label from "@/components/ui/label";
import Input from "@/components/ui/input";
import FormErrorMessage from "@/components/ui/form-message";
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { loginUser } from "@/utils/auth";

const LoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showOTP, setShowOTP] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const response = await loginUser(data.email, data.password);
      if (response.status === 401) {
        setShowOTP(true);
      } else if (response.status === 200) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!showOTP ? (
        <div>
          <div className="w-full">
            <h2 className="text-2xl font-semibold text-subtitle mb-6">Login</h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col space-y-4"
            >
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email" className="text-subtitle text-b1">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  {...register("email")}
                  placeholder="Enter email"
                  className={`h-11 px-3 ${
                    errors.email ? "border-red-500" : "border-gray-300 text-b1"
                  }`}
                />
                {errors.email && (
                  <FormErrorMessage message={errors.email.message} />
                )}
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password" className="text-subtitle">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    {...register("password")}
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
                {errors.password && (
                  <FormErrorMessage message={errors.password.message} />
                )}
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
                Don't have an account? Sign up
              </Link>
            </form>
          </div>
        </div>
      ) : (
        <>
          <Otp />
        </>
      )}
    </>
  );
};

export default LoginForm;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
