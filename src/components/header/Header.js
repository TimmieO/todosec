import React, { useState, useEffect } from "react";
import "./header.css"
import fetchPageData from "../../helper/fetchPageDataHelper"

export default function Header() {

  return (
    <div className="header">
      <div>
        <a href="/">Home</a>
      </div>
      <div>
        <a href="/list">Lists</a>
      </div>
      <div>
        <a href="/profile">Profile</a>
      </div>
      <div>
        <a href="/login">Sign In</a>
      </div>
      <div>
        <a href="/register">Sign Up</a>
      </div>
      <div>
        <a href="/admin">Admin</a>
      </div>
    </div>
  );
}