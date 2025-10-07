import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low", icon: "ArrowDown", color: "bg-slate-100 text-slate-600" },
  { value: "medium", label: "Medium", icon: "Minus", color: "bg-warning/10 text-warning" },
  { value: "high", label: "High", icon: "ArrowUp", color: "bg-error/10 text-error" },
  { value: "urgent", label: "Urgent", icon: "AlertCircle", color: "bg-gradient-to-r from-error to-error/80 text-white" }
];

const PrioritySelector = ({ value, onChange, className }) => {
  return (
    <div className={cn("flex gap-2", className)}>
      {PRIORITY_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
            value === option.value
              ? option.color + " scale-105 shadow-md"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          )}
        >
          <ApperIcon name={option.icon} size={16} />
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default PrioritySelector;