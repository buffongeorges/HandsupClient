import React, { forwardRef, useState } from "react";
import './Switch.css';

export default function Switch({id, checked, onSwitchClick, ...props}) {
    const [toggled, setToggled] = useState(checked);

    const onClick = (e) => {
        e.preventDefault();
        setToggled(!toggled);
        if (typeof(onSwitchClick) === 'function') {
            onSwitchClick({
              current: !toggled
            });
        }
    }

  return <button id={id} className={`toggle-btn ${toggled ? 'toggled' : ''}`} onClick={onClick} {...props}>
    <div className="thumb">
    </div>
  </button>
};

Switch.defaultProps = {
  checked: false,

}
