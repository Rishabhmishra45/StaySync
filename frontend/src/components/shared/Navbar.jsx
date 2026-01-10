import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, Hotel, User, Sun, Moon } from 'lucide-react'
import { useAuth } from '../../app/providers/AuthProvider'
import { useTheme } from '../../app/providers/ThemeProvider'
import Button from '../ui/Button'
import Drawer from '../ui/Drawer'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/rooms', label: 'Rooms' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' }
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <nav className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Hotel className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-foreground">StaySync</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0)}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.role}</p>
                    </div>
                  </div>
                  <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                    <Button variant="outline" size="sm">
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        position="right"
        title="Menu"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-4 py-3 rounded-lg text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-6 border-t border-border">
            {/* Theme Toggle in Mobile */}
            <div className="flex items-center justify-between mb-6 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
              <div className="flex items-center space-x-3">
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
                <span className="text-foreground">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Switch
              </button>
            </div>

            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="font-medium text-foreground">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <span className="text-xs px-2 py-1 mt-1 inline-block rounded-full bg-primary/10 text-primary">
                    {user?.role}
                  </span>
                </div>
                <Link
                  to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                  className="block w-full text-center px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-center px-4 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block w-full text-center px-4 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default Navbar