import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="not-found-page text-center p-2">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p className="mb-2">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/">
        <button>Back to Home</button>
      </Link>
    </div>
  );
};

export default NotFoundPage;