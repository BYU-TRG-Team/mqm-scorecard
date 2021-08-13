import React from 'react';
import ReactTooltip from 'react-tooltip';

const Tooltip = (props) => {
  const {
    children, id, delay
  } = props;

  return (
    <ReactTooltip
      id={id}
      type="dark"
      delayShow={delay || 400}
      overridePosition={(
        position,
        currentEvent, currentTarget, node
      ) => {
        const d = document.documentElement;
        let { left, top } = position;
        left = Math.min(d.clientWidth - node.clientWidth, left);
        top = Math.min(d.clientHeight - node.clientHeight, top);
        left = Math.max(0, left);
        top = Math.max(0, top);
        return { top, left };
      }}
    >
      { children }
    </ReactTooltip>
  );
};

export default Tooltip;
