import { motion } from "framer-motion";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const OpportunityCard = ({ opportunity, onEdit, onDelete, isDragging }) => {
  const priorityColors = {
    high: "bg-red-100 text-red-700",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-green-100 text-green-700"
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-lg p-4 shadow-sm border border-slate-200 cursor-move hover:shadow-md transition-all duration-200 ${
        isDragging ? 'opacity-50 rotate-3' : ''
      }`}
    >
<div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 truncate mb-1">
{opportunity.Name}
          </h3>
          <p className="text-sm text-slate-600 truncate">{opportunity.Name}</p>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(opportunity);
            }}
            className="p-1.5 hover:bg-slate-100 rounded transition-colors"
            title="Edit opportunity"
          >
            <ApperIcon name="Pencil" size={16} className="text-slate-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(opportunity);
            }}
            className="p-1.5 hover:bg-red-50 rounded transition-colors"
            title="Delete opportunity"
          >
            <ApperIcon name="Trash2" size={16} className="text-red-600" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
{formatCurrency(opportunity.deal_size_c)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <ApperIcon name="Target" size={14} />
            <span>{opportunity.probability_c}%</span>
          </div>
        </div>
      </div>
    </motion.div>
);
};

export default OpportunityCard;