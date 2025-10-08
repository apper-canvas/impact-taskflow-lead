import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import quoteService from "@/services/api/quoteService";

const CreateQuoteModal = ({ quote, onClose, onSuccess }) => {
const [formData, setFormData] = useState({
    Name: "",
    description_c: "",
    value_c: "",
    expected_close_date_c: "",
    status_c: "draft",
    Tags: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (quote) {
setFormData({
        Name: quote.Name || "",
        description_c: quote.description_c || "",
        value_c: quote.value_c || "",
        expected_close_date_c: quote.expected_close_date_c || "",
        status_c: quote.status_c || "draft",
        Tags: quote.Tags || ""
      });
    }
  }, [quote]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

const validateForm = () => {
    const newErrors = {};
    
    if (!formData.Name.trim()) {
      newErrors.Name = "Name is required";
    }
    if (!formData.value_c || parseFloat(formData.value_c) <= 0) {
      newErrors.value_c = "Value must be greater than 0";
    }

    if (!formData.expected_close_date_c) {
      newErrors.expected_close_date_c = "Expected close date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setLoading(true);
    try {
      if (quote) {
        const result = await quoteService.update(quote.Id, formData);
        if (result) {
          toast.success("Quote updated successfully!");
          onSuccess();
          onClose();
        }
      } else {
        const result = await quoteService.create(formData);
        if (result) {
          toast.success("Quote created successfully!");
          onSuccess();
          onClose();
        }
      }
    } catch (error) {
      console.error("Error saving quote:", error);
      toast.error(error.message || "Failed to save quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              {quote ? "Edit Quote" : "Create New Quote"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" size={20} className="text-slate-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
<div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Quote Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.Name}
                onChange={(e) => handleChange('Name', e.target.value)}
                placeholder="Q2 Enterprise Package"
                disabled={loading}
                className={errors.Name ? 'border-red-500' : ''}
              />
              {errors.Name && (
                <p className="mt-1 text-sm text-red-600">{errors.Name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <Textarea
                value={formData.description_c}
                onChange={(e) => handleChange('description_c', e.target.value)}
                placeholder="Enter quote details and specifications"
                rows={4}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Quote Value <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={formData.value_c}
                  onChange={(e) => handleChange('value_c', e.target.value)}
                  placeholder="50000"
                  min="0"
                  step="1000"
                  disabled={loading}
                  className={errors.value_c ? 'border-red-500' : ''}
                />
                {errors.value_c && (
                  <p className="mt-1 text-sm text-red-600">{errors.value_c}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Expected Close Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.expected_close_date_c}
                  onChange={(e) => handleChange('expected_close_date_c', e.target.value)}
                  disabled={loading}
                  className={errors.expected_close_date_c ? 'border-red-500' : ''}
                />
                {errors.expected_close_date_c && (
                  <p className="mt-1 text-sm text-red-600">{errors.expected_close_date_c}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <Select
                value={formData.status_c}
                onChange={(e) => handleChange('status_c', e.target.value)}
                disabled={loading}
              >
                <option value="draft">Draft</option>
                <option value="in_review">In Review</option>
                <option value="approved">Approved</option>
                <option value="sent">Sent</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tags
              </label>
              <Input
                value={formData.Tags}
                onChange={(e) => handleChange('Tags', e.target.value)}
                placeholder="Enter tags separated by commas"
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <ApperIcon name={quote ? "Save" : "Plus"} size={18} />
                    {quote ? "Save Changes" : "Create Quote"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateQuoteModal;