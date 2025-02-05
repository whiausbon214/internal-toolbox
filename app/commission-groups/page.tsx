"use client";

import React, { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form, InputGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { fetchGroups, createGroup, updateGroup, deleteGroup } from "../../lib/forwardEmail";


const DOMAIN_NAME = "list.aobgagents.com";

const CommissionGroupsPage = () => {
  const [groups, setGroups] = useState<{ id: string; name: string; emails: string[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editGroupId, setEditGroupId] = useState<string | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [groupData, setGroupData] = useState({ name: "", emails: ["", "", ""] });
  const [popoverText, setPopoverText] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    async function loadGroups() {
      try {
        const data = await fetchGroups();
        setGroups(data.map((group: any) => ({ id: group.id, name: group.name, emails: group.recipients })));
      } catch (error) {
        setError("Failed to fetch groups.");
      } finally {
        setLoading(false);
      }
    }
    loadGroups();
  }, []);

  const handleChange = (index: number, value: string) => {
    const newEmails = [...groupData.emails];
    newEmails[index] = value;
    setGroupData({ ...groupData, emails: newEmails });
  };

  const addEmailField = () => {
    if (groupData.emails.length < 10) {
      setGroupData({ ...groupData, emails: [...groupData.emails, ""] });
    }
  };

  const removeEmailField = (index: number) => {
    const newEmails = groupData.emails.filter((_, i) => i !== index);
    setGroupData({ ...groupData, emails: newEmails });
  };

  const openAddModal = () => {
    setGroupData({ name: "", emails: ["", "", ""] });
    setShowModal(true);
  };

  const openEditModal = (group: { id: string; name: string; emails: string[] }) => {
    setGroupData({ name: group.name, emails: [...group.emails, ...Array(10 - group.emails.length).fill("")] });
    setEditGroupId(group.id);
    setShowEditModal(true);
  };

  const openDeleteModal = (id: string) => {
    setGroupToDelete(id);
    setDeleteConfirmation("");
    setShowDeleteModal(true);
  };

  const [showHelpModal, setShowHelpModal] = useState(false);


  const handleSubmit = async () => {
    const validEmails = groupData.emails.filter(email => email.trim() !== "");

    if (groupData.name && validEmails.length) {
      if (editGroupId !== null) {
        await updateGroup(editGroupId, groupData.name, validEmails);
        setGroups(groups.map(group => (group.id === editGroupId ? { ...group, name: groupData.name, emails: validEmails } : group)));
        setShowEditModal(false);
      } else {
        const newGroup = await createGroup(groupData.name, validEmails);
        if (newGroup) {
          setGroups([...groups, { id: newGroup.id, name: newGroup.name, emails: validEmails }]);
        }
        setShowModal(false);
      }
      setGroupData({ name: "", emails: ["", "", ""] });
      setEditGroupId(null);
    }
  };

  const handleDelete = async () => {
    if (groupToDelete !== null && deleteConfirmation === "delete") {
      const success = await deleteGroup(groupToDelete);
      if (success) {
        setGroups(groups.filter(group => group.id !== groupToDelete));
      }
      setShowDeleteModal(false);
      setGroupToDelete(null);
    }
  };

  const copyToClipboard = (alias: string) => {
    navigator.clipboard.writeText(`${alias}@${DOMAIN_NAME}`);
    setPopoverText({ ...popoverText, [alias]: "Copied!" });
    setTimeout(() => setPopoverText({ ...popoverText, [alias]: "Click to copy" }), 2000);
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-2">Commission Distribution Groups</h1>
      <p className="text-muted">
        The Commission Distribution Groups feature allows users to create email forwarding groups for sending commission statements. This is useful when an agency requires commission statements to be sent to more than two email addresses.
      </p>
      <div className="d-flex align-items-center mb-4">
        <Button variant="primary" onClick={openAddModal}>Add New Group</Button>
        <Button variant="link" size="lg" onClick={() => setShowHelpModal(true)}>
          <i className="bi bi-question-circle"></i>
        </Button>
      </div>


      {error && <p className="text-danger">{error}</p>}

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Emails</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map(group => (
              <tr key={group.id}>
                <td>
                  <OverlayTrigger placement="top" overlay={<Tooltip>{popoverText[group.name] || "Click to copy"}</Tooltip>}>
                    <Button variant="link" className="p-0 text-primary" onClick={() => copyToClipboard(group.name)}>
                      {group.name}@{DOMAIN_NAME}
                    </Button>
                  </OverlayTrigger>
                </td>
                <td>{group.emails.join(", ")}</td>
                <td className="text-nowrap">
                  <div className="d-flex gap-2 flex-md-row flex-column">
                    <Button variant="warning" size="sm" onClick={() => openEditModal(group)}>
                      <i className="bi bi-pencil-fill"></i>
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => openDeleteModal(group.id)}>
                      <i className="bi bi-trash-fill"></i>
                    </Button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Add / Edit Group Modal */}
      <Modal show={showModal || showEditModal} onHide={() => (showModal ? setShowModal(false) : setShowEditModal(false))}>
        <Modal.Header closeButton>
          <Modal.Title>{editGroupId ? "Edit Group" : "Add New Group"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>List Name</Form.Label>
              <InputGroup>
                <Form.Control type="text" value={groupData.name} onChange={(e) => setGroupData({ ...groupData, name: e.target.value })} placeholder="Enter list name" />
                <InputGroup.Text>@{DOMAIN_NAME}</InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Emails</Form.Label>
              {groupData.emails.map((email, index) => (
                <InputGroup key={index} className="mb-2">
                  <Form.Control type="email" value={email} onChange={(e) => handleChange(index, e.target.value)} placeholder="Enter email" />
                  {index >= 3 && <Button variant="danger" size="sm" onClick={() => removeEmailField(index)}><i className="bi bi-trash-fill"></i>
                  </Button>}
                </InputGroup>
              ))}
              {groupData.emails.length < 10 && <Button variant="success" size="sm" onClick={addEmailField}>+ Add Email</Button>}
            </Form.Group>
          </Form>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowModal(false); setShowEditModal(false); }}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>Save Group</Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-danger fw-bold">Are you sure you want to delete this group? This action cannot be undone.</p>
          <p>To confirm, type <strong>"delete"</strong> below:</p>
          <Form.Group>
            <Form.Control
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Type 'delete' to confirm"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleteConfirmation !== "delete"}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Help Instructions Modal */}
      <Modal show={showHelpModal} onHide={() => setShowHelpModal(false)}>
        <Modal.Header>
          <Modal.Title>How to Use the Commission Distribution Groups Feature</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Adding a New Distribution Group</strong></p>
          <ul>
            <li className="mb-1">Click the "Add New Group" button.</li>
            <li className="mb-1">A modal will appear for creating a new distribution group.</li>
            <li className="mb-1">Enter a name in "List Name" (e.g., Agency Name, ID). The system appends "@list.aobgagents.com" automatically.</li>
            <li className="mb-1">Enter up to 10 emails for receiving commission statements. Use "+ Add Email" to add more fields.</li>
            <li className="mb-1">Click "Save Group" to finalize.</li>
          </ul>

          <p><strong>Using a Distribution Group</strong></p>
          <ul>
            <li>The new group will appear in the table after saving.</li>
            <li>Click the group name to copy its email address.</li>
            <li>Paste it into the E123 Email 2 field.</li>
          </ul>

          <p><strong>Editing & Deleting a Group</strong></p>
          <ul>
            <li>Click the <i className="bi bi-pencil-fill"></i> (Edit) button to modify a group.</li>
            <li>Click the <i className="bi bi-trash-fill"></i> (Delete) button to remove a group.</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={() => setShowHelpModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>


    </Container>
  );
};

export default CommissionGroupsPage;
