"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { Appstore, store } from "./store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<Appstore>(undefined);
  if (!storeRef.current) {
    storeRef.current = store;
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}
