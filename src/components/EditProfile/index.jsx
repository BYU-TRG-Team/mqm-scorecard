import React, { useEffect, useState } from 'react';
import './EditProfile.css';
import { useHistory } from 'react-router-dom';
import API from '../../api';
import { GlobalContext } from '../../store';
import { parseToken } from '../../utils';

const EditProfile = () => {
  const [state, dispatch] = React.useContext(GlobalContext);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [duplicatePassword, setDuplicatePassword] = useState('');
  const history = useHistory();

  const onSubmit = (e) => {
    e.preventDefault();
    let usePassword = false;
    let body = {
      username,
      email,
      name,
    };

    if (password || duplicatePassword) {
      if (password === duplicatePassword) {
        usePassword = true;
      } else {
        setError('Passwords must match');
        return;
      }
    }

    if (usePassword) {
      body = { ...body, password };
    }

    API.patch(`/api/user/${state.token.id}`, body)
      .then((response) => {
        const { newToken } = response.data;
        setError('');

        dispatch({
          type: 'update_token',
          token: parseToken(newToken),
        });
        history.push('/edit-profile/success');
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          setError(err.response.data.message);
        }
      });
  };

  useEffect(() => {
    API.get(`/api/user/${state.token.id}`)
      .then((response) => {
        setEmail(response.data.email);
        setUsername(response.data.username);
        setName(response.data.name);
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          setError(err.response.data.message);
        }
      });
  }, []);

  return (
    <div>
      <h2 className="login__heading">Edit Profile</h2>
      { error && <span className="edit-profile__error">{ error }</span> }
      <form className="edit-profile__form" onSubmit={onSubmit}>
        <div className="edit-profile__form-group">
          <label htmlFor="usernameInput" className="edit-profile__form-label">
            Username
          </label>
          <input id="usernameInput" type="text" className="edit-profile__form-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="edit-profile__form-group">
          <label htmlFor="emailInput" className="edit-profile__form-label">
            Email
          </label>
          <input id="emailInput" type="email" className="edit-profile__form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="edit-profile__form-group">
          <label htmlFor="nameInput" className="edit-profile__form-label">
            Name
          </label>
          <input id="nameInput" type="text" className="edit-profile__form-input" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="edit-profile__form-group">
          <label htmlFor="passwordInput" className="edit-profile__form-label">
            New password
          </label>
          <input id="passwordInput" type="password" className="edit-profile__form-input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="edit-profile__form-group">
          <label htmlFor="passwordInput" className="edit-profile__form-label">
            Repeat new password
          </label>
          <input id="passwordInput" type="password" className="edit-profile__form-input" value={duplicatePassword} onChange={(e) => setDuplicatePassword(e.target.value)} />
        </div>
        <div className="edit-profile__form-group edit-profile__form-group--submit">
          <input type="submit" className="edit-profile__form-input--submit" value="Update" />
        </div>
      </form>
    </div>

  );
};

export default EditProfile;
