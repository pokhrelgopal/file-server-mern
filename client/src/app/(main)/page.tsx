import { getMe } from "@/utils/auth";
import HeroSection from "./_components/HeroSection";

export default async function Home() {
  const response = await getMe();
  console.log("Response: ", response);
  return (
    <>
      <HeroSection user={response} />
    </>
  );
}
