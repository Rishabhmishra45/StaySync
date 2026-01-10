import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Helmet } from 'react-helmet-async'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { validateEmail } from '../../utils/validators'

const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .refine(validateEmail, 'Please enter a valid email')
})

const ForgotPasswordPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Password reset requested for:', data.email)
    setIsSubmitted(true)
    setIsLoading(false)
  }

  return (
    <>
      <Helmet>
        <title>Forgot Password - StaySynce</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary/5 dark:from-gray-900 dark:via-gray-900 dark:to-primary/10 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 shadow-2xl border border-gray-200 dark:border-gray-800">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {isSubmitted ? 'Check Your Email' : 'Forgot Password'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isSubmitted 
                  ? 'We have sent a password reset link to your email address.'
                  : 'Enter your email address and we will send you a reset link.'}
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  icon={<Mail className="w-5 h-5" />}
                  error={errors.email?.message}
                  disabled={isLoading}
                  {...register('email')}
                />

                <Button
                  type="submit"
                  size="lg"
                  loading={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Send Reset Link
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Please check your inbox and follow the instructions to reset your password.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    try again
                  </button>
                </p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </>
  )
}

export default ForgotPasswordPage