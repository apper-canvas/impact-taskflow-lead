import { motion } from "framer-motion";
import { format } from "date-fns";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const TaskCard = ({ task, project, onClick, onStatusChange }) => {
const dueDate = task.due_date_c ? new Date(task.due_date_c).getTime() : null;
  const isOverdue = task.status_c !== "completed" && dueDate && dueDate < Date.now();
  
  const statusIcons = {
    todo: "Circle",
    in_progress: "Clock",
    completed: "CheckCircle2"
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      className={cn(
        "bg-white rounded-lg p-4 shadow-sm border-l-4 cursor-pointer transition-all duration-200 hover:shadow-md",
        isOverdue && task.status !== "completed" && "border-l-error",
        !isOverdue && "border-l-slate-300"
      )}
      style={{ borderLeftColor: !isOverdue ? project?.color : undefined }}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            const nextStatus = task.status === "todo" ? "in_progress" : task.status === "in_progress" ? "completed" : "todo";
            onStatusChange(task, nextStatus);
          }}
          className="flex-shrink-0 mt-1"
        >
          <ApperIcon
name={statusIcons[task.status_c]}
            size={20}
            className={cn(
              "transition-colors",
              task.status_c === "completed" ? "text-success" :
              task.status_c === "in_progress" ? "text-primary" :
              "text-slate-400 hover:text-slate-600"
            )}
          />
        </button>

<div className="flex-1 min-w-0">
          <h4 className={cn(
            "text-base font-semibold text-slate-900 mb-1",
            task.status_c === "completed" && "line-through text-slate-500"
          )}
          >
            {task.title_c}
          </h4>
          {task.description_c && (
            <p className="text-sm text-slate-600 line-clamp-2 mb-3">
              {task.description_c}
            </p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={task.status_c}>
              {task.status_c.replace("_", " ")}
            </Badge>
<Badge variant={task.priority_c}>
              {task.priority_c}
            </Badge>
            {task.due_date_c && (
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium",
                isOverdue ? "text-error" : "text-slate-600"
              )}>
                <ApperIcon name="Calendar" size={14} />
                {format(new Date(task.due_date_c), "MMM d, yyyy")}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;