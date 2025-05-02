import { ReactNode } from "react";

import Link from "next/link";
import { NavMenu } from "./_components/nav-menu";

interface TripLayout {
  children: ReactNode;
}

export default function TripLayout({ children }: TripLayout) {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col">
        <div className="flex flex-row gap-10">
          <NavMenu />
          <main className="flex-1 flex justify-start m-4 p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
