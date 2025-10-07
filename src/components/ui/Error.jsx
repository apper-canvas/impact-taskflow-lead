import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[400px] p-6"
    >
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-error/20 to-error/10 rounded-full flex items-center justify-center"
        >
          <ApperIcon name="AlertCircle" size={40} className="text-error" />
        </motion.div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Oops!</h3>
        <p className="text-slate-600 mb-6">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="primary">
            <ApperIcon name="RotateCw" size={16} />
            Try Again
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default Error;