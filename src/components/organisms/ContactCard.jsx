import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ContactCard = ({ contact, onEdit, onDelete, isDragging }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      className={`bg-white rounded-lg shadow-sm border border-slate-200 p-4 cursor-move hover:shadow-md transition-all ${
        isDragging ? "rotate-2 scale-105" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 truncate">
            {contact.first_name_c} {contact.last_name_c}
          </h3>
          {contact.company_c && (
            <p className="text-sm text-slate-600 truncate">{contact.company_c}</p>
          )}
        </div>
        <div className="flex items-center gap-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(contact);
            }}
            className="p-1.5"
          >
            <ApperIcon name="Pencil" size={14} className="text-slate-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(contact);
            }}
            className="p-1.5"
          >
            <ApperIcon name="Trash2" size={14} className="text-red-600" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {contact.email_c && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <ApperIcon name="Mail" size={14} className="text-slate-400 flex-shrink-0" />
            <span className="truncate">{contact.email_c}</span>
          </div>
        )}
        {contact.phone_c && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <ApperIcon name="Phone" size={14} className="text-slate-400 flex-shrink-0" />
            <span className="truncate">{contact.phone_c}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ContactCard;