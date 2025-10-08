import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import QuoteCard from "@/components/organisms/QuoteCard";
import CreateQuoteModal from "@/components/organisms/CreateQuoteModal";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import Button from "@/components/atoms/Button";
import quoteService from "@/services/api/quoteService";

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [deletingQuote, setDeletingQuote] = useState(null);
  const [draggingId, setDraggingId] = useState(null);

  const statuses = [
    { id: "draft", label: "Draft", color: "bg-slate-500" },
    { id: "in_review", label: "In Review", color: "bg-blue-500" },
    { id: "approved", label: "Approved", color: "bg-purple-500" },
    { id: "sent", label: "Sent", color: "bg-amber-500" },
    { id: "accepted", label: "Accepted", color: "bg-green-500" },
    { id: "rejected", label: "Rejected", color: "bg-red-500" }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await quoteService.getAll();
      setQuotes(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuote = () => {
    setEditingQuote(null);
    setShowCreateModal(true);
  };

  const handleEditQuote = (quote) => {
    setEditingQuote(quote);
    setShowCreateModal(true);
  };

  const handleDeleteQuote = async () => {
    if (!deletingQuote) return;
    
    try {
      await quoteService.delete(deletingQuote.Id);
      toast.success("Quote deleted successfully!");
      loadData();
    } catch (error) {
      toast.error("Failed to delete quote");
    } finally {
      setDeletingQuote(null);
    }
  };

  const handleDragStart = (quoteId) => {
    setDraggingId(quoteId);
  };

  const handleDragEnd = async (quoteId, newStatus) => {
    setDraggingId(null);
    
    const quote = quotes.find(q => q.Id === quoteId);
    if (!quote || quote.status_c === newStatus) return;

    try {
      await quoteService.updateStatus(quoteId, newStatus);
      toast.success(`Status updated to ${statuses.find(s => s.id === newStatus)?.label}`);
      loadData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getQuotesByStatus = (status) => {
    return quotes.filter(q => q.status_c === status);
  };

  const getStatusValue = (status) => {
    return getQuotesByStatus(status)
      .reduce((sum, q) => sum + (q.value_c || 0), 0);
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
    const totalQuotes = quotes.length;
    const totalValue = quotes
      .filter(q => q.status_c !== 'rejected')
      .reduce((sum, q) => sum + (q.value_c || 0), 0);
    const avgQuoteValue = totalQuotes > 0 ? totalValue / totalQuotes : 0;
    const accepted = quotes.filter(q => q.status_c === 'accepted').length;
    const totalClosed = quotes.filter(q => q.status_c === 'accepted' || q.status_c === 'rejected').length;
    const acceptanceRate = totalClosed > 0 ? (accepted / totalClosed) * 100 : 0;

    return { totalQuotes, totalValue, avgQuoteValue, acceptanceRate };
  };

  if (loading) return <Loading type="quotes" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  
  if (quotes.length === 0) {
    return (
      <Empty
        icon="FileQuote"
        title="No quotes yet"
        message="Create your first quote to start tracking your proposals"
        actionLabel="Create Quote"
        onAction={handleCreateQuote}
      />
    );
  }

  const metrics = calculateMetrics();

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Quotes</h1>
            <p className="text-slate-600">Manage and track your sales quotes</p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={handleCreateQuote}
          >
            <ApperIcon name="Plus" size={20} />
            New Quote
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <ApperIcon name="FileQuote" size={24} />
              <span className="text-3xl font-bold">{metrics.totalQuotes}</span>
            </div>
            <p className="text-sm font-medium opacity-90">Total Quotes</p>
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
            <p className="text-sm font-medium opacity-90">Total Value</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-600 to-purple-500 text-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <ApperIcon name="Target" size={24} />
              <span className="text-3xl font-bold">{formatCurrency(metrics.avgQuoteValue)}</span>
            </div>
            <p className="text-sm font-medium opacity-90">Avg Quote Value</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-amber-600 to-amber-500 text-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <ApperIcon name="CheckCircle2" size={24} />
              <span className="text-3xl font-bold">{metrics.acceptanceRate.toFixed(1)}%</span>
            </div>
            <p className="text-sm font-medium opacity-90">Acceptance Rate</p>
          </motion.div>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="inline-flex gap-4 min-w-full">
          {statuses.map((status, statusIndex) => {
            const statusQuotes = getQuotesByStatus(status.id);
            const statusValue = getStatusValue(status.id);

            return (
              <motion.div
                key={status.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: statusIndex * 0.1 }}
                className="flex-1 min-w-[300px] max-w-[350px]"
              >
                <div className="bg-slate-50 rounded-xl p-4 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${status.color}`} />
                      <h3 className="font-bold text-slate-900">{status.label}</h3>
                      <span className="px-2 py-0.5 text-xs font-bold text-slate-600 bg-slate-200 rounded-full">
                        {statusQuotes.length}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4 text-sm font-semibold text-slate-700">
                    {formatCurrency(statusValue)}
                  </div>

                  <div
                    className="space-y-3 min-h-[200px]"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggingId) {
                        handleDragEnd(draggingId, status.id);
                      }
                    }}
                  >
                    {statusQuotes.length === 0 ? (
                      <div className="flex items-center justify-center h-32 text-sm text-slate-400">
                        No quotes
                      </div>
                    ) : (
                      statusQuotes.map((quote) => (
                        <div
                          key={quote.Id}
                          draggable
                          onDragStart={() => handleDragStart(quote.Id)}
                          onDragEnd={() => setDraggingId(null)}
                        >
                          <QuoteCard
                            quote={quote}
                            onEdit={handleEditQuote}
                            onDelete={(q) => setDeletingQuote(q)}
                            isDragging={draggingId === quote.Id}
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
        <CreateQuoteModal
          quote={editingQuote}
          onClose={() => {
            setShowCreateModal(false);
            setEditingQuote(null);
          }}
          onSuccess={loadData}
        />
      )}

      <ConfirmDialog
        isOpen={!!deletingQuote}
        title="Delete Quote"
        message={`Are you sure you want to delete the quote "${deletingQuote?.name_c}"?`}
        confirmLabel="Delete"
        onConfirm={handleDeleteQuote}
        onCancel={() => setDeletingQuote(null)}
      />
    </div>
  );
};

export default Quotes;