// Status mapping: UI values to database picklist values
const statusMapping = {
  'draft': 'Draft',
  'in_review': 'In Review',
  'approved': 'Approved',
  'sent': 'Sent',
  'accepted': 'Accepted',
  'rejected': 'Rejected'
};

// Reverse mapping: database to UI
const reverseStatusMapping = {
  'Draft': 'draft',
  'In Review': 'in_review',
  'Approved': 'approved',
  'Sent': 'sent',
  'Accepted': 'accepted',
  'Rejected': 'rejected'
};

const quoteService = {
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
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "Tags"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('quote_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map database fields to UI format with status conversion
return response.data.map(record => ({
        Id: record.Id,
        Name: record.Name || "",
        description_c: record.description_c || "",
        value_c: parseFloat(record.value_c) || 0,
        expected_close_date_c: record.expected_close_date_c || null,
        status_c: reverseStatusMapping[record.status_c] || 'draft',
        Tags: record.Tags || ""
      }));
    } catch (error) {
      console.error("Error fetching quotes:", error);
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
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };

      const response = await apperClient.getRecordById('quote_c', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || "Quote not found");
      }

      if (!response.data) {
        throw new Error("Quote not found");
      }

      // Map database fields to UI format
      return {
Id: response.data.Id,
        Name: response.data.Name || "",
        description_c: response.data.description_c || "",
        value_c: parseFloat(response.data.value_c) || 0,
        expected_close_date_c: response.data.expected_close_date_c || null,
        status_c: reverseStatusMapping[response.data.status_c] || 'draft',
        Tags: response.data.Tags || ""
      };
    } catch (error) {
      console.error(`Error fetching quote ${id}:`, error);
      throw error;
    }
  },

  async getByStatus(status) {
    try {
      const allQuotes = await this.getAll();
      return allQuotes.filter(q => q.status_c === status);
    } catch (error) {
      console.error(`Error fetching quotes for status ${status}:`, error);
      return [];
    }
  },

  async create(quote) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map UI fields to database fields, only updateable fields
      const payload = {
records: [{
          Name: quote.Name || "",
          description_c: quote.description_c || "",
          value_c: parseFloat(quote.value_c) || 0,
          expected_close_date_c: quote.expected_close_date_c || null,
          status_c: statusMapping[quote.status_c] || 'Draft',
          Tags: quote.Tags || ""
        }]
      };

      const response = await apperClient.createRecord('quote_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || "Failed to create quote");
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create quote:`, failed);
          const errorMsg = failed[0].message || "Failed to create quote";
          throw new Error(errorMsg);
        }

        const successful = response.results.filter(r => r.success);
        if (successful.length > 0 && successful[0].data) {
          return {
            Id: successful[0].data.Id,
            Name: successful[0].data.Name || "",
Name: successful[0].data.Name || "",
            description_c: successful[0].data.description_c || "",
            value_c: parseFloat(successful[0].data.value_c) || 0,
            expected_close_date_c: successful[0].data.expected_close_date_c || null,
            status_c: reverseStatusMapping[successful[0].data.status_c] || 'draft',
            Tags: successful[0].data.Tags || ""
          };
        }
      }

      throw new Error("Failed to create quote");
    } catch (error) {
      console.error("Error creating quote:", error);
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

      // Map UI fields to database fields, only include provided updateable fields
      const updateData = {
        Id: parseInt(id)
      };

if (data.Name !== undefined) updateData.Name = data.Name;
      if (data.description_c !== undefined) updateData.description_c = data.description_c;
      if (data.value_c !== undefined) updateData.value_c = parseFloat(data.value_c);
      if (data.expected_close_date_c !== undefined) updateData.expected_close_date_c = data.expected_close_date_c;
      if (data.status_c !== undefined) updateData.status_c = statusMapping[data.status_c] || data.status_c;
      if (data.Tags !== undefined) updateData.Tags = data.Tags;

      const payload = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('quote_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || "Failed to update quote");
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update quote:`, failed);
          const errorMsg = failed[0].message || "Failed to update quote";
          throw new Error(errorMsg);
        }
const successful = response.results.filter(r => r.success);
        if (successful.length > 0 && successful[0].data) {
          return {
            Id: successful[0].data.Id,
            Name: successful[0].data.Name || "",
            description_c: successful[0].data.description_c || "",
            value_c: parseFloat(successful[0].data.value_c) || 0,
            expected_close_date_c: successful[0].data.expected_close_date_c || null,
            status_c: reverseStatusMapping[successful[0].data.status_c] || 'draft',
            Tags: successful[0].data.Tags || ""
          };
        }
      }

      throw new Error("Failed to update quote");
    } catch (error) {
      console.error("Error updating quote:", error);
      throw error;
    }
  },

  async updateStatus(id, newStatus) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const payload = {
        records: [{
          Id: parseInt(id),
          status_c: statusMapping[newStatus] || newStatus
        }]
      };

      const response = await apperClient.updateRecord('quote_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || "Failed to update status");
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update status:`, failed);
          const errorMsg = failed[0].message || "Failed to update status";
          throw new Error(errorMsg);
        }

        const successful = response.results.filter(r => r.success);
        if (successful.length > 0 && successful[0].data) {
return {
            Id: successful[0].data.Id,
            Name: successful[0].data.Name || "",
            description_c: successful[0].data.description_c || "",
            value_c: parseFloat(successful[0].data.value_c) || 0,
            expected_close_date_c: successful[0].data.expected_close_date_c || null,
            status_c: reverseStatusMapping[successful[0].data.status_c] || 'draft',
            Tags: successful[0].data.Tags || ""
          };
        }
      }

      throw new Error("Failed to update status");
    } catch (error) {
      console.error("Error updating quote status:", error);
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

      const payload = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('quote_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || "Failed to delete quote");
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete quote:`, failed);
          const errorMsg = failed[0].message || "Failed to delete quote";
          throw new Error(errorMsg);
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting quote:", error);
      throw error;
    }
  }
};

export default quoteService;