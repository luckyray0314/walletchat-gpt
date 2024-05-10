import React from "react";
import "./styles.css";

interface Props {
    text: string;
    onClick: (e: any) => void;
    outlined?: string;
}

function Button({ text, onClick, outlined }: Props) {
  return (
    <div
      className={outlined ? "btn-outlined" : "btn"}
      onClick={(e) => onClick(e)}
    >
      {text}
    </div>
  );
}

export default Button;