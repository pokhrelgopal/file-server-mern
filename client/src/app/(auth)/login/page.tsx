import Login from "@/app/(auth)/login/_components/LoginPage";
import Loader from "@/components/ui/loader";
import { Suspense } from "react";

export default async function LoginPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Login />
    </Suspense>
  );
}
