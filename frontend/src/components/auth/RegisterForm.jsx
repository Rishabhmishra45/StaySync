import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, Phone, Building } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../app/providers/AuthProvider'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { validateEmail, validatePassword, validatePhone } from '../../utils/validators'

const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name is too long'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .refine(validateEmail, 'Please enter a valid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .refine(validatePassword, 'Password must contain uppercase, lowercase, and number'),
  confirmPassword: z.string(),
  phone: z.string()
    .optional()
    .refine(val => !val || validatePhone(val), 'Invalid phone number'),
  role: z.enum(['customer', 'admin']).default('customer')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

const RegisterForm = ({ onSuccess, className = '' }) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const { register: registerUser } = useAuth()

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
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
      toast.success('Account created successfully!')
      if (onSuccess) onSuccess(data)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration failed')
    }
  })

  const password = watch('password')

  const onSubmit = async (data) => {
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...userData } = data
    await mutation.mutateAsync(userData)
  }

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

        <Select
          label="Register As"
          options={[
            { value: 'customer', label: 'Customer' },
            { value: 'admin', label: 'Admin (Hotel Staff)' }
          ]}
          {...register('role')}
          error={errors.role?.message}
          className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
        />
      </div>

      <div className="space-y-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">Password must contain:</p>
          <ul className="space-y-1 pl-4">
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