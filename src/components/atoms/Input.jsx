import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "w-full px-4 py-2.5 text-base text-slate-900 bg-white border border-slate-300 rounded-lg transition-all duration-200",
          "placeholder:text-slate-400",
          "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;