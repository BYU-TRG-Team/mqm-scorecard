import React, { useState } from "react";
import "./Register.css";
import { useHistory } from "react-router-dom";
import API from "../../api";

const Register = () => {
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [duplicatePassword, setDuplicatePassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const history = useHistory();

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== duplicatePassword) {
      setError("Passwords must match");
      return;
    }

    API.post("/api/auth/signup", {
      email, password, name, username,
    })
      .then(() => {
        history.push("/awaiting-verification");
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          setError(err.response.data.message);
        }
      });
  };

  return (
    <div>
      <h2 className="recover__heading">Registration</h2>
      { error && <span className="recover__error">{ error }</span> }
      <form className="recover__form" onSubmit={onSubmit}>
        <div className="recover__form-group">
          <label htmlFor="emailInput" className="recover__form-label">
            Email
          </label>
          <input id="emailInput" type="email" className="recover__form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="recover__form-group">
          <label htmlFor="usernameInput" className="recover__form-label">
            Username
          </label>
          <input id="usernameInput" type="text" className="recover__form-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="recover__form-group">
          <label htmlFor="passwordInput" className="recover__form-label">
            Password
          </label>
          <input id="passwordInput" type="password" className="recover__form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="recover__form-group">
          <label htmlFor="repeatPasswordInput" className="recover__form-label">
            Repeat Password
          </label>
          <input id="repeatPasswordInput" type="password" className="recover__form-input" value={duplicatePassword} onChange={(e) => setDuplicatePassword(e.target.value)} required />
        </div>
        <div className="recover__form-group">
          <label htmlFor="nameInput" className="recover__form-label">
            Name
          </label>
          <input id="nameInput" type="text" className="recover__form-input" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="recover__form-group recover__form-group--submit">
          <input type="submit" className="recover__form-input--submit" value="Submit" />
        </div>
      </form>
    </div>
  );
};

export default Register;
