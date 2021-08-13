import React, { useEffect, useState } from 'react';
import './Editor.css';
import { useParams } from 'react-router-dom';
import API from '../../api';
import About from '../About';
import Help from '../Help';
import Specifications from '../Specifications';
import Scorecard from '../Scorecard';
import Reports from '../Reports';

const Editor = () => {
  const { projectId } = useParams();

  // State
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [project, setProject] = useState({});
  const [segments, setSegments] = useState([]);
  const [report, setReport] = useState({});
  const [issues, setIssues] = useState({});
  const [tabIndex, setTabIndex] = useState(0);
  const [highlightEnabled, setHighlightEnabled] = useState(false);
  const [highlightInstance, setHighlightInstance] = useState('');

  const getProject = () => API.get(`/api/project/${projectId}`)
    .then((response) => {
      const {
        project, segments, issues, report, score
      } = response.data;
      setProject(project);
      setSegments(segments);
      setIssues(issues);
      setReport(report);
      setScore(score);
      setError('');
    })
    .catch((err) => {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      }
    });

  const updateProject = (data) => API.put(`/api/project/${projectId}`, data)
    .then(getProject)
    .catch((err) => {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      }
    });

  const deleteSegmentError = (segmentErrorId) => API.delete(`/api/segment/error/${segmentErrorId}`)
    .then(getProject)
    .catch((err) => {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      }
    });

  const createSegmentError = (segmentId, data) => API.post(`/api/segment/${segmentId}/error/`, data)
    .then(getProject)
    .catch((err) => {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      }
    });

  const flashSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const contentList = [
    <Scorecard
      segments={segments}
      project={project}
      updateProject={updateProject}
      flashSuccessMessage={flashSuccessMessage}
      highlightEnabled={highlightEnabled}
      setHighlightEnabled={setHighlightEnabled}
      deleteSegmentError={deleteSegmentError}
      issues={issues}
      setHighlightInstance={setHighlightInstance}
      highlightInstance={highlightInstance}
      createSegmentError={createSegmentError}
    />,
    <Specifications specifications={project.specifications} />,
    <Reports issues={issues} report={report} projectId={projectId} projectName={project.name} />,
    <Help />,
    <About />,
  ];

  useEffect(getProject, []);

  return (
    <div className="editor">
      <div className="editor__header">
        <h1 className="editor__heading">
          Editor:
          {' '}
          { project.name }
        </h1>
        { successMessage && <span className="editor__success">{ successMessage }</span> }
        { error && <span className="editor__error">{ error }</span> }
        <div className="editor__buttons">
          { showScore && (
          <span className="editor__score">
            Overall Quality Score:
            {' '}
            <b>
              {
                score
              }
            </b>
            ,  Note: OQS is not a percentage
          </span>
          )}
          <button className="editor__button" type="button" onClick={() => setShowScore(!showScore)}>
            {showScore ? 'Hide' : 'View'}
            {' '}
            Scores
          </button>
          <button className="editor__button" type="button" onClick={() => updateProject({ finished: !project.finished })}>
            Mark project as
            { project.finished ? ' not finished' : ' finished' }
          </button>
        </div>
      </div>
      <div className="editor__container">
        <ul role="tablist" className="editor__tabs">
          <li className={`editor__tab ${tabIndex === 0 ? 'editor__tab--selected' : ''}`} role="tab" onClick={() => setTabIndex(0)}>Scorecard</li>
          <li className={`editor__tab ${tabIndex === 1 ? 'editor__tab--selected' : ''}`} role="tab" onClick={() => setTabIndex(1)}>Project specifications</li>
          <li className={`editor__tab ${tabIndex === 2 ? 'editor__tab--selected' : ''}`} role="tab" onClick={() => setTabIndex(2)}>Reports</li>
          <li className={`editor__tab ${tabIndex === 3 ? 'editor__tab--selected' : ''}`} role="tab" onClick={() => setTabIndex(3)}>Training and help</li>
          <li className={`editor__tab ${tabIndex === 4 ? 'editor__tab--selected' : ''}`} role="tab" onClick={() => setTabIndex(4)}>About</li>
        </ul>
        <div className="editor_content">
          {
            contentList[tabIndex]
          }
        </div>
      </div>
    </div>
  );
};

export default Editor;
