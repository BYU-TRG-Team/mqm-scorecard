/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import "./PrimarySidebar.css";
import { Link, useHistory } from "react-router-dom";

import { GlobalContext } from "../../../store";
import API from "../../../api";

const PrimarySidebar = () => {
  const [state, dispatch] = React.useContext(GlobalContext);
  const history = useHistory();

  const logout = (e) => {
    e.preventDefault();
    API.get("/api/auth/logout").then(() => {
      dispatch({
        type: "update_token",
        token: "",
      });
      history.push("/");
    });
  };

  return (
    <div className="primary-sidebar">
      <div className="primary-sidebar__header">
        <Link className="link" to="/">
          <img height="40" width="98" alt="[MQM logo]" src={`${process.env.PUBLIC_URL}/images/mqmscorecard.png`} />
        </Link>
        <h1 className="primary-sidebar__heading">
          MQM Annotator
        </h1>
      </div>
      <div className="primary-sidebar__links">
        {
                    state.token
                    && (
                    <div>
                      {`Logged in as ${state.token.username} | `}
                      <a type="button" href="#" className="link" onClick={logout}>
                        Log out
                      </a>
                    </div>
                    )
                }
      </div>
    </div>
  );
};

export default PrimarySidebar;
