import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import StatusSelector from "@/components/molecules/StatusSelector";
import PrioritySelector from "@/components/molecules/PrioritySelector";
import taskService from "@/services/api/taskService";

const CreateTaskModal = ({ onClose, projects, task, defaultProjectId }) => {
  const [formData, setFormData] = useState({
    projectId: task?.projectId || defaultProjectId || (projects[0]?.Id || ""),
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "todo",
    priority: task?.priority || "medium",
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.projectId) {
      newErrors.projectId = "Please select a project";
    }
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const taskData = {
        ...formData,
        projectId: parseInt(formData.projectId),
        dueDate: formData.dueDate ? new Date(formData.dueDate).getTime() : null
      };

      if (task) {
        await taskService.update(task.Id, taskData);
        toast.success("Task updated successfully!");
      } else {
        await taskService.create(taskData);
        toast.success("Task created successfully!");
      }
      window.location.reload();
    } catch (error) {
      toast.error("Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {task ? "Edit Task" : "Create New Task"}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {task ? "Update task details" : "Add a new task to your project"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" size={20} className="text-slate-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <FormField label="Project" required error={errors.projectId}>
              <Select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.Id} value={project.Id}>
                    {project.name}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Task Title" required error={errors.title}>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter task title"
              />
            </FormField>

            <FormField label="Description">
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add task details"
              />
            </FormField>

            <FormField label="Status" required>
              <StatusSelector
                value={formData.status}
                onChange={(status) => setFormData({ ...formData, status })}
              />
            </FormField>

            <FormField label="Priority" required>
              <PrioritySelector
                value={formData.priority}
                onChange={(priority) => setFormData({ ...formData, priority })}
              />
            </FormField>

            <FormField label="Due Date">
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </FormField>

            <div className="flex items-center gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Check" size={18} />
                    {task ? "Update" : "Create"} Task
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateTaskModal;