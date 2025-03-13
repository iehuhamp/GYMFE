import React from "react";
import "./loading.css";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  text = "Loading...",
}) => {
  return (
    <div className="loading-container">
      <div className={`loading-spinner ${size}`}>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
