"use client";

import { Reports } from "../../Reports";
import { TravelDataProvider } from "@/hooks/useTravel";

export default function Page() {
  return (
    <TravelDataProvider>
      <Reports />
    </TravelDataProvider>
  );
}
