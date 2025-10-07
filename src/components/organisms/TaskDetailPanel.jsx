import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import CreateTaskModal from "@/components/organisms/CreateTaskModal";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import taskService from "@/services/api/taskService";

const TaskDetailPanel = ({ task, project, projects, onClose, onUpdate, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    setDeleting(true);
    try {
      await taskService.delete(task.Id);
      toast.success("Task deleted successfully!");
      onDelete();
      onClose();
    } catch (error) {
      toast.error("Failed to delete task");
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
await taskService.update(task.Id, { status: newStatus, status_c: newStatus });
      toast.success("Task status updated!");
      onUpdate();
    } catch (error) {
      toast.error("Failed to update task status");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 lg:flex lg:items-start lg:justify-end">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative bg-white w-full lg:w-[500px] h-full shadow-2xl overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-lg font-bold text-slate-900">Task Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" size={20} className="text-slate-600" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-4 h-4 rounded-full"
style={{ backgroundColor: project?.color_c }}
                />
                <div>
                  <div className="text-xs text-slate-500 mb-1">Project</div>
                  <div className="font-semibold text-slate-900">{project?.name_c}</div>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-3">
<h1 className="text-2xl font-bold text-slate-900 mb-3">
                {task.title_c}
              </h1>
              <p className="text-slate-600 leading-relaxed">
                {task.description_c}
              </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Status
                </label>
<div className="flex gap-2">
                  {["todo", "in_progress", "completed"].map((status) => {
                    const statusLabels = {
                      todo: "To Do",
                      in_progress: "In Progress",
                      completed: "Completed"
                    };
                    return (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          task.status_c === status
                            ? "bg-primary text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {statusLabels[status]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Priority
                </label>
<Badge variant={task.priority_c} className="text-sm px-4 py-2">
                  {task.priority_c}
                </Badge>
              </div>

              {task.due_date_c && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Due Date
                  </label>
<div className="flex items-center gap-2 text-slate-600">
                    <ApperIcon name="Calendar" size={18} />
                    <span>{format(new Date(task.due_date_c), "MMMM d, yyyy")}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Created
                </label>
                <div className="flex items-center gap-2 text-slate-600">
                  <ApperIcon name="Clock" size={18} />
                  <span>{format(new Date(task.created_at_c), "MMM d, yyyy 'at' h:mm a")}</span>
                </div>
              </div>
{task.completed_at_c && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Completed
                  </label>
                  <div className="flex items-center gap-2 text-success">
                    <ApperIcon name="CheckCircle2" size={18} />
                    <span>{format(new Date(task.completed_at_c), "MMM d, yyyy 'at' h:mm a")}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 space-y-3 border-t border-slate-200">
              <Button
                variant="primary"
                onClick={() => setShowEditModal(true)}
                className="w-full"
              >
                <ApperIcon name="Edit2" size={18} />
                Edit Task
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={deleting}
                className="w-full"
              >
                {deleting ? (
                  <>
                    <ApperIcon name="Loader2" size={18} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Trash2" size={18} />
                    Delete Task
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {showEditModal && (
        <CreateTaskModal
          task={task}
          projects={projects}
          onClose={() => {
            setShowEditModal(false);
            onUpdate();
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default TaskDetailPanel;