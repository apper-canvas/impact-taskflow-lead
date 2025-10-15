const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const contactService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "CreatedOn" } }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }]
      };

      const response = await apperClient.fetchRecords("contacts_c", params);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch contacts");
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "CreatedOn" } }
        ]
      };

      const response = await apperClient.getRecordById("contacts_c", id, params);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch contact");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(data) {
    try {
      const params = {
        records: [
          {
            first_name_c: data.first_name_c,
            last_name_c: data.last_name_c,
            email_c: data.email_c,
            phone_c: data.phone_c || "",
            company_c: data.company_c || "",
            status_c: data.status_c || "prospect"
          }
        ]
      };

      const response = await apperClient.createRecord("contacts_c", params);

      if (!response.success) {
        throw new Error(response.message || "Failed to create contact");
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} contact(s):`, failed);
          throw new Error(failed[0].message || "Failed to create contact");
        }
        return response.results[0].data;
      }

      return null;
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const params = {
        records: [
          {
            Id: id,
            first_name_c: data.first_name_c,
            last_name_c: data.last_name_c,
            email_c: data.email_c,
            phone_c: data.phone_c || "",
            company_c: data.company_c || "",
            status_c: data.status_c
          }
        ]
      };

      const response = await apperClient.updateRecord("contacts_c", params);

      if (!response.success) {
        throw new Error(response.message || "Failed to update contact");
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} contact(s):`, failed);
          throw new Error(failed[0].message || "Failed to update contact");
        }
        return response.results[0].data;
      }

      return null;
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async updateStatus(id, status) {
    try {
      const params = {
        records: [
          {
            Id: id,
            status_c: status
          }
        ]
      };

      const response = await apperClient.updateRecord("contacts_c", params);

      if (!response.success) {
        throw new Error(response.message || "Failed to update contact status");
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update status for ${failed.length} contact(s):`, failed);
          throw new Error(failed[0].message || "Failed to update contact status");
        }
        return response.results[0].data;
      }

      return null;
    } catch (error) {
      console.error("Error updating contact status:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord("contacts_c", params);

      if (!response.success) {
        throw new Error(response.message || "Failed to delete contact");
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} contact(s):`, failed);
          throw new Error(failed[0].message || "Failed to delete contact");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error);
      throw error;
    }
  }
};

export default contactService;