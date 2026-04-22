import React, { useState, useEffect, useContext } from 'react';
import { FaGlobe, FaUserCircle, FaRobot } from 'react-icons/fa';
import { HiOutlineChartBar, HiMenu, HiX } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/mainlogo.png';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const changeLanguage = (lng) => {
    try {
      i18n.changeLanguage(lng);
      setLangMenuOpen(false);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'gu', name: 'ગુજરાતી' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ' },
    { code: 'ma', name: 'मराठी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
  ];

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  const handleDashboard = () => {
    // Navigate to different dashboards based on user role
    const userRole = user?.role || localStorage.getItem('role');

    if (userRole === 'admin') {
      navigate('/farmer-dashboard');
    } else {
      navigate('/agent-dashboard');
    }

    setUserMenuOpen(false);
  };

  const handlePersonalizedAI = () => {
    navigate('/personalised-ai');
  };

  // Smooth scroll function
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();

    // Close mobile menu if open
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }

    // Find the target element to scroll to
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      // Scroll smoothly to the target element
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else if (targetId === 'home') {
      // If home, scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-900/90 backdrop-blur-md border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/">
                <img className="h-14 w-[80px]" src={logo} alt="FarmCredit Logo" />
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a
                  href="#home"
                  onClick={(e) => handleSmoothScroll(e, 'home')}
                  className="text-white hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t('navbar.home')}
                </a>
                <a
                  href="#data-integration"
                  onClick={(e) => handleSmoothScroll(e, 'data-integration')}
                  className="text-emerald-100 hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t('navbar.dataIntegration')}
                </a>
                <a
                  href="#credit-scoring"
                  onClick={(e) => handleSmoothScroll(e, 'credit-scoring')}
                  className="text-emerald-100 hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t('navbar.creditScoring')}
                </a>
                <a
                  href="#user-access"
                  onClick={(e) => handleSmoothScroll(e, 'user-access')}
                  className="text-emerald-100 hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t('navbar.userAccess')}
                </a>
                <a
                  href="#compliance"
                  onClick={(e) => handleSmoothScroll(e, 'compliance')}
                  className="text-emerald-100 hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t('navbar.compliance')}
                </a>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {/* Personalized AI Button */}
            <button
              onClick={handlePersonalizedAI}
              className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg shadow-purple-600/20"
            >
              <FaRobot className="mr-2" />
              Personalized AI
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center text-emerald-100 hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium"
              >
                <FaGlobe className="mr-2" />
                {languages.find((lang) => lang.code === i18n.language)?.name || 'English'}
              </button>

              {/* Language Dropdown Menu */}
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => changeLanguage(language.code)}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          i18n.language === language.code
                            ? 'text-emerald-400 bg-gray-700'
                            : 'text-emerald-100 hover:bg-gray-700'
                        }`}
                        role="menuitem"
                      >
                        {language.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Authentication Buttons */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center text-emerald-100 hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <FaUserCircle className="mr-2 h-5 w-5" />
                  {user.name || 'User'}
                </button>

                {/* User Menu Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <button
                        onClick={handleDashboard}
                        className="block w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-gray-700"
                        role="menuitem"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-gray-700"
                        role="menuitem"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg shadow-emerald-600/20"
              >
                Apply Now
              </button>
            )}
          </div>
          <div className="md:hidden flex items-center">
            {/* Mobile Language Selector */}
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-emerald-200 hover:text-white hover:bg-emerald-700 focus:outline-none mr-2"
            >
              <FaGlobe className="h-5 w-5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-emerald-200 hover:text-white hover:bg-emerald-700 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <HiX className="block h-6 w-6" />
              ) : (
                <HiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900 border-b border-emerald-800">
          <a
            href="#home"
            onClick={(e) => handleSmoothScroll(e, 'home')}
            className="text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            {t('navbar.home')}
          </a>
          <a
            href="#data-integration"
            onClick={(e) => handleSmoothScroll(e, 'data-integration')}
            className="text-emerald-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            {t('navbar.dataIntegration')}
          </a>
          <a
            href="#credit-scoring"
            onClick={(e) => handleSmoothScroll(e, 'credit-scoring')}
            className="text-emerald-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            {t('navbar.creditScoring')}
          </a>
          <a
            href="#user-access"
            onClick={(e) => handleSmoothScroll(e, 'user-access')}
            className="text-emerald-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            {t('navbar.userAccess')}
          </a>
          <a
            href="#compliance"
            onClick={(e) => handleSmoothScroll(e, 'compliance')}
            className="text-emerald-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            {t('navbar.compliance')}
          </a>

          {/* Mobile Personalized AI Button */}
          <button
            onClick={handlePersonalizedAI}
            className="flex items-center w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
          >
            <FaRobot className="mr-2" />
            Personalized AI
          </button>

          {/* Mobile Authentication Buttons */}
          {user ? (
            <>
              <button
                onClick={handleDashboard}
                className="text-emerald-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="text-emerald-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>

      {/* Mobile Language Menu */}
      {langMenuOpen && (
        <div className="md:hidden absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50 mx-2">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  i18n.language === language.code
                    ? 'text-emerald-400 bg-gray-700'
                    : 'text-emerald-100 hover:bg-gray-700'
                }`}
                role="menuitem"
              >
                {language.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
