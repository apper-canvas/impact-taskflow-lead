import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import contactService from "@/services/api/contactService";

const CreateContactModal = ({ onClose, contact, onSuccess }) => {
  const [formData, setFormData] = useState({
    first_name_c: contact?.first_name_c || "",
    last_name_c: contact?.last_name_c || "",
    email_c: contact?.email_c || "",
    phone_c: contact?.phone_c || "",
    company_c: contact?.company_c || "",
    status_c: contact?.status_c || "prospect"
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const statusOptions = [
    { value: "prospect", label: "Prospect" },
    { value: "active", label: "Active" },
    { value: "customer", label: "Customer" },
    { value: "inactive", label: "Inactive" }
  ];

  const validate = () => {
    const newErrors = {};
    
    if (!formData.first_name_c.trim()) {
      newErrors.first_name_c = "First name is required";
    }
    
    if (!formData.last_name_c.trim()) {
      newErrors.last_name_c = "Last name is required";
    }
    
    if (!formData.email_c.trim()) {
      newErrors.email_c = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_c)) {
      newErrors.email_c = "Invalid email format";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (contact) {
        await contactService.update(contact.Id, formData);
        toast.success("Contact updated successfully!");
      } else {
        await contactService.create(formData);
        toast.success("Contact created successfully!");
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to save contact");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {contact ? "Edit Contact" : "Create New Contact"}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {contact ? "Update contact details" : "Add a new contact to your list"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" size={20} className="text-slate-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <FormField label="First Name" required error={errors.first_name_c}>
              <Input
                value={formData.first_name_c}
                onChange={(e) => setFormData({ ...formData, first_name_c: e.target.value })}
                placeholder="Enter first name"
              />
            </FormField>

            <FormField label="Last Name" required error={errors.last_name_c}>
              <Input
                value={formData.last_name_c}
                onChange={(e) => setFormData({ ...formData, last_name_c: e.target.value })}
                placeholder="Enter last name"
              />
            </FormField>

            <FormField label="Email" required error={errors.email_c}>
              <Input
                type="email"
                value={formData.email_c}
                onChange={(e) => setFormData({ ...formData, email_c: e.target.value })}
                placeholder="contact@example.com"
              />
            </FormField>

            <FormField label="Phone">
              <Input
                type="tel"
                value={formData.phone_c}
                onChange={(e) => setFormData({ ...formData, phone_c: e.target.value })}
                placeholder="(123) 456-7890"
              />
            </FormField>

            <FormField label="Company">
              <Input
                value={formData.company_c}
                onChange={(e) => setFormData({ ...formData, company_c: e.target.value })}
                placeholder="Company name"
              />
            </FormField>

            <FormField label="Status" required>
              <Select
                value={formData.status_c}
                onChange={(e) => setFormData({ ...formData, status_c: e.target.value })}
                options={statusOptions}
              />
            </FormField>

            <div className="flex items-center gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Check" size={18} />
                    {contact ? "Update" : "Create"} Contact
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

export default CreateContactModal;