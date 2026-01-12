// src/components/auth/RegisterForm.jsx
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, Phone, Shield } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../app/providers/AuthProvider'
import Input from '../ui/Input'
import Button from '../ui/Button'

const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name is too long'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  role: z.enum(['customer', 'admin']).default('customer')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

const RegisterForm = ({ onSuccess, className = '' }) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors },
    setValue
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      role: 'customer'
    }
  })

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success(`Account created successfully! Welcome as ${data.user.role}`)
      
      // Navigate based on user role
      if (data.user?.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
      
      if (onSuccess) onSuccess(data)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration failed')
    }
  })

  const password = watch('password')
  const userRole = watch('role')

  const onSubmit = async (data) => {
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...userData } = data
    await mutation.mutateAsync(userData)
  }

  const handleRoleChange = (role) => {
    setValue('role', role, { shouldValidate: true })
  }

  const passwordStrength = React.useMemo(() => {
    if (!password) return 0
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/\d/.test(password)) strength += 1
    return strength
  }, [password])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 ${className}`}>
      <div className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          icon={<User className="w-5 h-5" />}
          error={errors.name?.message}
          disabled={mutation.isPending}
          {...register('name')}
          className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          icon={<Mail className="w-5 h-5" />}
          error={errors.email?.message}
          disabled={mutation.isPending}
          {...register('email')}
          className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            icon={<Lock className="w-5 h-5" />}
            error={errors.password?.message}
            disabled={mutation.isPending}
            {...register('password')}
            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
          
          {/* Password strength indicator */}
          {password && (
            <div className="mt-2">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full ${
                      level <= passwordStrength
                        ? level <= 2 ? 'bg-red-500' : level === 3 ? 'bg-yellow-500' : 'bg-green-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {passwordStrength === 0 && 'Enter password'}
                {passwordStrength === 1 && 'Weak'}
                {passwordStrength === 2 && 'Fair'}
                {passwordStrength === 3 && 'Good'}
                {passwordStrength === 4 && 'Strong'}
              </p>
            </div>
          )}
        </div>

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            icon={<Lock className="w-5 h-5" />}
            error={errors.confirmPassword?.message}
            disabled={mutation.isPending}
            {...register('confirmPassword')}
            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm pr-12"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        <Input
          label="Phone Number (Optional)"
          placeholder="Enter your phone number"
          icon={<Phone className="w-5 h-5" />}
          error={errors.phone?.message}
          disabled={mutation.isPending}
          {...register('phone')}
          className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
        />

        {/* Role Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Register As
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`relative flex cursor-pointer items-center justify-center rounded-lg border-2 p-4 transition-all ${
              userRole === 'customer'
                ? 'border-primary bg-primary/10'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}>
              <input
                type="radio"
                value="customer"
                className="sr-only"
                checked={userRole === 'customer'}
                onChange={() => handleRoleChange('customer')}
              />
              <div className="text-center">
                <User className={`w-6 h-6 mx-auto mb-2 ${
                  userRole === 'customer' ? 'text-primary' : 'text-gray-500'
                }`} />
                <span className={`text-sm font-medium ${
                  userRole === 'customer' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Customer
                </span>
              </div>
            </label>
            
            <label className={`relative flex cursor-pointer items-center justify-center rounded-lg border-2 p-4 transition-all ${
              userRole === 'admin'
                ? 'border-primary bg-primary/10'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}>
              <input
                type="radio"
                value="admin"
                className="sr-only"
                checked={userRole === 'admin'}
                onChange={() => handleRoleChange('admin')}
              />
              <div className="text-center">
                <Shield className={`w-6 h-6 mx-auto mb-2 ${
                  userRole === 'admin' ? 'text-primary' : 'text-gray-500'
                }`} />
                <span className={`text-sm font-medium ${
                  userRole === 'admin' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Admin
                </span>
              </div>
            </label>
          </div>
          {errors.role?.message && (
            <p className="text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>
      </div>

      {/* Password requirements */}
      <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Password must contain:
        </p>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li className={`flex items-center ${password?.length >= 8 ? 'text-green-600' : ''}`}>
            <span className="mr-2">•</span>
            At least 8 characters
          </li>
          <li className={`flex items-center ${/[A-Z]/.test(password) ? 'text-green-600' : ''}`}>
            <span className="mr-2">•</span>
            One uppercase letter
          </li>
          <li className={`flex items-center ${/[a-z]/.test(password) ? 'text-green-600' : ''}`}>
            <span className="mr-2">•</span>
            One lowercase letter
          </li>
          <li className={`flex items-center ${/\d/.test(password) ? 'text-green-600' : ''}`}>
            <span className="mr-2">•</span>
            One number
          </li>
        </ul>
      </div>

      {/* Terms and conditions */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="terms"
          required
          className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary focus:ring-2"
        />
        <label htmlFor="terms" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          I agree to the{' '}
          <Link to="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </label>
      </div>

      <Button
        type="submit"
        size="lg"
        loading={mutation.isPending}
        disabled={mutation.isPending}
        className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        Create Account
      </Button>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          Sign in here
        </Link>
      </div>
    </form>
  )
}

export default RegisterForm