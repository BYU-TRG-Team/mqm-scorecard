import React from "react";
import { GlobalContext } from "../../../store";
import links from "../../../links";
import "./SecondarySidebar.css";

const SecondarySidebar = () => {
  const [state] = React.useContext(GlobalContext);
  const filteredLinks = state.token ? links[state.token.role] : links.defaultLinks;

  return (
    <div className="secondary-sidebar">
      { filteredLinks }
    </div>
  );
};

export default SecondarySidebar;
