import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import projectService from "@/services/api/projectService";
import taskService from "@/services/api/taskService";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadProjects();
    loadTasks();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  const loadTasks = async () => {
    try {
      const data = await taskService.getAll();
      setTasks(data);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        projects={projects}
      />
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          projects={projects}
          tasks={tasks}
        />
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;