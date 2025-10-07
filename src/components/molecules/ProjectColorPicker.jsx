import { cn } from "@/utils/cn";

const COLORS = [
  "#2563eb", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
];

const ProjectColorPicker = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={cn(
            "w-10 h-10 rounded-lg transition-all duration-200 hover:scale-110",
            value === color && "ring-2 ring-offset-2 ring-primary scale-110"
          )}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};

export default ProjectColorPicker;