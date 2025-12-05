import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

interface MaxWidthWrapperProps extends PropsWithChildren {
  className?: string;
}

export function MaxWidthWrapper({ className, children }: MaxWidthWrapperProps) {
  return (
    <div className={cn("h-full mx-auto max-w-screen-xl md:px-20", className)}>
      {children}
    </div>
  );
}
