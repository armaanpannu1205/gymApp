// Dashboard.js
import React from "react";
import "./Dashboard.css"; // Import the corresponding CSS file
import { Link } from "react-router-dom";
import Feed from "./Feed";

function Dashboard() {
  return (
    <div className="dashboardContainer">
      <nav className="navbar">
        <h1>GymBuddy</h1>
        <img src="GymBud-logo_black.png" alt="" />
        <ul>
            <div className="navLink">
          <li className="navLinkHome">Home</li>
          <li className="navLinkFeed">
            <Link to="/feed">Feed</Link>
          </li>
          <li className="navLinkWorkouts">Workouts</li>
          <li className="navLinkMessages">Messages</li>
          </div>
        </ul>
      </nav>
    </div>
  );
}

export default Dashboard;
