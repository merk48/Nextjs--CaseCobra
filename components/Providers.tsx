"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClinet = new QueryClient({
  defaultOptions: {
    mutations: {},
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClinet}>{children}</QueryClientProvider>
  );
}
