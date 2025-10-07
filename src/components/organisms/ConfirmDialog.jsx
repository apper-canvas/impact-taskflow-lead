import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ConfirmDialog = ({ isOpen, title, message, confirmLabel = "Confirm", onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center flex-shrink-0">
              <ApperIcon name="AlertCircle" size={24} className="text-error" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
              <p className="text-sm text-slate-600">{message}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={onConfirm}
              className="flex-1"
            >
              {confirmLabel}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmDialog;