import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import TaskCard from "@/components/organisms/TaskCard";
import TaskDetailPanel from "@/components/organisms/TaskDetailPanel";
import projectService from "@/services/api/projectService";
import taskService from "@/services/api/taskService";

const CompletedView = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

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
      setTasks(tasksData.filter(t => t.status_c === "completed"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="tasks" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (tasks.length === 0) {
    return (
      <Empty
        icon="CheckCircle2"
        title="No completed tasks"
        message="Complete tasks to see them here"
      />
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-success to-success/80 rounded-lg flex items-center justify-center shadow-lg">
            <ApperIcon name="CheckCircle2" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Completed Tasks</h1>
            <p className="text-slate-600">View all your finished tasks</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-success to-success/80 text-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90 mb-1">Total Completed</p>
              <p className="text-4xl font-bold">{tasks.length}</p>
            </div>
            <ApperIcon name="Award" size={48} className="opacity-50" />
          </div>
        </motion.div>
      </div>

      <div className="space-y-3">
        {tasks.map((task, index) => {
const project = projects.find(p => p.Id === task.project_id_c?.Id);
          return (
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
                onStatusChange={() => {}}
              />
            </motion.div>
          );
        })}
      </div>

      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
project={projects.find(p => p.Id === selectedTask.project_id_c?.Id)}
          projects={projects}
          onClose={() => setSelectedTask(null)}
          onUpdate={loadData}
          onDelete={loadData}
        />
      )}
    </div>
  );
};

export default CompletedView;