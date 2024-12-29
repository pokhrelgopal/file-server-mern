import { Suspense } from "react";
import RegisterPage from "./_components/RegisterPage";
import Loader from "@/components/ui/loader";

export default async function RegisterMainPage() {
  return (
    <Suspense fallback={<Loader />}>
      <RegisterPage />
    </Suspense>
  );
}
