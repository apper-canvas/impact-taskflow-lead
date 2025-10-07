import { cn } from "@/utils/cn";

const FormField = ({ label, error, required, children, className }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;