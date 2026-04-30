import React, { useState, useEffect } from "react";
import {
  FaSignOutAlt,
  FaEnvelope,
  FaEye,
  FaCheckCircle,
  FaUsers,
  FaProjectDiagram,
  FaDownload,
  FaFilePdf,
  FaUpload,
  FaTrash,
  FaExternalLinkAlt,
  FaPhone,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Navbar from "./Navbar";
import "./AdminDashboard.css";
import { apiUrl, assetUrl } from "../config/api";

const AdminDashboard = ({ onLogout, theme, setTheme }) => {
  const [contacts, setContacts] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [resumeInfo, setResumeInfo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [stats, setStats] = useState({
    totalContacts: 0,
    unreadContacts: 0,
    totalProjects: 0,
    resumeDownloads: 0,
  });

  useEffect(() => {
    fetchContacts();
    fetchPortfolio();
    fetchResumeInfo();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(apiUrl("/api/contact"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setContacts(data);
      setStats((prev) => ({
        ...prev,
        totalContacts: data.length,
        unreadContacts: data.filter((c) => c.status === "unread").length,
      }));
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const fetchPortfolio = async () => {
    try {
      const response = await fetch(apiUrl("/api/portfolio"));
      const data = await response.json();
      setPortfolio(data);
      setStats((prev) => ({
        ...prev,
        totalProjects: data.projects?.length || 0,
      }));
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    }
  };

  const fetchResumeInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(apiUrl("/api/upload/resume"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setResumeInfo(data);
    } catch (error) {
      console.error("Error fetching resume info:", error);
    }
  };

  const handleDeleteContact = async (contactId) => {
    confirmAlert({
      title: "Delete Message",
      message: "Are you sure you want to delete this message?",
      buttons: [
        {
          label: "Yes, Delete",
          onClick: async () => {
            try {
              const token = localStorage.getItem("token");
              const response = await fetch(
                apiUrl(`/api/contact/${contactId}`),
                {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                },
              );

              if (response.ok) {
                setContacts((prev) => prev.filter((c) => c._id !== contactId));
                setStats((prev) => ({
                  ...prev,
                  totalContacts: prev.totalContacts - 1,
                }));
                toast.success("Message deleted successfully!");
              } else {
                const data = await response.json();
                toast.error(data.message || "Failed to delete message");
              }
            } catch (error) {
              console.error("Error deleting contact:", error);
              toast.error("Failed to delete message");
            }
          },
        },
        {
          label: "Cancel",
          onClick: () => {},
        },
      ],
    });
  };

  const handleMarkAsRead = async (contactId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        apiUrl(`/api/contact/${contactId}/read`),
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        setContacts((prev) =>
          prev.map((c) => (c._id === contactId ? { ...c, status: "read" } : c)),
        );
        setStats((prev) => ({
          ...prev,
          unreadContacts: Math.max(0, prev.unreadContacts - 1),
        }));
      }
    } catch (error) {
      console.error("Error marking contact as read:", error);
    }
  };

  const handleViewMessage = (contact) => {
    setSelectedContact(contact);
    if (contact.status === "unread") {
      handleMarkAsRead(contact._id);
    }
  };

  const handleCloseModal = () => {
    setSelectedContact(null);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") {
      toast.error("Please select a PDF file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    toast.info("Uploading...");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch(apiUrl("/api/upload/resume"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setResumeInfo(data);
        await fetchPortfolio();
        toast.success("Upload successful! Resume URL auto-saved to portfolio.");
      } else {
        toast.error(`Upload failed: ${data.message}`);
      }
    } catch (error) {
      toast.error(`Upload error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResume = async () => {
    confirmAlert({
      title: "Delete Resume",
      message: "Are you sure you want to delete the resume?",
      buttons: [
        {
          label: "Yes, Delete",
          onClick: async () => {
            try {
              const token = localStorage.getItem("token");
              const response = await fetch(
                apiUrl("/api/upload/resume"),
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );

              const data = await response.json();
              if (data.success) {
                setResumeInfo(null);
                await fetchPortfolio();
                toast.success("Resume deleted successfully!");
              } else {
                toast.error(`Delete failed: ${data.message}`);
              }
            } catch (error) {
              toast.error(`Delete error: ${error.message}`);
            }
          },
        },
        {
          label: "Cancel",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <div className="admin-dashboard">
      {/* Navbar with Theme Toggle */}
      <Navbar
        onLogout={onLogout}
        userRole="admin"
        theme={theme}
        setTheme={setTheme}
      />

      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <button onClick={onLogout} className="dashboard-logout">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FaEnvelope />
          </div>
          <div className="stat-info">
            <h3>Total Messages</h3>
            <p className="stat-number">{stats.totalContacts}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <FaEye />
          </div>
          <div className="stat-info">
            <h3>Unread Messages</h3>
            <p className="stat-number">{stats.unreadContacts}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <FaProjectDiagram />
          </div>
          <div className="stat-info">
            <h3>Total Projects</h3>
            <p className="stat-number">{stats.totalProjects}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">
            <FaDownload />
          </div>
          <div className="stat-info">
            <h3>Resume Downloads</h3>
            <p className="stat-number">{stats.resumeDownloads}</p>
          </div>
        </div>
      </div>

      {/* Resume Management Section */}
      <div className="resume-management-section">
        <h2>
          <FaFilePdf /> Resume Management
        </h2>

        <div className="resume-card full-width-card">
          <div className="card-header">
            <FaFilePdf className="card-icon" />
            <h3>Current Resume</h3>
          </div>
          <div className="card-body">
            {resumeInfo?.hasResume && resumeInfo.fileExists ? (
              <>
                <div className="resume-info">
                  <p className="resume-filename">{resumeInfo.filename}</p>
                  <p className="resume-status">✅ Active</p>
                </div>

                {/* PDF Preview */}
                <div className="pdf-preview-container">
                  <iframe
                    src={assetUrl(resumeInfo.resumeUrl)}
                    title="Resume Preview"
                    className="pdf-preview"
                  />
                </div>

                <div className="resume-actions">
                  <label className="action-btn upload-btn-inline">
                    <FaUpload /> Upload New
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      disabled={uploading}
                      style={{ display: "none" }}
                    />
                  </label>
                  <a
                    href={assetUrl(resumeInfo.resumeUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-btn view-btn"
                  >
                    <FaExternalLinkAlt /> Open Full
                  </a>
                  <a
                    href={assetUrl(resumeInfo.resumeUrl)}
                    download
                    className="action-btn download-btn"
                  >
                    <FaDownload /> Download
                  </a>
                  <button
                    onClick={handleDeleteResume}
                    className="action-btn delete-btn"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="no-resume">No resume uploaded yet</p>
                <p className="hint">
                  Upload a resume to make it available for download
                </p>
                <label className="upload-btn upload-btn-large">
                  <FaUpload /> Upload Resume
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    disabled={uploading}
                    style={{ display: "none" }}
                  />
                </label>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="contacts-section">
        <h2>Contact Messages</h2>
        <div className="contacts-table-container">
          <div className="contacts-table-wrapper">
            {contacts.length === 0 ? (
              <div className="no-data">
                <FaEnvelope
                  style={{
                    fontSize: "3rem",
                    marginBottom: "15px",
                    opacity: 0.5,
                  }}
                />
                <p>No messages yet</p>
                <p className="hint" style={{ marginTop: "10px" }}>
                  When someone submits the contact form, it will appear here
                </p>
              </div>
            ) : (
              <table className="contacts-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact, idx) => (
                    <tr
                      key={contact._id || idx}
                      className={contact.status === "unread" ? "unread" : ""}
                      onClick={() => handleViewMessage(contact)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </td>
                      <td>{contact.name}</td>
                      <td>
                        <a
                          href={`mailto:${contact.email}`}
                          style={{ color: "inherit" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {contact.email}
                        </a>
                      </td>
                      <td>{contact.phone || "-"}</td>
                      <td>{contact.subject}</td>
                      <td className="message-cell">{contact.message}</td>
                      <td>
                        <span className={`status-badge ${contact.status}`}>
                          {contact.status === "unread" ? "Unread" : "Read"}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="contact-actions">
                          {contact.status === "unread" && (
                            <button
                              onClick={() => handleMarkAsRead(contact._id)}
                              className="action-btn-icon mark-read-btn"
                              title="Mark as Read"
                            >
                              <FaCheckCircle />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteContact(contact._id)}
                            className="action-btn-icon delete-btn-icon"
                            title="Delete Message"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Message View Modal */}
      {selectedContact && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <FaEnvelope /> Message Details
              </h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="message-detail-row">
                <label>From:</label>
                <span>{selectedContact.name}</span>
              </div>
              <div className="message-detail-row">
                <label>Email:</label>
                <a href={`mailto:${selectedContact.email}`}>
                  {selectedContact.email}
                </a>
              </div>
              <div className="message-detail-row">
                <label>Phone:</label>
                <span>{selectedContact.phone || "Not provided"}</span>
              </div>
              <div className="message-detail-row">
                <label>Subject:</label>
                <span>{selectedContact.subject}</span>
              </div>
              <div className="message-detail-row">
                <label>Date:</label>
                <span>
                  {new Date(selectedContact.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="message-detail-row full-width">
                <label>Message:</label>
                <div className="message-content">{selectedContact.message}</div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="close-btn" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
