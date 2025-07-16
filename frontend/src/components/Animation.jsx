import React from "react";
import Lottie from "react-lottie-player";
import animationData from "../gpayTick.json";

export default function Animation() {
  return (
    <div style={{ width: 300, height: 300 }}>
      <Lottie animationData={animationData} play />
    </div>
  );
}
