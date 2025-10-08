// Stage mapping: UI values to database picklist values
const stageMapping = {
  'lead': 'Prospecting',
  'qualified': 'Qualification',
  'proposal': 'Demo',
  'negotiation': 'Negotiation',
  'closed_won': 'Closed Won',
  'closed_lost': 'Closed Lost'
};

// Reverse mapping: database to UI
const reverseStageMapping = {
  'Prospecting': 'lead',
  'Qualification': 'qualified',
  'Demo': 'proposal',
  'Negotiation': 'negotiation',
  'Closed Won': 'closed_won',
  'Closed Lost': 'closed_lost'
};

const opportunityService = {
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
          {"field": {"Name": "pipeline_name_c"}},
          {"field": {"Name": "deal_size_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };

      const response = await apperClient.fetchRecords('sales_pipeline_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map database fields to UI format with stage conversion
      return response.data.map(record => ({
        Id: record.Id,
        Name: record.Name || "",
        pipeline_name_c: record.pipeline_name_c || "",
        deal_size_c: parseFloat(record.deal_size_c) || 0,
        stage_c: reverseStageMapping[record.stage_c] || 'lead',
        probability_c: parseInt(record.probability_c) || 0,
        Tags: record.Tags || ""
      }));
    } catch (error) {
      console.error("Error fetching opportunities:", error);
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
          {"field": {"Name": "pipeline_name_c"}},
          {"field": {"Name": "deal_size_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };

      const response = await apperClient.getRecordById('sales_pipeline_c', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || "Opportunity not found");
      }

      if (!response.data) {
        throw new Error("Opportunity not found");
      }

      // Map database fields to UI format
      return {
        Id: response.data.Id,
        Name: response.data.Name || "",
        pipeline_name_c: response.data.pipeline_name_c || "",
        deal_size_c: parseFloat(response.data.deal_size_c) || 0,
        stage_c: reverseStageMapping[response.data.stage_c] || 'lead',
        probability_c: parseInt(response.data.probability_c) || 0,
        Tags: response.data.Tags || ""
      };
    } catch (error) {
      console.error(`Error fetching opportunity ${id}:`, error);
      throw error;
    }
  },

  async getByStage(stage) {
    try {
      const allOpportunities = await this.getAll();
      return allOpportunities.filter(o => o.stage_c === stage);
    } catch (error) {
      console.error(`Error fetching opportunities for stage ${stage}:`, error);
      return [];
    }
  },

  async create(opportunity) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map UI fields to database fields, only updateable fields
const payload = {
records: [{
          Name: opportunity.Name || "",
          pipeline_name_c: opportunity.pipeline_name_c || "",
          deal_size_c: parseFloat(opportunity.deal_size_c) || 0,
          stage_c: stageMapping[opportunity.stage_c] || 'Prospecting',
          probability_c: parseInt(opportunity.probability_c) || 0,
          Tags: opportunity.Tags || ""
        }]
      };

      const response = await apperClient.createRecord('sales_pipeline_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || "Failed to create opportunity");
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create opportunity:`, failed);
          const errorMsg = failed[0].message || "Failed to create opportunity";
          throw new Error(errorMsg);
        }

        const successful = response.results.filter(r => r.success);
        if (successful.length > 0 && successful[0].data) {
          return {
            Id: successful[0].data.Id,
            Name: successful[0].data.Name || "",
            pipeline_name_c: successful[0].data.pipeline_name_c || "",
            deal_size_c: parseFloat(successful[0].data.deal_size_c) || 0,
            stage_c: reverseStageMapping[successful[0].data.stage_c] || 'lead',
            probability_c: parseInt(successful[0].data.probability_c) || 0,
            Tags: successful[0].data.Tags || ""
          };
        }
      }

      throw new Error("Failed to create opportunity");
    } catch (error) {
      console.error("Error creating opportunity:", error);
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
      if (data.company_name_c !== undefined) updateData.company_name_c = data.company_name_c;
      if (data.deal_size_c !== undefined) updateData.deal_size_c = parseFloat(data.deal_size_c);
      if (data.stage_c !== undefined) updateData.stage_c = stageMapping[data.stage_c] || data.stage_c;
      if (data.probability_c !== undefined) updateData.probability_c = parseInt(data.probability_c);
      if (data.Tags !== undefined) updateData.Tags = data.Tags;

      const payload = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('sales_pipeline_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || "Failed to update opportunity");
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update opportunity:`, failed);
          const errorMsg = failed[0].message || "Failed to update opportunity";
          throw new Error(errorMsg);
        }

        const successful = response.results.filter(r => r.success);
        if (successful.length > 0 && successful[0].data) {
          return {
            Id: successful[0].data.Id,
            Name: successful[0].data.Name || "",
            pipeline_name_c: successful[0].data.pipeline_name_c || "",
            deal_size_c: parseFloat(successful[0].data.deal_size_c) || 0,
            stage_c: reverseStageMapping[successful[0].data.stage_c] || 'lead',
            probability_c: parseInt(successful[0].data.probability_c) || 0,
            Tags: successful[0].data.Tags || ""
          };
        }
      }

      throw new Error("Failed to update opportunity");
    } catch (error) {
      console.error("Error updating opportunity:", error);
      throw error;
    }
  },

  async updateStage(id, newStage) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const payload = {
        records: [{
          Id: parseInt(id),
          stage_c: stageMapping[newStage] || newStage
        }]
      };

      const response = await apperClient.updateRecord('sales_pipeline_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || "Failed to update stage");
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update stage:`, failed);
          const errorMsg = failed[0].message || "Failed to update stage";
          throw new Error(errorMsg);
        }

        const successful = response.results.filter(r => r.success);
        if (successful.length > 0 && successful[0].data) {
          return {
            Id: successful[0].data.Id,
            Name: successful[0].data.Name || "",
            pipeline_name_c: successful[0].data.pipeline_name_c || "",
            deal_size_c: parseFloat(successful[0].data.deal_size_c) || 0,
            stage_c: reverseStageMapping[successful[0].data.stage_c] || 'lead',
            probability_c: parseInt(successful[0].data.probability_c) || 0,
            Tags: successful[0].data.Tags || ""
          };
        }
      }

      throw new Error("Failed to update stage");
    } catch (error) {
      console.error("Error updating opportunity stage:", error);
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

      const response = await apperClient.deleteRecord('sales_pipeline_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || "Failed to delete opportunity");
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete opportunity:`, failed);
          const errorMsg = failed[0].message || "Failed to delete opportunity";
          throw new Error(errorMsg);
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting opportunity:", error);
      throw error;
    }
  }
};

export default opportunityService;