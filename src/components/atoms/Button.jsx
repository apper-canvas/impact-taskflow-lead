import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] focus:ring-primary/50",
      secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-[1.02] active:scale-[0.98] focus:ring-slate-400",
      outline: "border-2 border-primary text-primary hover:bg-primary/5 hover:scale-[1.02] active:scale-[0.98] focus:ring-primary/50",
      danger: "bg-gradient-to-r from-error to-error/90 text-white hover:shadow-lg hover:shadow-error/25 hover:scale-[1.02] active:scale-[0.98] focus:ring-error/50",
      ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400"
    };
    
    const sizes = {
      sm: "px-3 py-1.5 text-sm h-8",
      md: "px-4 py-2 text-base h-10",
      lg: "px-6 py-3 text-lg h-12"
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;