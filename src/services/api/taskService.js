import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  },

  async getByProjectId(projectId) {
    await delay(300);
    return tasks.filter(t => t.projectId === parseInt(projectId)).map(t => ({ ...t }));
  },

  async create(task) {
    await delay(300);
    const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.Id)) : 0;
    const newTask = {
      ...task,
      Id: maxId + 1,
      createdAt: Date.now(),
      completedAt: null
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, data) {
    await delay(300);
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    const updatedTask = {
      ...tasks[index],
      ...data,
      Id: tasks[index].Id,
      createdAt: tasks[index].createdAt
    };

    if (data.status === "completed" && tasks[index].status !== "completed") {
      updatedTask.completedAt = Date.now();
    } else if (data.status !== "completed") {
      updatedTask.completedAt = null;
    }

    tasks[index] = updatedTask;
    return { ...tasks[index] };
  },

  async delete(id) {
    await delay(300);
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    tasks.splice(index, 1);
    return true;
  },

  async deleteByProjectId(projectId) {
    await delay(300);
    tasks = tasks.filter(t => t.projectId !== parseInt(projectId));
    return true;
  }
};

export default taskService;