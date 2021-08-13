import React, { useState } from 'react';
import './Recover.css';
import { useHistory, useParams } from 'react-router-dom';
import API from '../../api';
import { GlobalContext } from '../../store';
import { parseToken } from '../../utils';

const Recover = () => {
  const { recoveryToken } = useParams();
  // eslint-disable-next-line no-unused-vars
  const [state, dispatch] = React.useContext(GlobalContext);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [duplicatePassword, setDuplicatePassword] = useState('');
  const history = useHistory();

  const onSubmit = (e) => {
    e.preventDefault();

    if (recoveryToken) {
      if (password !== duplicatePassword) {
        setError('Passwords must match');
        return;
      }

      API.post(`/api/auth/recovery/${recoveryToken}`, { password })
        .then((response) => {
          const { token } = response.data;
          dispatch({
            type: 'update_token',
            token: parseToken(token),
          });
          history.push('/');
        })
        .catch((err) => {
          if (err.response && err.response.data) {
            setError(err.response.data.message);
          }
        });

      return;
    }

    API.post('/api/auth/recovery', { email })
      .then(() => {
        history.push('/recover/sent');
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          setError(err.response.data.message);
        }
      });
  };

  return (
    <div>
      <h2 className="recover__heading">Recover Password</h2>
      { error && <span className="recover__error">{ error }</span> }
      <form className="recover__form" onSubmit={onSubmit}>
        {
          recoveryToken
            ? (
              <div>
                <div className="recover__form-group">
                  <label htmlFor="passwordInoput" className="recover__form-label">
                    Password
                  </label>
                  <input id="passwordInoput" type="password" className="recover__form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="recover__form-group">
                  <label htmlFor="duplicatePasswordInput" className="recover__form-label">
                    Repeat Password
                  </label>
                  <input id="duplicatePasswordInput" type="password" className="recover__form-input" value={duplicatePassword} onChange={(e) => setDuplicatePassword(e.target.value)} required />
                </div>
              </div>
            )
            : (
              <div className="recover__form-group">
                <label htmlFor="emailInput" className="recover__form-label">
                  Email
                </label>
                <input id="emailInput" type="email" className="recover__form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            )
        }
        <div className="recover__form-group recover__form-group--submit">
          <input type="submit" className="recover__form-input--submit" value="Submit" />
        </div>
      </form>
    </div>
  );
};

export default Recover;
