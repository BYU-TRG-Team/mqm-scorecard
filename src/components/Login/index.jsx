import React, { useState } from "react";
import "./Login.css";
import {
  Link,
  useHistory,
} from "react-router-dom";
import API from "../../api";
import { GlobalContext } from "../../store";
import { parseToken } from "../../utils";

const Login = () => {
  // eslint-disable-next-line no-unused-vars
  const [state, dispatch] = React.useContext(GlobalContext);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const history = useHistory();

  const onSubmit = (e) => {
    e.preventDefault();

    return API.post("/api/auth/signin", { username, password, rememberMe })
      .then((response) => {
        const { token } = response.data;
        dispatch({
          type: "update_token",
          token: parseToken(token),
        });
        history.push("/");
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          setError(err.response.data.message);
        }
      });
  };

  return (
    <div>
      <h2 className="login__heading">Login</h2>
      { error && <span className="login__error">{ error }</span> }
      <form className="login__form" onSubmit={onSubmit}>
        <div className="login__form-group">
          <label htmlFor="usernameInput" className="login__form-label">
            Username
          </label>
          <input id="usernameInput" type="text" className="login__form-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="login__form-group">
          <label htmlFor="passwordInput" className="login__form-label">
            Password
          </label>
          <input id="passwordInput" type="password" className="login__form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="login__form-group login__form-group--checkbox">
          <input id="rememberMeInput" type="checkbox" className="login__form-input" onChange={() => setRememberMe(!rememberMe)} />
          <label htmlFor="rememberMeInput" className="login__form-label">
            Remember me
          </label>
        </div>
        <div className="login__form-group login__form-group--submit">
          <input type="submit" className="login__form-input--submit" value="Login" />
        </div>
      </form>

      <Link to="/recover" className="link login__forgot-password">Forgot Password?</Link>
    </div>
  );
};

export default Login;
