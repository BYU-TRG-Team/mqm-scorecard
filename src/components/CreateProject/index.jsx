import React, { useState, useRef } from 'react';
import API from '../../api';
import './CreateProject.css';

const CreateProject = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [bitextFile, setBitextFile] = useState(null);
  const bitextFileRef = useRef(null);

  const [metricFile, setMetricFile] = useState(null);
  const metricFileRef = useRef(null);

  const [specificationsFile, setSpecificationsFile] = useState(null);
  const specificationsFileRef = useRef(null);

  const resetForm = () => {
    setBitextFile(null);
    setMetricFile(null);
    setSpecificationsFile(null);
    setName('');
    setError('');

    bitextFileRef.current.value = '';
    metricFileRef.current.value = '';
    specificationsFileRef.current.value = '';
  };

  const flashSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 5500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('bitextFile', bitextFile);
    formData.append('metricFile', metricFile);
    formData.append('specificationsFile', specificationsFile);
    formData.append('name', name);

    await API.post('/api/project', formData)
      .then((response) => {
        const message = response.data.message ? response.data.message : 'Project created successfully';
        flashSuccessMessage(message);
        resetForm();
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          setError(err.response.data.message);
        }
      });
  };

  return (
    <div className="create-project">
      <h2 className="create-project__heading">Create Project</h2>
      { error && <span className="create-project__error">{ error }</span> }
      { successMessage && <span className="create-project__success">{ successMessage }</span> }
      <div className="create-project__table-container">
        <form onSubmit={handleSubmit}>
          <table className="create-project__table">
            <tbody>
              <tr className="create-project__row">
                <td className="create-project__table-cell" style={{ width: '200px' }}>Project name</td>
                <td className="create-project__table-cell">
                  <input type="text" required value={name} onChange={(e) => { setName(e.target.value); }} />
                </td>
              </tr>
              <tr className="create-project__row">
                <td className="create-project__table-cell" style={{ width: '200px' }}>Bi-text file (tab-delimited, UTF-8</td>
                <td className="create-project__table-cell">
                  <input type="file" required ref={bitextFileRef} onChange={(e) => { setBitextFile(e.target.files[0]); }} />
                </td>
              </tr>
              <tr className="create-project__row">
                <td className="create-project__table-cell" style={{ width: '200px' }}>Specifications file (optional)</td>
                <td className="create-project__table-cell">
                  <input type="file" ref={specificationsFileRef} onChange={(e) => { setSpecificationsFile(e.target.files[0]); }} />
                </td>
              </tr>
              <tr className="create-project__row">
                <td className="create-project__table-cell" style={{ width: '200px' }}>Metric file</td>
                <td className="create-project__table-cell">
                  <input type="file" required ref={metricFileRef} onChange={(e) => { setMetricFile(e.target.files[0]); }} />
                </td>
              </tr>
              <tr className="create-project__row">
                <td className="create-project__table-cell" colSpan="2"><input name="submit" value="Submit" type="submit" /></td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
