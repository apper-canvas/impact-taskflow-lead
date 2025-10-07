import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-slate-100 text-slate-700",
      primary: "bg-primary/10 text-primary",
      success: "bg-success/10 text-success",
      warning: "bg-warning/10 text-warning",
      error: "bg-error/10 text-error",
      todo: "bg-slate-100 text-slate-700",
      in_progress: "bg-primary/10 text-primary",
      completed: "bg-success/10 text-success",
      low: "bg-slate-100 text-slate-600",
      medium: "bg-warning/10 text-warning",
      high: "bg-error/10 text-error",
      urgent: "bg-gradient-to-r from-error to-error/80 text-white shadow-sm"
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;