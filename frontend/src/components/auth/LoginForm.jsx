// src/components/auth/LoginForm.jsx
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../app/providers/AuthProvider'
import Input from '../ui/Input'
import Button from '../ui/Button'

const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password is too long'),
  rememberMe: z.boolean().optional()
})

const LoginForm = ({ onSuccess, className = '' }) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  })

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      toast.success('Welcome back!')
      
      // Navigate based on user role
      if (data.user?.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
      
      if (onSuccess) onSuccess(data)
    },
    onError: (error) => {
      toast.error(error.message || 'Invalid credentials')
    }
  })

  const onSubmit = async (data) => {
    await mutation.mutateAsync(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 ${className}`}>
      <div className="space-y-4">
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
            placeholder="Enter your password"
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
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('rememberMe')}
            className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary focus:ring-2"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Remember me</span>
        </label>

        <Link
          to="/forgot-password"
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        size="lg"
        loading={mutation.isPending}
        disabled={mutation.isPending}
        className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        Sign In
      </Button>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          Sign up now
        </Link>
      </div>
    </form>
  )
}

export default LoginForm