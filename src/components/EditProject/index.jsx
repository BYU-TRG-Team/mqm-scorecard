import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../../api";
import "./EditProject.css";
import ConfirmationModal from "../ConfirmationModal";

const EditProject = () => {
  const { id } = useParams();

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState(() => {});
  const [rejectCallback, setRejectCallback] = useState(() => {});
  const [confirmationModalMessage, setConfirmationModalMessage] = useState("");
  const [hasErrors, setHasErrors] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [userError, setUserError] = useState("");
  const [name, setName] = useState("");
  const [projectUsers, setProjectUsers] = useState([]);
  const [username, setUsername] = useState("");

  const [bitextFile, setBitextFile] = useState(null);
  const [currentBitextFile, setCurrentBitextFile] = useState("");
  const bitextFileRef = useRef(null);

  const [metricFile, setMetricFile] = useState(null);
  const [currentMetricFile, setCurrentMetricFile] = useState("");
  const metricFileRef = useRef(null);

  const [specificationsFile, setSpecificationsFile] = useState(null);
  const specificationsFileRef = useRef(null);
  const [currentSpecificationsFile, setCurrentSpecificationsFile] = useState("");

  const resetProjectForm = () => {
    setBitextFile(null);
    setMetricFile(null);
    setSpecificationsFile(null);
    setError("");
    setUsername("");

    bitextFileRef.current.value = "";
    metricFileRef.current.value = "";
    specificationsFileRef.current.value = "";
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

  const flashSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage("");
    }, 5500);
  };

  const getProjectInfo = () => API.get(`/api/project/${id}`)
    .then((response) => {
      const { project, users, segments } = response.data;
      const hasErrors = segments.filter((seg) => seg.sourceErrors.length > 0 || seg.targetErrors.length > 0).length > 0;

      if (project.name) {
        setName(project.name);
      }

      if (project.bitext_file) {
        setCurrentBitextFile(project.bitext_file);
      }

      if (project.metric_file) {
        setCurrentMetricFile(project.metric_file);
      }

      if (project.specifications_file) {
        setCurrentSpecificationsFile(project.specifications_file);
      }

      setHasErrors(hasErrors);
      setProjectUsers(users);
    })
    .catch((err) => {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      }
    });

  const deleteUserFromProject = (user) => {
    const confirmCallback = () => API.delete(`/api/project/${id}/user/${user.user_id}`)
      .then(() => {
        getProjectInfo();
        setUserError("");
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          setUserError(err.response.data.message);
        }
      });

    invokeConfirmationModal(
      confirmCallback,
      () => {},
      `Are you sure you want to remove the user "${user.username}" from the project?`,
    );
  };

  const addNewUser = () => {
    if (username.length === 0) {
      setUserError("Username is blank");
      return;
    }

    API.post(`/api/project/${id}/user`, { username })
      .then(() => {
        getProjectInfo();
        setUserError("");
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          setUserError(err.response.data.message);
        }
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (bitextFile) formData.append("bitextFile", bitextFile);
    if (metricFile) formData.append("metricFile", metricFile);
    if (specificationsFile) formData.append("specificationsFile", specificationsFile);
    if (name) formData.append("name", name);

    API.put(`/api/project/${id}`, formData)
      .then(async (response) => {
        await getProjectInfo();
        const message = response.data && response.data.message ? response.data.message : "Project updated successfully";
        flashSuccessMessage(message);
        resetProjectForm();
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          setError(err.response.data.message);
        }
      });
  };

  const mappedUsers = (
    <ul style={{ padding: 0 }}>
      {
            projectUsers.map((user) => (
              <li style={{ padding: 0, listStyle: "none" }}>
                {user.username}
                &nbsp;
                <button type="button" onClick={() => deleteUserFromProject(user)} className="edit-project__delete-button">
                  Delete
                </button>
              </li>
            ))
        }
    </ul>
  );

  useEffect(getProjectInfo, []);

  return (
    <div>
      <ConfirmationModal confirmCallback={confirmCallback} rejectCallback={rejectCallback} message={confirmationModalMessage} className={`${showConfirmationModal ? "" : "confirmation-modal--hide"}`} />
      <h2 className="edit-project__heading">Edit Project</h2>
      { successMessage && <span className="edit-project__success">{ successMessage }</span> }
      { error && <span className="edit-project__error">{ error }</span> }
      { hasErrors ? <div className="edit-project__warning">NOTE: Errors have been assigned to segments in this project. Changing the bi-text or metric files is not possible until all errors are removed.</div> : ""}
      <div className="edit-project__table-container">
        <form onSubmit={handleSubmit}>
          <table className="edit-project__table">
            <tbody>
              <tr className="edit-project__row">
                <td className="edit-project__table-cell" style={{ width: "200px" }}>Project name</td>
                <td className="edit-project__table-cell">
                  <input type="text" value={name} onChange={(e) => { setName(e.target.value); }} />
                </td>
              </tr>
              <tr className="edit-project__row">
                <td className="edit-project__table-cell" style={{ width: "200px" }}>
                  Update Bi-text file (tab-delimited, UTF-8)
                  <br />
                  <br />
                  {`Current file name: ${currentBitextFile}`}
                </td>
                <td className="edit-project__table-cell">
                  <input type="file" ref={bitextFileRef} onChange={(e) => { setBitextFile(e.target.files[0]); }} disabled={hasErrors} />
                </td>
              </tr>
              <tr className="edit-project__row">
                <td className="edit-project__table-cell" style={{ width: "200px" }}>
                  Update Specifications file
                  <br />
                  <br />
                  {`Current file name: ${currentSpecificationsFile}`}
                </td>
                <td className="edit-project__table-cell">
                  <input type="file" ref={specificationsFileRef} onChange={(e) => { setSpecificationsFile(e.target.files[0]); }} />
                </td>
              </tr>
              <tr className="edit-project__row">
                <td className="edit-project__table-cell" style={{ width: "200px" }}>
                  Update Metric file
                  <br />
                  <br />
                  {`Current file name: ${currentMetricFile}`}
                </td>
                <td className="edit-project__table-cell">
                  <input type="file" ref={metricFileRef} onChange={(e) => { setMetricFile(e.target.files[0]); }} disabled={hasErrors} />
                </td>
              </tr>
              <tr className="edit-project__row">
                <td className="edit-project__table-cell" colSpan="2"><input name="submit" value="Update" type="submit" /></td>
              </tr>
            </tbody>
          </table>
        </form>

        <table className="edit-project__table edit-project__table--second">
          <tbody>
            <tr className="edit-project__row">
              <td className="edit-project__table-cell" style={{ width: "200px" }}>
                Users
              </td>
              <td className="edit-project__table-cell">
                { mappedUsers }
              </td>
            </tr>
            <tr className="edit-project__row">
              <td className="edit-project__table-cell" style={{ width: "200px" }}>
                Add user (username)
              </td>
              <td className="edit-project__table-cell">
                <input type="text" value={username} onChange={(e) => { setUsername(e.target.value); }} />
                <button type="button" onClick={addNewUser}>Submit</button>
              </td>
            </tr>
          </tbody>
        </table>
        { userError && <span className="edit-project__error" style={{ marginTop: "10px" }}>{ userError }</span> }
      </div>
    </div>
  );
};

export default EditProject;
