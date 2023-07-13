import React from "react";
import Triangle from "../svgs/triangle";
import "./Accordion.css";

const Accordion = (props) => {
  const {
    isOpen, header, onClick, content,
  } = props;
  return (
    <div>
      <div className={`accordion ${isOpen && "accordion--open"}`} onClick={onClick}>
        <Triangle className={`accordion__triangle ${isOpen && "accordion__triange--rotated"}`} />
        <span className="accordion__header">{ header }</span>
      </div>
      {
        isOpen
        && (
        <div className="accordion__content">
          { content || "" }
        </div>
        )
      }
    </div>
  );
};

export default Accordion;
