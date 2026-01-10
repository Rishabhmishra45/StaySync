import React from 'react'
import { Link } from 'react-router-dom'
import { Hotel, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Company: [
      { label: 'About Us', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Press', to: '/press' },
      { label: 'Blog', to: '/blog' }
    ],
    Support: [
      { label: 'Help Center', to: '/help' },
      { label: 'Safety', to: '/safety' },
      { label: 'Cancellation Options', to: '/cancellation' },
      { label: 'Report Issue', to: '/report' }
    ],
    Legal: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Cookie Policy', to: '/cookies' },
      { label: 'Accessibility', to: '/accessibility' }
    ]
  }

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, label: 'Facebook', href: '#' },
    { icon: <Twitter className="w-5 h-5" />, label: 'Twitter', href: '#' },
    { icon: <Instagram className="w-5 h-5" />, label: 'Instagram', href: '#' },
    { icon: <Linkedin className="w-5 h-5" />, label: 'LinkedIn', href: '#' }
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Hotel className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold text-white">StaySynce</span>
            </div>
            <p className="mb-6 max-w-md">
              Experience luxury redefined at StaySynce. Book your perfect stay with our premium hotel management system.
            </p>
            
            <div className="flex items-center space-x-4 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-primary" />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-primary" />
            <span>support@staysynce.com</span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-primary" />
            <span>123 Luxury Street, Hospitality City</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p>&copy; {currentYear} StaySynce. All rights reserved.</p>
          <p className="mt-2 text-sm text-gray-500">
            Made with ❤️ for the hospitality industry
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer