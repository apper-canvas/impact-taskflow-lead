import { motion } from "framer-motion";

const Loading = ({ type = "page" }) => {
  if (type === "projects") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2 flex-1">
                <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-1/2 animate-pulse" />
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-100 rounded-full animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-5/6 animate-pulse" />
            </div>
            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-100">
              <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-100 rounded flex-1 animate-pulse" />
              <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-100 rounded flex-1 animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "tasks") {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="w-5 h-5 bg-gradient-to-br from-slate-200 to-slate-100 rounded animate-pulse flex-shrink-0 mt-1" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-full animate-pulse" />
                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-2/3 animate-pulse" />
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <div className="w-20 h-6 bg-gradient-to-r from-slate-200 to-slate-100 rounded-full animate-pulse" />
                <div className="w-20 h-6 bg-gradient-to-r from-slate-200 to-slate-100 rounded-full animate-pulse" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-full h-full border-4 border-primary/20 border-t-primary rounded-full"
          />
        </div>
        <p className="text-slate-600 font-medium">Loading...</p>
      </motion.div>
    </div>
  );
};

export default Loading;