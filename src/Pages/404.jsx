import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
    <h1 className="text-6xl font-bold mb-4">404</h1>
    <p className="text-xl mb-8">Oops! The page you're looking for doesn't exist.</p>
    <Link
      to="/"
      className="text-purple-600 hover:text-purple-800 transition"
    >
      Go back to Home
    </Link>
  </div>
);

export default NotFound;
