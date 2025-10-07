const taskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "project_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('task_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "project_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}}
        ]
      };

      const response = await apperClient.getRecordById('task_c', id, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error("Task not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      throw new Error("Task not found");
    }
  },

  async getByProjectId(projectId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "project_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}}
        ],
        where: [
          {"FieldName": "project_id_c", "Operator": "EqualTo", "Values": [parseInt(projectId)]}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('task_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching tasks for project ${projectId}:`, error?.response?.data?.message || error);
      return [];
    }
  },

  async create(task) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const taskData = {
        Name: task.title,
        project_id_c: parseInt(task.projectId),
        title_c: task.title,
        description_c: task.description || "",
        status_c: task.status || "todo",
        priority_c: task.priority || "medium"
      };

      if (task.dueDate) {
        taskData.due_date_c = new Date(task.dueDate).toISOString();
      }

      const params = {
        records: [taskData]
      };

      const response = await apperClient.createRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed);
          throw new Error(failed[0].message || "Failed to create task");
        }

        return successful[0].data;
      }

      return null;
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateData = {
        Id: parseInt(id)
      };

      if (data.projectId !== undefined) {
        updateData.project_id_c = parseInt(data.projectId);
      }
      if (data.title !== undefined) {
        updateData.Name = data.title;
        updateData.title_c = data.title;
      }
      if (data.description !== undefined) {
        updateData.description_c = data.description;
      }
      if (data.status !== undefined) {
        updateData.status_c = data.status;
        
        if (data.status === "completed") {
          updateData.completed_at_c = new Date().toISOString();
        } else {
          updateData.completed_at_c = null;
        }
      }
      if (data.priority !== undefined) {
        updateData.priority_c = data.priority;
      }
      if (data.dueDate !== undefined) {
        updateData.due_date_c = data.dueDate ? new Date(data.dueDate).toISOString() : null;
      }

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed);
          throw new Error(failed[0].message || "Failed to update task");
        }

        return successful[0].data;
      }

      return null;
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed);
          throw new Error(failed[0].message || "Failed to delete task");
        }

        return true;
      }

      return true;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async deleteByProjectId(projectId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const fetchParams = {
        fields: [{"field": {"Name": "Id"}}],
        where: [
          {"FieldName": "project_id_c", "Operator": "EqualTo", "Values": [parseInt(projectId)]}
        ]
      };

      const fetchResponse = await apperClient.fetchRecords('task_c', fetchParams);

      if (!fetchResponse.success || !fetchResponse.data || fetchResponse.data.length === 0) {
        return true;
      }

      const taskIds = fetchResponse.data.map(t => t.Id);

      const deleteParams = {
        RecordIds: taskIds
      };

      const response = await apperClient.deleteRecord('task_c', deleteParams);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      console.error(`Error deleting tasks for project ${projectId}:`, error?.response?.data?.message || error);
      throw error;
    }
  }
};

export default taskService;