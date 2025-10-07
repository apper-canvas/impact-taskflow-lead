import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import CreateTaskModal from "@/components/organisms/CreateTaskModal";
import CreateProjectModal from "@/components/organisms/CreateProjectModal";

const Header = ({ onToggleSidebar, projects }) => {
  const navigate = useNavigate();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ApperIcon name="Menu" size={24} className="text-slate-600" />
          </button>
          <div 
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
              <ApperIcon name="CheckSquare" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <p className="text-xs text-slate-500">Project Management</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => setShowProjectModal(true)}
            className="hidden sm:flex"
          >
            <ApperIcon name="FolderPlus" size={18} />
            New Project
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowTaskModal(true)}
          >
            <ApperIcon name="Plus" size={18} />
            <span className="hidden sm:inline">New Task</span>
          </Button>
        </div>
      </header>

      {showTaskModal && (
        <CreateTaskModal
          projects={projects}
          onClose={() => setShowTaskModal(false)}
        />
      )}

      {showProjectModal && (
        <CreateProjectModal
          onClose={() => setShowProjectModal(false)}
        />
      )}
    </>
  );
};

export default Header;