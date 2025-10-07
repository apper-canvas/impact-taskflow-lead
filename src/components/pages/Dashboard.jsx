import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ProjectCard from "@/components/organisms/ProjectCard";
import CreateProjectModal from "@/components/organisms/CreateProjectModal";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import projectService from "@/services/api/projectService";
import taskService from "@/services/api/taskService";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectsData, tasksData] = await Promise.all([
        projectService.getAll(),
        taskService.getAll()
      ]);
      setProjects(projectsData);
      setTasks(tasksData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!deletingProject) return;
    
    try {
      await taskService.deleteByProjectId(deletingProject.Id);
      await projectService.delete(deletingProject.Id);
      toast.success("Project deleted successfully!");
      loadData();
    } catch (error) {
      toast.error("Failed to delete project");
    } finally {
      setDeletingProject(null);
    }
  };

  if (loading) return <Loading type="projects" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (projects.length === 0) {
    return (
      <Empty
        icon="FolderOpen"
        title="No projects yet"
        message="Create your first project to start organizing tasks"
        actionLabel="Create Project"
        onAction={() => setShowCreateModal(true)}
      />
    );
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const inProgressTasks = tasks.filter(t => t.status === "in_progress").length;
  const todoTasks = tasks.filter(t => t.status === "todo").length;

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-600">Overview of all your projects and tasks</p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowCreateModal(true)}
          >
            <ApperIcon name="Plus" size={20} />
            New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <ApperIcon name="FolderOpen" size={24} />
              <span className="text-3xl font-bold">{projects.length}</span>
            </div>
            <p className="text-sm font-medium opacity-90">Total Projects</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-slate-700 to-slate-600 text-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <ApperIcon name="Circle" size={24} />
              <span className="text-3xl font-bold">{todoTasks}</span>
            </div>
            <p className="text-sm font-medium opacity-90">To Do</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-warning to-warning/80 text-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <ApperIcon name="Clock" size={24} />
              <span className="text-3xl font-bold">{inProgressTasks}</span>
            </div>
            <p className="text-sm font-medium opacity-90">In Progress</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-success to-success/80 text-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <ApperIcon name="CheckCircle2" size={24} />
              <span className="text-3xl font-bold">{completedTasks}</span>
            </div>
            <p className="text-sm font-medium opacity-90">Completed</p>
          </motion.div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">All Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProjectCard
                project={project}
                tasks={tasks}
                onEdit={(proj) => {
                  setEditingProject(proj);
                  setShowCreateModal(true);
                }}
                onDelete={(proj) => setDeletingProject(proj)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {showCreateModal && (
        <CreateProjectModal
          project={editingProject}
          onClose={() => {
            setShowCreateModal(false);
            setEditingProject(null);
          }}
        />
      )}

      <ConfirmDialog
        isOpen={!!deletingProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${deletingProject?.name}"? This will also delete all tasks in this project.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteProject}
        onCancel={() => setDeletingProject(null)}
      />
    </div>
  );
};

export default Dashboard;