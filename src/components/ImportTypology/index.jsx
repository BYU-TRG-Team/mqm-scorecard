import React, { useState, useRef } from 'react';
import './ImportTypology.css';
import API from '../../api';

const ImportTypology = () => {
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [typologyFile, setTypologyFile] = useState('');
  const typologyFileRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('typologyFile', typologyFile);

    return API.post('/api/issues', formData)
      .then((response) => {
        setError('');
        setSuccessMessage(response.data.message);
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          setError(err.response.data.message);
        }
      });
  };

  return (
    <div className="import-typology">
      <h2 className="import-typology__heading">Import Typology</h2>
      { error && <span className="import-typology__error">{ error }</span> }
      { successMessage && <span className="import-typology__success">{ successMessage }</span> }
      <div className="import-typology__table-container">
        <form onSubmit={handleSubmit}>
          <table className="import-typology__table">
            <tbody>
              <tr className="import-typology__row">
                <td className="import-typology__table-cell" style={{ width: '200px' }}>Typology File</td>
                <td className="import-typology__table-cell">
                  <input type="file" required ref={typologyFileRef} onChange={(e) => { setTypologyFile(e.target.files[0]); }} />
                </td>
              </tr>
              <tr className="import-typology__row">
                <td className="import-typology__table-cell" colSpan="2"><input name="submit" value="Submit" type="submit" /></td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
};

export default ImportTypology;
