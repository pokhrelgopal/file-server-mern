import { ReduxProvider } from "@/libs/ReduxProvider";
import Link from "next/link";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const AuthLayout = (props: Props) => {
  return (
    <ReduxProvider>
      <div className="h-screen w-full overflow-hidden relative flex flex-col items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-white-50 via-accent-50/70 to-blue-50/10" />

        <Link href="/">
          <h1 className="absolute top-5 left-5 text-2xl font-semibold mb-12 z-10">
            Logo <br /> Here
          </h1>
        </Link>

        <div className="relative z-10 max-h-full min-w-[420px] overflow-auto">
          {props.children}
        </div>

        <div
          className="absolute w-96 h-96 bg-blue-200/80 filter blur-[150px] rounded-full"
          style={{ right: "-5%", bottom: "-10%" }}
        />
        <div
          className="absolute w-96 h-96 bg-[rgba(198,224,247,1)] filter blur-[150px] rounded-full"
          style={{ right: "10%", bottom: "10%" }}
        />
        <div
          className="absolute w-96 h-96 bg-[rgba(244,215,232,1)] filter blur-[150px] rounded-full"
          style={{ left: "40%", bottom: "-30%" }}
        />
        <div
          className="absolute w-96 h-96 bg-[rgba(248, 226, 218, 1)] filter blur-[150px] rounded-full"
          style={{ left: "0%", bottom: "-30%" }}
        />
      </div>
    </ReduxProvider>
  );
};

export default AuthLayout;
