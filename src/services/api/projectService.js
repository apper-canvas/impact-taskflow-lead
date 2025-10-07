import projectsData from "@/services/mockData/projects.json";

let projects = [...projectsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const projectService = {
  async getAll() {
    await delay(300);
    return [...projects];
  },

  async getById(id) {
    await delay(200);
    const project = projects.find(p => p.Id === parseInt(id));
    if (!project) {
      throw new Error("Project not found");
    }
    return { ...project };
  },

  async create(project) {
    await delay(300);
    const maxId = projects.length > 0 ? Math.max(...projects.map(p => p.Id)) : 0;
    const newProject = {
      ...project,
      Id: maxId + 1,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    projects.push(newProject);
    return { ...newProject };
  },

  async update(id, data) {
    await delay(300);
    const index = projects.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Project not found");
    }
    projects[index] = {
      ...projects[index],
      ...data,
      Id: projects[index].Id,
      createdAt: projects[index].createdAt,
      updatedAt: Date.now()
    };
    return { ...projects[index] };
  },

  async delete(id) {
    await delay(300);
    const index = projects.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Project not found");
    }
    projects.splice(index, 1);
    return true;
  }
};

export default projectService;