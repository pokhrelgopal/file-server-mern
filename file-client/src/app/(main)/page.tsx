import { getMe } from "@/utils/auth";
import HeroSection from "./_components/HeroSection";

export default async function Home() {
  const user = await getMe();
  console.log(user);
  return (
    <>
      <HeroSection user={user} />
    </>
  );
}
