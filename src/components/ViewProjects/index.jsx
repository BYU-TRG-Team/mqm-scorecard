import React, { useState, useEffect } from 'react';
import './ViewProjects.css';
import { useHistory } from 'react-router-dom';
import API from '../../api';
import { GlobalContext } from '../../store';
import ConfirmationModal from '../ConfirmationModal';

const ViewProjects = () => {
  const [state] = React.useContext(GlobalContext);
  const [error, setError] = useState('');
  const [projects, setProjects] = useState([]);
  const history = useHistory();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState(() => {});
  const [rejectCallback, setRejectCallback] = useState(() => {});
  const [confirmationModalMessage, setConfirmationModalMessage] = useState('');

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

  const getProjects = () => {
    API.get(`/api/projects`)
      .then((response) => {
        setProjects(response.data.projects);
      })
      .catch((err) => {
        if (err.response.data) {
          setError(err.response.data.message);
        }
      });
  };

  const deleteProject = (project) => {
    const confirmCallback = () => API.delete(`/api/project/${project.project_id}`)
      .then(getProjects)
      .catch((err) => {
        if (err.response.data) {
          setError(err.response.data.message);
        }
      });

    invokeConfirmationModal(
      confirmCallback,
      () => {},
      `Are you sure you want to remove the project "${project.name}"?`,
    );
  };

  const redirectToEdit = (projectId) => {
    history.push(`/${state.token.role}/edit-project/${projectId}`);
  };

  const buttons = (project) => (
    state.token.role === 'user'
      ? (
        <button type="button" className="view-projects__button" onClick={() => history.push(`/editor/${project.project_id}`)}>
          Open
        </button>
      )
      : (
        <div>
          <button type="button" className="view-projects__button view-projects__button--red" onClick={() => deleteProject(project)}>
            Delete
          </button>
          <button type="button" className="view-projects__button" onClick={() => history.push(`/editor/${project.project_id}`)}>
            Open
          </button>
          <button type="button" className="view-projects__button" onClick={() => redirectToEdit(project.project_id)}>
            Edit
          </button>
        </div>
      )
  );
  useEffect(getProjects, []);

  const mappedProjects = projects.map((project) => {
    const status = project.finished ? 'finished' : `not finished - current segment: ${project.last_segment}`;
    const { name } = project;
    // eslint-disable-next-line camelcase
    const projectId = project.project_id;
    return (
      <tr className="view-projects__row" key={projectId}>
        <td className="view-projects__table-cell">{ projectId }</td>
        <td className="view-projects__table-cell">{ name }</td>
        <td className="view-projects__table-cell">{ status }</td>
        <td className="view-projects__table-cell">
          { buttons(project) }
        </td>
      </tr>
    );
  });

  return (
    <div>
      <ConfirmationModal confirmCallback={confirmCallback} rejectCallback={rejectCallback} message={confirmationModalMessage} className={`${showConfirmationModal ? '' : 'confirmation-modal--hide'}`} />
      <h2 className="view-projects__heading">View projects</h2>
      {
        state.token.role !== 'user'
        && (
        <a className="view-projects__download-button" role="button" href="/api/issues" download="typology">
          Export Typology (XML)
        </a>
        )
      }
      { error && <span className="view-projects__error">{ error }</span> }
      <div className="view-projects__table-container">
        <table className="view-projects__table">
          <tbody>
            <tr>
              <th className="view-projects__table-cell-header">Id</th>
              <th className="view-projects__table-cell-header">Project Name</th>
              <th className="view-projects__table-cell-header">Status</th>
              <th className="view-projects__table-cell-header">Actions</th>
            </tr>
            { mappedProjects }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewProjects;
