
import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Compass, User as UserIcon, LogOut, LayoutDashboard, Bookmark } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLinkStyle = { color: '#00C49F' };

  return (
    <header className="bg-secondary shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-white text-xl font-bold">
              <Compass className="h-8 w-8 text-accent mr-2" />
              <span>Course Compass</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <NavLink to="/courses" className="text-light hover:text-white px-3 py-2 rounded-md text-sm font-medium" style={({isActive}) => isActive ? activeLinkStyle : {}}>Courses</NavLink>
                <NavLink to="/learning-path" className="text-light hover:text-white px-3 py-2 rounded-md text-sm font-medium" style={({isActive}) => isActive ? activeLinkStyle : {}}>Learning Paths</NavLink>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary focus:ring-white">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-tertiary flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
                  </div>
                </button>
                {dropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-secondary ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-2 text-sm text-white border-b border-tertiary">
                      Signed in as <br/> <span className="font-medium">{user.name}</span>
                    </div>
                    <Link to="/dashboard" className="flex items-center w-full text-left px-4 py-2 text-sm text-light hover:bg-tertiary" onClick={() => setDropdownOpen(false)}><LayoutDashboard className="w-4 h-4 mr-2"/>Dashboard</Link>
                    <Link to="/profile" className="flex items-center w-full text-left px-4 py-2 text-sm text-light hover:bg-tertiary" onClick={() => setDropdownOpen(false)}><UserIcon className="w-4 h-4 mr-2"/>Profile</Link>
                    <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 text-sm text-light hover:bg-tertiary">
                      <LogOut className="w-4 h-4 mr-2"/>Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth" className="bg-accent text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-accent-hover transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
