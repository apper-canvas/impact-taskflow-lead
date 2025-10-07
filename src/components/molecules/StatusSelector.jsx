import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const STATUS_OPTIONS = [
  { value: "todo", label: "To Do", icon: "Circle", color: "text-slate-500" },
  { value: "in_progress", label: "In Progress", icon: "Clock", color: "text-primary" },
  { value: "completed", label: "Completed", icon: "CheckCircle2", color: "text-success" }
];

const StatusSelector = ({ value, onChange, className }) => {
  return (
    <div className={cn("flex gap-2", className)}>
      {STATUS_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
            value === option.value
              ? "bg-primary text-white shadow-md scale-105"
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

export default StatusSelector;