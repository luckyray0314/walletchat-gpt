"use client"
import React, { useEffect } from "react";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";

function TopButton() {
  useEffect(() => {
    const mybutton = document.getElementById("top-btn");

    function scrollFunction() {
      if (
        document.body.scrollTop > 500 ||
        document.documentElement.scrollTop > 500
      ) {
        if(mybutton) mybutton.style.display = "flex";
      } else {
        if(mybutton) mybutton.style.display = "none";
      }
    }

    // Attach the scroll event listener
    window.onscroll = scrollFunction;

    // Cleanup the event listener on component unmount
    return () => {
      window.onscroll = null;
    };
  }, []);
  return (
    <div
      className="top-btn"
      id="top-btn"
      onClick={() => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }}
    >
      <ExpandLessRoundedIcon />
    </div>
  );
}

export default TopButton;