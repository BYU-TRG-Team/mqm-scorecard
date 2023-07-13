import React from "react";

const Triangle = (props) => {
  const { className } = props;
  return (
    <svg className={className} viewBox="0 0 100 50" height="4px" width="8px" hxmlns="http://www.w3.org/2000/svg">
      <polygon points="0 0, 100 0, 50 50" />
    </svg>
  );
};

export default Triangle;
