import React, { useEffect, useState } from "react";
import "./ManageUsers.css";
import API from "../../api";
import ConfirmationModal from "../ConfirmationModal";

const ManageUsers = () => {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState(() => {});
  const [rejectCallback, setRejectCallback] = useState(() => {});
  const [confirmationModalMessage, setConfirmationModalMessage] = useState("");

  const flashSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage("");
    }, 5500);
  };

  const invokeConfirmationModal = (newConfirmCallback, newRejectCallback, message) => {
    const newConfirmCallbackWrapper = async () => {
      await newConfirmCallback();
      setShowConfirmationModal(false);
    };

    const newRejectCallbackWrapper = async () => {
      await newRejectCallback();
      setShowConfirmationModal(false);
    };

    setConfirmCallback(() => newConfirmCallbackWrapper);
    setRejectCallback(() => newRejectCallbackWrapper);
    setConfirmationModalMessage(message);
    setShowConfirmationModal(true);
  };

  const updateUsers = () => {
    setError("");
    return API.get("/api/users")
      .then((response) => {
        setUsers(response.data.users);
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          setError(error.response.data.message);
        }
      });
  };

  const deleteUser = (user) => {
    const confirmCallback = () => API.delete(`/api/user/${user.user_id}`)
      .then(updateUsers)
      .catch((err) => {
        if (err.response && err.response.data) {
          setError(error.response.data.message);
        }
      });

    invokeConfirmationModal(
      confirmCallback,
      () => {},
      `Are you sure you want to remove the user "${user.username}"?`,
    );
  };

  const deleteAllUserProjects = (user) => {
    const confirmCallback = () => API.delete(`/api/user/${user.user_id}/projects`)
      .then(async () => {
        await updateUsers();
        flashSuccessMessage(`Successfully unassigned all projects for user "${user.username}"`);
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          setError(error.response.data.message);
        }
      });

    invokeConfirmationModal(
      confirmCallback,
      () => {},
      `Are you sure you want to unassign all projects for the user "${user.username}"?`,
    );
  };

  const updateRole = (userId, roleId) => {
    API.patch(`/api/user/${userId}`, { roleId })
      .then(updateUsers)
      .catch((err) => {
        if (err.response && err.response.data) {
          setError(error.response.data.message);
        }
      });
  };

  useEffect(updateUsers, []);

  const mappedUsers = users.map((user) => (
    <tr className="manage-users__row" key={user.username}>
      <td className="manage-users__table-cell">{user.user_id}</td>
      <td className="manage-users__table-cell">{user.name}</td>
      <td className="manage-users__table-cell">{user.username}</td>
      <td className="manage-users__table-cell">{user.email}</td>
      <td className="manage-users__table-cell">{user.role_name}</td>
      <td className="manage-users__table-cell">
        <button type="button" onClick={() => deleteUser(user)} className="manage-user__button manage-user__button--red">
          Delete
        </button>
        <button type="button" onClick={() => deleteAllUserProjects(user)} className="manage-user__button manage-user__button--red">
          Unassign all projects
        </button>
        <button type="button" onClick={() => updateRole(user.user_id, 1)} className="manage-user__button">
          Set User
        </button>
        <button type="button" onClick={() => updateRole(user.user_id, 2)} className="manage-user__button">
          Set Admin
        </button>
        <button type="button" onClick={() => updateRole(user.user_id, 3)} className="manage-user__button">
          Set Superadmin
        </button>
      </td>
    </tr>
  ));

  return (
    <div className="manage-users">
      <ConfirmationModal confirmCallback={confirmCallback} rejectCallback={rejectCallback} message={confirmationModalMessage} className={`${showConfirmationModal ? "" : "confirmation-modal--hide"}`} />
      <h2 className="manage-users__heading">Manage Users</h2>
      { successMessage && <span className="manage-users__success">{ successMessage }</span> }
      { error && <span className="manage-users__error">{ error }</span> }
      <div className="manage-users__table-container">
        <table className="manage-users__table">
          <tbody>
            <tr>
              <th className="manage-users__table-cell-header">Id</th>
              <th className="manage-users__table-cell-header">Real name</th>
              <th className="manage-users__table-cell-header">User name</th>
              <th className="manage-users__table-cell-header">Email</th>
              <th className="manage-users__table-cell-header">Role</th>
              <th className="manage-users__table-cell">Actions</th>
            </tr>
            { mappedUsers }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
