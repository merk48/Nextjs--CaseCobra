import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

interface MaxWidthWrapperProps extends PropsWithChildren {
  className?: string;
}

export const MaxWidthWrapper = ({
  className,
  children,
}: MaxWidthWrapperProps) => {
  return (
    <div
      className={cn(
        "h-full mx-auto w-full max-w-screen-xl px-2.5 md:px-20",
        className
      )}
    >
      {children}
    </div>
  );
};
