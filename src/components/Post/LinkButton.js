import { BsLink45Deg } from "react-icons/bs";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useState } from "react";

const LinkButton = ({ link }) => {
  const [tooltip, SetTooltip] = useState(true);
  const serialize = (obj) => {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(obj[p]);
      }
    return str;
  };
  const handleClick = () => {
    SetTooltip(true);
    navigator.clipboard.writeText(serialize({ link }));
    setTimeout(() => {
      SetTooltip(false);
    }, 1000);
  };

  return (
    <>
      <OverlayTrigger
        rootClose
        rootCloseEvent="mousedown"
        trigger="click"
        placement="bottom"
        overlay={
          tooltip ? (
            <Tooltip id={`tooltip-top`}>Copied to clipboard!</Tooltip>
          ) : (
            <span></span>
          )
        }
      >
        <button className="btn btn-none" onClick={handleClick}>
          <BsLink45Deg />
        </button>
      </OverlayTrigger>
    </>
  );
};

export default LinkButton;
