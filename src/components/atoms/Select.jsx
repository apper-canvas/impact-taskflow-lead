import React from "react";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "w-full px-4 py-2.5 text-base text-slate-900 bg-white border border-slate-300 rounded-lg transition-all duration-200 appearance-none cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50",
          "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMS41TDYgNi41TDExIDEuNSIgc3Ryb2tlPSIjNjQ3NDhiIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:12px_8px] bg-[position:right_1rem_center] bg-no-repeat pr-10",
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";

export default Select;