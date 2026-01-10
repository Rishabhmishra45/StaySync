import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Hotel, ArrowLeft } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import Button from '../../components/ui/Button'

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | StaySynce</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
        <div className="text-center max-w-lg">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10">
              <Hotel className="w-16 h-16 text-primary" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-9xl font-bold text-primary mb-4"
          >
            404
          </motion.h1>

          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-foreground mb-4"
          >
            Page Not Found
          </motion.h2>

          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mb-8"
          >
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/" className="w-full sm:w-auto">
              <Button size="lg" className="w-full">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Back Home
              </Button>
            </Link>
            <Link to="/rooms" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full">
                <Home className="w-5 h-5 mr-2" />
                Browse Rooms
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default NotFoundPage