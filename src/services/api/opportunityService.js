import opportunitiesData from '@/services/mockData/opportunities.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let opportunities = [...opportunitiesData];

const opportunityService = {
  async getAll() {
    try {
      await delay(300);
      return [...opportunities];
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      await delay(300);
      const opportunity = opportunities.find(o => o.Id === parseInt(id));
      if (!opportunity) {
        throw new Error("Opportunity not found");
      }
      return {...opportunity};
    } catch (error) {
      console.error(`Error fetching opportunity ${id}:`, error);
      throw error;
    }
  },

  async getByStage(stage) {
    try {
      await delay(300);
      return opportunities.filter(o => o.stage === stage).map(o => ({...o}));
    } catch (error) {
      console.error(`Error fetching opportunities for stage ${stage}:`, error);
      return [];
    }
  },

  async create(opportunity) {
    try {
      await delay(300);
      const newOpportunity = {
        Id: Date.now(),
        name: opportunity.name,
        email: opportunity.email || "",
        phone: opportunity.phone || "",
        company_name: opportunity.company_name,
        value: parseFloat(opportunity.value),
        stage: opportunity.stage || "lead",
        priority: opportunity.priority || "medium",
        probability: parseInt(opportunity.probability) || 50,
        notes: opportunity.notes || "",
        created_at: new Date().toISOString(),
        closed_at: null
      };
      opportunities.push(newOpportunity);
      return {...newOpportunity};
    } catch (error) {
      console.error("Error creating opportunity:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      await delay(300);
      const index = opportunities.findIndex(o => o.Id === parseInt(id));
      if (index === -1) {
        throw new Error("Opportunity not found");
      }

      const updated = {
        ...opportunities[index],
        ...data,
        Id: opportunities[index].Id,
        created_at: opportunities[index].created_at
      };

      if (data.value !== undefined) {
        updated.value = parseFloat(data.value);
      }
      if (data.probability !== undefined) {
        updated.probability = parseInt(data.probability);
      }

      opportunities[index] = updated;
      return {...updated};
    } catch (error) {
      console.error("Error updating opportunity:", error);
      throw error;
    }
  },

  async updateStage(id, newStage) {
    try {
      await delay(300);
      const index = opportunities.findIndex(o => o.Id === parseInt(id));
      if (index === -1) {
        throw new Error("Opportunity not found");
      }

      const updated = {
        ...opportunities[index],
        stage: newStage
      };

      if (newStage === "closed_won" || newStage === "closed_lost") {
        updated.closed_at = new Date().toISOString();
        updated.probability = newStage === "closed_won" ? 100 : 0;
      } else {
        updated.closed_at = null;
      }

      opportunities[index] = updated;
      return {...updated};
    } catch (error) {
      console.error("Error updating opportunity stage:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await delay(300);
      const index = opportunities.findIndex(o => o.Id === parseInt(id));
      if (index === -1) {
        throw new Error("Opportunity not found");
      }
      opportunities.splice(index, 1);
      return true;
    } catch (error) {
      console.error("Error deleting opportunity:", error);
      throw error;
    }
  }
};

export default opportunityService;