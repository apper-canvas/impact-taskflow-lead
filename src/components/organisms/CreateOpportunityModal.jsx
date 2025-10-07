import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import opportunityService from "@/services/api/opportunityService";

const CreateOpportunityModal = ({ opportunity, onClose, onSuccess }) => {
const [formData, setFormData] = useState({
    Name: "",
    pipeline_name_c: "",
    deal_size_c: "",
    stage_c: "lead",
    probability_c: 50,
    Tags: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

useEffect(() => {
    if (opportunity) {
      setFormData({
        Name: opportunity.Name || "",
        pipeline_name_c: opportunity.pipeline_name_c || "",
        deal_size_c: opportunity.deal_size_c || "",
        stage_c: opportunity.stage_c || "lead",
        probability_c: opportunity.probability_c || 50,
        Tags: opportunity.Tags || ""
      });
    }
  }, [opportunity]);

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
    
    if (!formData.pipeline_name_c.trim()) {
      newErrors.pipeline_name_c = "Pipeline name is required";
    }
    
    if (!formData.deal_size_c || parseFloat(formData.deal_size_c) <= 0) {
      newErrors.deal_size_c = "Deal size must be greater than 0";
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
      if (opportunity) {
        await opportunityService.update(opportunity.Id, formData);
        toast.success("Opportunity updated successfully!");
      } else {
        await opportunityService.create(formData);
        toast.success("Opportunity created successfully!");
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to save opportunity");
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
              {opportunity ? "Edit Opportunity" : "Create New Opportunity"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" size={20} className="text-slate-600" />
            </button>
          </div>

<form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.Name}
                  onChange={(e) => handleChange('Name', e.target.value)}
                  placeholder="Opportunity Name"
                  disabled={loading}
                  className={errors.Name ? 'border-red-500' : ''}
                />
                {errors.Name && (
                  <p className="mt-1 text-sm text-red-600">{errors.Name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Pipeline Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.pipeline_name_c}
                  onChange={(e) => handleChange('pipeline_name_c', e.target.value)}
                  placeholder="Acme Corporation"
                  disabled={loading}
                  className={errors.pipeline_name_c ? 'border-red-500' : ''}
                />
                {errors.pipeline_name_c && (
                  <p className="mt-1 text-sm text-red-600">{errors.pipeline_name_c}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Deal Size <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={formData.deal_size_c}
                onChange={(e) => handleChange('deal_size_c', e.target.value)}
                placeholder="50000"
                min="0"
                step="1000"
                disabled={loading}
                className={errors.deal_size_c ? 'border-red-500' : ''}
              />
              {errors.deal_size_c && (
                <p className="mt-1 text-sm text-red-600">{errors.deal_size_c}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Stage
                </label>
                <Select
                  value={formData.stage_c}
                  onChange={(e) => handleChange('stage_c', e.target.value)}
                  disabled={loading}
                >
                  <option value="lead">Prospecting</option>
                  <option value="qualified">Qualification</option>
                  <option value="proposal">Demo</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="closed_won">Closed Won</option>
                  <option value="closed_lost">Closed Lost</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Probability: {formData.probability_c}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.probability_c}
                  onChange={(e) => handleChange('probability_c', parseInt(e.target.value))}
                  disabled={loading}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
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
                    <ApperIcon name={opportunity ? "Save" : "Plus"} size={18} />
                    {opportunity ? "Save Changes" : "Create Opportunity"}
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

export default CreateOpportunityModal;