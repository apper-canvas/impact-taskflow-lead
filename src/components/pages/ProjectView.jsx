import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Dashboard from "@/components/pages/Dashboard";
import TaskDetailPanel from "@/components/organisms/TaskDetailPanel";
import TaskCard from "@/components/organisms/TaskCard";
import CreateTaskModal from "@/components/organisms/CreateTaskModal";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import taskService from "@/services/api/taskService";
import projectService from "@/services/api/projectService";

const ProjectView = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectData, projectsData, tasksData] = await Promise.all([
        projectService.getById(projectId),
        projectService.getAll(),
        taskService.getByProjectId(projectId)
      ]);
      setProject(projectData);
      setProjects(projectsData);
      setTasks(tasksData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
try {
      await taskService.update(task.Id, { status: newStatus, status_c: newStatus });
      toast.success("Task status updated!");
      loadData();
    } catch (error) {
      toast.error("Failed to update task status");
    }
  };

  if (loading) return <Loading type="tasks" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!project) {
    return (
      <Error
        message="Project not found"
        onRetry={() => navigate("/")}
      />
    );
  }

  const filteredTasks = tasks.filter(task => {
if (filterStatus !== "all" && task.status_c !== filterStatus) return false;
    if (filterPriority !== "all" && task.priority_c !== filterPriority) return false;
    return true;
return true;
  });

  const todoTasks = filteredTasks.filter(t => t.status_c === "todo");
  const inProgressTasks = filteredTasks.filter(t => t.status_c === "in_progress");
  const completedTasks = filteredTasks.filter(t => t.status_c === "completed");
  return (
    <div className="p-6">
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ApperIcon name="ArrowLeft" size={16} />
          Back to Dashboard
        </Button>

        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-lg flex-shrink-0 shadow-lg"
style={{ backgroundColor: project.color_c }}
            />
<div>
              <h1 className="text-2xl font-bold text-slate-900">{project.name_c}</h1>
              <p className="text-sm text-slate-600 mt-1">{project.description_c}</p>
            </div>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowCreateModal(true)}
          >
            <ApperIcon name="Plus" size={20} />
            New Task
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">To Do</p>
                <p className="text-2xl font-bold text-slate-900">{todoTasks.length}</p>
              </div>
              <ApperIcon name="Circle" size={32} className="text-slate-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">In Progress</p>
                <p className="text-2xl font-bold text-slate-900">{inProgressTasks.length}</p>
              </div>
              <ApperIcon name="Clock" size={32} className="text-primary" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-slate-900">{completedTasks.length}</p>
              </div>
              <ApperIcon name="CheckCircle2" size={32} className="text-success" />
            </div>
          </motion.div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-slate-700">Status:</label>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-40"
            >
              <option value="all">All</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-slate-700">Priority:</label>
            <Select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-40"
            >
              <option value="all">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </Select>
          </div>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <Empty
          icon="CheckSquare"
          title="No tasks found"
          message="Create your first task to get started"
          actionLabel="Create Task"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.Id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <TaskCard
                task={task}
                project={project}
                onClick={() => setSelectedTask(task)}
                onStatusChange={handleStatusChange}
              />
            </motion.div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateTaskModal
          projects={projects}
          defaultProjectId={parseInt(projectId)}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          project={project}
          projects={projects}
          onClose={() => setSelectedTask(null)}
          onUpdate={loadData}
          onDelete={loadData}
        />
      )}
    </div>
  );
};

export default ProjectView;