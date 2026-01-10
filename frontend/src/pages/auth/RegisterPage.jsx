import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Hotel, Shield, CheckCircle } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import RegisterForm from '../../components/auth/RegisterForm'
import { useAuth } from '../../app/providers/AuthProvider'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSuccess = () => {
    navigate('/dashboard', { replace: true })
  }

  return (
    <>
      <Helmet>
        <title>Register - StaySynce</title>
        <meta name="description" content="Create your StaySynce account" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-secondary/5 dark:from-gray-900 dark:via-gray-900 dark:to-secondary/10">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row-reverse items-center justify-center min-h-[80vh] gap-12">
            {/* Right Side - Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 max-w-lg w-full"
            >
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Create Your Account
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Join StaySynce for exclusive benefits
                  </p>
                </div>

                <RegisterForm onSuccess={handleSuccess} />
              </div>
            </motion.div>

            {/* Left Side - Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-1/2 max-w-lg"
            >
              <div className="space-y-8">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg">
                    <Hotel className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                      StaySynce
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">Join our premium community</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Why Join StaySynce?
                  </h2>
                  
                  <div className="space-y-4">
                    {[
                      'Exclusive member rates and discounts',
                      'Priority booking for peak seasons',
                      'Free room upgrades (when available)',
                      'Personalized recommendations',
                      '24/7 VIP customer support',
                      'Flexible cancellation policies',
                      'Earn rewards with every stay',
                      'Early access to new properties'
                    ].map((benefit, index) => (
                      <motion.div
                        key={benefit}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start space-x-3"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200 dark:border-gray-800">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">50K+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Happy Guests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">4.9★</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">24/7</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RegisterPage