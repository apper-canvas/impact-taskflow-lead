import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import OpportunityCard from "@/components/organisms/OpportunityCard";
import CreateOpportunityModal from "@/components/organisms/CreateOpportunityModal";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import opportunityService from "@/services/api/opportunityService";

const SalesPipeline = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [deletingOpportunity, setDeletingOpportunity] = useState(null);
  const [draggingId, setDraggingId] = useState(null);

  const stages = [
    { id: "lead", label: "Lead", color: "bg-slate-500" },
    { id: "qualified", label: "Qualified", color: "bg-blue-500" },
    { id: "proposal", label: "Proposal", color: "bg-purple-500" },
    { id: "negotiation", label: "Negotiation", color: "bg-amber-500" },
    { id: "closed_won", label: "Closed Won", color: "bg-green-500" },
    { id: "closed_lost", label: "Closed Lost", color: "bg-red-500" }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await opportunityService.getAll();
      setOpportunities(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOpportunity = () => {
    setEditingOpportunity(null);
    setShowCreateModal(true);
  };

  const handleEditOpportunity = (opportunity) => {
    setEditingOpportunity(opportunity);
    setShowCreateModal(true);
  };

  const handleDeleteOpportunity = async () => {
    if (!deletingOpportunity) return;
    
    try {
      await opportunityService.delete(deletingOpportunity.Id);
      toast.success("Opportunity deleted successfully!");
      loadData();
    } catch (error) {
      toast.error("Failed to delete opportunity");
    } finally {
      setDeletingOpportunity(null);
    }
  };

  const handleDragStart = (opportunityId) => {
    setDraggingId(opportunityId);
  };

  const handleDragEnd = async (opportunityId, newStage) => {
    setDraggingId(null);
    
    const opportunity = opportunities.find(o => o.Id === opportunityId);
    if (!opportunity || opportunity.stage === newStage) return;

    try {
      await opportunityService.updateStage(opportunityId, newStage);
      toast.success(`Stage updated to ${stages.find(s => s.id === newStage)?.label}`);
      loadData();
    } catch (error) {
      toast.error("Failed to update stage");
    }
  };

  const getOpportunitiesByStage = (stage) => {
    return opportunities.filter(o => o.stage === stage);
  };

  const getStageValue = (stage) => {
    return getOpportunitiesByStage(stage)
      .reduce((sum, o) => sum + o.value, 0);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const calculateMetrics = () => {
    const totalOpportunities = opportunities.length;
    const totalValue = opportunities
      .filter(o => o.stage !== 'closed_lost')
      .reduce((sum, o) => sum + o.value, 0);
    const avgDealSize = totalOpportunities > 0 ? totalValue / totalOpportunities : 0;
    const closedWon = opportunities.filter(o => o.stage === 'closed_won').length;
    const totalClosed = opportunities.filter(o => o.stage === 'closed_won' || o.stage === 'closed_lost').length;
    const conversionRate = totalClosed > 0 ? (closedWon / totalClosed) * 100 : 0;

    return { totalOpportunities, totalValue, avgDealSize, conversionRate };
  };

  if (loading) return <Loading type="opportunities" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  
  if (opportunities.length === 0) {
    return (
      <Empty
        icon="TrendingUp"
        title="No opportunities yet"
        message="Create your first sales opportunity to start tracking your pipeline"
        actionLabel="Create Opportunity"
        onAction={handleCreateOpportunity}
      />
    );
  }

  const metrics = calculateMetrics();

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Sales Pipeline</h1>
            <p className="text-slate-600">Track and manage your sales opportunities</p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={handleCreateOpportunity}
          >
            <ApperIcon name="Plus" size={20} />
            New Opportunity
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <ApperIcon name="TrendingUp" size={24} />
              <span className="text-3xl font-bold">{metrics.totalOpportunities}</span>
            </div>
            <p className="text-sm font-medium opacity-90">Total Opportunities</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-success to-success/80 text-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <ApperIcon name="DollarSign" size={24} />
              <span className="text-3xl font-bold">{formatCurrency(metrics.totalValue)}</span>
            </div>
            <p className="text-sm font-medium opacity-90">Pipeline Value</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-600 to-purple-500 text-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <ApperIcon name="Target" size={24} />
              <span className="text-3xl font-bold">{formatCurrency(metrics.avgDealSize)}</span>
            </div>
            <p className="text-sm font-medium opacity-90">Avg Deal Size</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-amber-600 to-amber-500 text-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <ApperIcon name="CheckCircle2" size={24} />
              <span className="text-3xl font-bold">{metrics.conversionRate.toFixed(1)}%</span>
            </div>
            <p className="text-sm font-medium opacity-90">Conversion Rate</p>
          </motion.div>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="inline-flex gap-4 min-w-full">
          {stages.map((stage, stageIndex) => {
            const stageOpportunities = getOpportunitiesByStage(stage.id);
            const stageValue = getStageValue(stage.id);

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: stageIndex * 0.1 }}
                className="flex-1 min-w-[300px] max-w-[350px]"
              >
                <div className="bg-slate-50 rounded-xl p-4 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                      <h3 className="font-bold text-slate-900">{stage.label}</h3>
                      <span className="px-2 py-0.5 text-xs font-bold text-slate-600 bg-slate-200 rounded-full">
                        {stageOpportunities.length}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4 text-sm font-semibold text-slate-700">
                    {formatCurrency(stageValue)}
                  </div>

                  <div
                    className="space-y-3 min-h-[200px]"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggingId) {
                        handleDragEnd(draggingId, stage.id);
                      }
                    }}
                  >
                    {stageOpportunities.length === 0 ? (
                      <div className="flex items-center justify-center h-32 text-sm text-slate-400">
                        No opportunities
                      </div>
                    ) : (
                      stageOpportunities.map((opportunity) => (
                        <div
                          key={opportunity.Id}
                          draggable
                          onDragStart={() => handleDragStart(opportunity.Id)}
                          onDragEnd={() => setDraggingId(null)}
                        >
                          <OpportunityCard
                            opportunity={opportunity}
                            onEdit={handleEditOpportunity}
                            onDelete={(opp) => setDeletingOpportunity(opp)}
                            isDragging={draggingId === opportunity.Id}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {showCreateModal && (
        <CreateOpportunityModal
          opportunity={editingOpportunity}
          onClose={() => {
            setShowCreateModal(false);
            setEditingOpportunity(null);
          }}
          onSuccess={loadData}
        />
      )}

      <ConfirmDialog
        isOpen={!!deletingOpportunity}
        title="Delete Opportunity"
        message={`Are you sure you want to delete the opportunity for "${deletingOpportunity?.company_name}"?`}
        confirmLabel="Delete"
        onConfirm={handleDeleteOpportunity}
        onCancel={() => setDeletingOpportunity(null)}
      />
    </div>
  );
};

export default SalesPipeline;