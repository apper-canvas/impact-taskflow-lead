import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import projectService from "@/services/api/projectService";
import taskService from "@/services/api/taskService";
import opportunityService from "@/services/api/opportunityService";
import quoteService from "@/services/api/quoteService";
const Layout = () => {
const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [tasks, setTasks] = useState([]);
useEffect(() => {
    loadProjects();
    loadTasks();
    loadOpportunities();
    loadQuotes();
  }, []);

  const loadOpportunities = async () => {
    try {
      const data = await opportunityService.getAll();
      setOpportunities(data);
    } catch (error) {
      console.error("Error loading opportunities:", error);
      setOpportunities([]);
    }
  };

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

  const loadQuotes = async () => {
    try {
      const data = await quoteService.getAll();
      setQuotes(data || []);
    } catch (error) {
      console.error("Error loading quotes:", error);
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
          opportunities={opportunities}
          quotes={quotes}
        />
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;