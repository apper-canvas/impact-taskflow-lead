import { motion } from "framer-motion";
import { format } from "date-fns";
import React from "react";
import ApperIcon from "@/components/ApperIcon";

const QuoteCard = ({ quote, onEdit, onDelete, isDragging }) => {
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
            {quote.name_c}
          </h3>
          {quote.description_c && (
            <p className="text-sm text-slate-600 line-clamp-2">{quote.description_c}</p>
          )}
        </div>
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(quote);
            }}
            className="p-1.5 hover:bg-slate-100 rounded transition-colors"
            title="Edit quote"
          >
            <ApperIcon name="Pencil" size={16} className="text-slate-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(quote);
            }}
            className="p-1.5 hover:bg-red-50 rounded transition-colors"
            title="Delete quote"
          >
            <ApperIcon name="Trash2" size={16} className="text-red-600" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            {formatCurrency(quote.value_c)}
          </span>
        </div>

        {quote.expected_close_date_c && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <ApperIcon name="Calendar" size={14} />
            <span>Close: {format(new Date(quote.expected_close_date_c), "MMM d, yyyy")}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default QuoteCard;