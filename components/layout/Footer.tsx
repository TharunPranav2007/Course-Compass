
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-tertiary">
          &copy; {new Date().getFullYear()} Course Compass. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
