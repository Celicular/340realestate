import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Mail, Calendar, User, MessageSquare, Trash2, CheckCircle, Clock, AlertCircle } from "lucide-react";

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, new, read, replied

  useEffect(() => {
    const q = query(
      collection(db, "contacts"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const contactsData = [];
      querySnapshot.forEach((doc) => {
        contactsData.push({ id: doc.id, ...doc.data() });
      });
      setContacts(contactsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateContactStatus = async (contactId, newStatus) => {
    try {
      await updateDoc(doc(db, "contacts", contactId), {
        status: newStatus,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error updating contact status:", error);
    }
  };

  const deleteContact = async (contactId) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await deleteDoc(doc(db, "contacts", contactId));
      } catch (error) {
        console.error("Error deleting contact:", error);
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "new":
        return <Clock className="w-4 h-4 text-orange-500" />;
      case "read":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "replied":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case "new":
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case "read":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "replied":
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (filter === "all") return true;
    return contact.status === filter;
  });

  const statusCounts = {
    all: contacts.length,
    new: contacts.filter(c => c.status === "new").length,
    read: contacts.filter(c => c.status === "read").length,
    replied: contacts.filter(c => c.status === "replied").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contact Management</h1>
          <p className="mt-2 text-gray-600">Manage contact form submissions from your website</p>
        </div>

        {/* Status Filter Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: "all", label: "All", count: statusCounts.all },
                { key: "new", label: "New", count: statusCounts.new },
                { key: "read", label: "Read", count: statusCounts.read },
                { key: "replied", label: "Replied", count: statusCounts.replied },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contacts List */}
        {filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No contacts</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === "all" ? "No contact submissions yet." : `No ${filter} contacts.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContacts.map((contact) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-3">
                        {getStatusIcon(contact.status)}
                        <h3 className="text-lg font-semibold text-gray-900">
                          {contact.subject || "Contact Form Submission"}
                        </h3>
                        <span className={getStatusBadge(contact.status)}>
                          {contact.status}
                        </span>
                      </div>

                      {/* Contact Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span>{contact.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {contact.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 md:col-span-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {contact.createdAt?.toDate?.()?.toLocaleDateString() || "Unknown date"}
                          </span>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">Message:</span>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-800">
                          {contact.message}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 ml-4">
                      {contact.status === "new" && (
                        <button
                          onClick={() => updateContactStatus(contact.id, "read")}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition"
                        >
                          Mark Read
                        </button>
                      )}
                      {contact.status === "read" && (
                        <button
                          onClick={() => updateContactStatus(contact.id, "replied")}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-medium hover:bg-green-200 transition"
                        >
                          Mark Replied
                        </button>
                      )}
                      <button
                        onClick={() => deleteContact(contact.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactManagement;