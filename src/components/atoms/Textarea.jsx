import React from "react";
import { cn } from "@/utils/cn";

const Textarea = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full px-4 py-2.5 text-base text-slate-900 bg-white border border-slate-300 rounded-lg transition-all duration-200 resize-vertical min-h-[100px]",
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

Textarea.displayName = "Textarea";

export default Textarea;