import React from "react";
import { useNavigate } from "react-router-dom";

function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <h1>Welcome to LA-PIZZERA</h1>
      <button className="round-button" onClick={() => navigate("/menu/:category")}>
        &gt;
      </button>
      <h5>please click here to continue</h5>
    </div>
  );
}

export default WelcomePage;
