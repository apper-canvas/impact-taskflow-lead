import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import ContactCard from "@/components/organisms/ContactCard";
import CreateContactModal from "@/components/organisms/CreateContactModal";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import Button from "@/components/atoms/Button";
import contactService from "@/services/api/contactService";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [deletingContact, setDeletingContact] = useState(null);
  const [draggingId, setDraggingId] = useState(null);

  const statuses = [
    { id: "prospect", label: "Prospect", color: "bg-blue-500" },
    { id: "active", label: "Active", color: "bg-amber-500" },
    { id: "customer", label: "Customer", color: "bg-green-500" },
    { id: "inactive", label: "Inactive", color: "bg-slate-500" }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactService.getAll();
      setContacts(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContact = () => {
    setEditingContact(null);
    setShowCreateModal(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setShowCreateModal(true);
  };

  const handleDeleteContact = async () => {
    if (!deletingContact) return;
    
    try {
      await contactService.delete(deletingContact.Id);
      toast.success("Contact deleted successfully!");
      loadData();
    } catch (error) {
      toast.error("Failed to delete contact");
    } finally {
      setDeletingContact(null);
    }
  };

  const handleDragStart = (contactId) => {
    setDraggingId(contactId);
  };

  const handleDragEnd = async (contactId, newStatus) => {
    setDraggingId(null);
    
    const contact = contacts.find(c => c.Id === contactId);
    if (!contact || contact.status_c === newStatus) return;

    try {
      await contactService.updateStatus(contactId, newStatus);
      toast.success(`Status updated to ${statuses.find(s => s.id === newStatus)?.label}`);
      loadData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getContactsByStatus = (status) => {
    return contacts.filter(c => c.status_c === status);
  };

  const calculateMetrics = () => {
    const totalContacts = contacts.length;
    const activeContacts = contacts.filter(c => c.status_c === "active").length;
    const customers = contacts.filter(c => c.status_c === "customer").length;
    const prospects = contacts.filter(c => c.status_c === "prospect").length;
    const conversionRate = prospects > 0 ? (customers / prospects) * 100 : 0;

    return { totalContacts, activeContacts, customers, conversionRate };
  };

  if (loading) return <Loading type="contacts" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  
  if (contacts.length === 0) {
    return (
      <Empty
        icon="Users"
        title="No contacts yet"
        message="Create your first contact to start managing your network"
        actionLabel="Create Contact"
        onAction={handleCreateContact}
      />
    );
  }

  const metrics = calculateMetrics();

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Contacts</h1>
            <p className="text-slate-600">Manage and organize your contacts</p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={handleCreateContact}
          >
            <ApperIcon name="Plus" size={20} />
            New Contact
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <ApperIcon name="Users" size={24} />
              <span className="text-3xl font-bold">{metrics.totalContacts}</span>
            </div>
            <p className="text-sm font-medium opacity-90">Total Contacts</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-amber-600 to-amber-500 text-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <ApperIcon name="UserCheck" size={24} />
              <span className="text-3xl font-bold">{metrics.activeContacts}</span>
            </div>
            <p className="text-sm font-medium opacity-90">Active Contacts</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-success to-success/80 text-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <ApperIcon name="Star" size={24} />
              <span className="text-3xl font-bold">{metrics.customers}</span>
            </div>
            <p className="text-sm font-medium opacity-90">Customers</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-600 to-purple-500 text-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <ApperIcon name="TrendingUp" size={24} />
              <span className="text-3xl font-bold">{metrics.conversionRate.toFixed(1)}%</span>
            </div>
            <p className="text-sm font-medium opacity-90">Conversion Rate</p>
          </motion.div>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="inline-flex gap-4 min-w-full">
          {statuses.map((status, statusIndex) => {
            const statusContacts = getContactsByStatus(status.id);

            return (
              <motion.div
                key={status.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: statusIndex * 0.1 }}
                className="flex-1 min-w-[300px] max-w-[350px]"
              >
                <div className="bg-slate-50 rounded-xl p-4 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${status.color}`} />
                      <h3 className="font-bold text-slate-900">{status.label}</h3>
                      <span className="px-2 py-0.5 text-xs font-bold text-slate-600 bg-slate-200 rounded-full">
                        {statusContacts.length}
                      </span>
                    </div>
                  </div>

                  <div
                    className="space-y-3 min-h-[200px]"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggingId) {
                        handleDragEnd(draggingId, status.id);
                      }
                    }}
                  >
                    {statusContacts.length === 0 ? (
                      <div className="flex items-center justify-center h-32 text-sm text-slate-400">
                        No contacts
                      </div>
                    ) : (
                      statusContacts.map((contact) => (
                        <div
                          key={contact.Id}
                          draggable
                          onDragStart={() => handleDragStart(contact.Id)}
                          onDragEnd={() => setDraggingId(null)}
                        >
                          <ContactCard
                            contact={contact}
                            onEdit={handleEditContact}
                            onDelete={(c) => setDeletingContact(c)}
                            isDragging={draggingId === contact.Id}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {showCreateModal && (
        <CreateContactModal
          contact={editingContact}
          onClose={() => {
            setShowCreateModal(false);
            setEditingContact(null);
          }}
          onSuccess={loadData}
        />
      )}

      <ConfirmDialog
        isOpen={!!deletingContact}
        title="Delete Contact"
        message={`Are you sure you want to delete ${deletingContact?.first_name_c} ${deletingContact?.last_name_c}?`}
        confirmLabel="Delete"
        onConfirm={handleDeleteContact}
        onCancel={() => setDeletingContact(null)}
      />
    </div>
  );
};

export default Contacts;