import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ProgressRing from "@/components/molecules/ProgressRing";

const ProjectCard = ({ project, tasks, onEdit, onDelete }) => {
  const navigate = useNavigate();
  
  const projectTasks = tasks.filter(t => t.projectId === project.Id);
  const completedTasks = projectTasks.filter(t => t.status === "completed").length;
  const totalTasks = projectTasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const todoCount = projectTasks.filter(t => t.status === "todo").length;
  const inProgressCount = projectTasks.filter(t => t.status === "in_progress").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, shadow: "0 12px 24px rgba(0,0,0,0.15)" }}
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 cursor-pointer transition-all duration-200"
      onClick={() => navigate(`/project/${project.Id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <h3 className="text-lg font-bold text-slate-900">{project.name}</h3>
          </div>
          <p className="text-sm text-slate-600 line-clamp-2">
            {project.description}
          </p>
        </div>
        <ProgressRing progress={progress} size={64} strokeWidth={6} color={project.color} />
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-slate-400 rounded-full" />
          <span className="text-sm text-slate-600">
            <span className="font-semibold">{todoCount}</span> To Do
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full" />
          <span className="text-sm text-slate-600">
            <span className="font-semibold">{inProgressCount}</span> In Progress
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full" />
          <span className="text-sm text-slate-600">
            <span className="font-semibold">{completedTasks}</span> Done
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(project);
          }}
          className="flex-1"
        >
          <ApperIcon name="Edit2" size={16} />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(project);
          }}
          className="flex-1 text-error hover:bg-error/5"
        >
          <ApperIcon name="Trash2" size={16} />
          Delete
        </Button>
      </div>
    </motion.div>
  );
};

export default ProjectCard;