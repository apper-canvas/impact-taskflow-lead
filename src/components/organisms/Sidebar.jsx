import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose, projects, tasks }) => {
  const getProjectTaskCount = (projectId) => {
    return tasks.filter(t => t.project_id_c?.Id === projectId && t.status_c !== "completed").length;
  };
const navItems = [
    { to: "/", icon: "LayoutDashboard", label: "Dashboard" },
    { to: "/pipeline", icon: "TrendingUp", label: "Sales Pipeline" },
    { to: "/quotes", icon: "FileQuote", label: "Quotes" },
    { to: "/completed", icon: "CheckCircle2", label: "Completed" }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Navigation</h2>
        <p className="text-sm text-slate-500">Manage your projects</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              )
            }
          >
            {({ isActive }) => (
              <>
                <ApperIcon name={item.icon} size={20} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-2 h-2 bg-white rounded-full"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}

        <div className="pt-6 mt-6 border-t border-slate-200">
          <h3 className="px-4 mb-3 text-sm font-bold text-slate-900">Projects</h3>
          <div className="space-y-1">
            {projects.map((project) => {
              const taskCount = getProjectTaskCount(project.Id);
              return (
                <NavLink
                  key={project.Id}
                  to={`/project/${project.Id}`}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                      isActive
                        ? "bg-slate-100"
                        : "hover:bg-slate-50"
                    )
                  }
                >
<div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: project.color_c }}
                  />
                  <span className="flex-1 text-sm font-medium text-slate-700 truncate">
                    {project.name_c}
                  </span>
                  {taskCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold text-slate-600 bg-slate-200 rounded-full">
                      {taskCount}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-[calc(100vh-4rem)] border-r border-slate-200 bg-white sticky top-16">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-64 z-50 shadow-2xl"
            >
              <div className="h-full flex flex-col bg-white">
                <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200">
                  <h2 className="text-lg font-bold text-slate-900">Menu</h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" size={20} className="text-slate-600" />
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <SidebarContent />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;