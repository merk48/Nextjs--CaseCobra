"use client";

import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClinet = new QueryClient({
  defaultOptions: {
    mutations: {},
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <KindeProvider>
      <QueryClientProvider client={queryClinet}>{children}</QueryClientProvider>
    </KindeProvider>
  );
}
