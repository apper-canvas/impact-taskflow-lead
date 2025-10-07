import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  icon = "Inbox",
  title = "No items found",
  message = "Get started by creating your first item",
  actionLabel = "Create New",
  onAction
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[400px] p-6"
    >
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full flex items-center justify-center"
        >
          <ApperIcon name={icon} size={48} className="text-primary" />
        </motion.div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 mb-6">{message}</p>
        {onAction && (
          <Button onClick={onAction} variant="primary" size="lg">
            <ApperIcon name="Plus" size={20} />
            {actionLabel}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default Empty;