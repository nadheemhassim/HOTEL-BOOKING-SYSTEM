'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { validateEmail, validatePassword } from '@/utils/validation';

interface FormErrors {
  email: string;
  password: string;
  general: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({
    email: '',
    password: '',
    general: ''
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  const handleBlur = (name: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (name === 'email') {
      const emailError = validateEmail(formData.email);
      setErrors(prev => ({ ...prev, email: emailError }));
    } else if (name === 'password') {
      const passwordError = validatePassword(formData.password);
      setErrors(prev => ({ ...prev, password: passwordError }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    setErrors(prev => ({ ...prev, [name]: '', general: '' }));

    if (touched[name as keyof typeof touched]) {
      if (name === 'email') {
        const emailError = validateEmail(value);
        setErrors(prev => ({ ...prev, email: emailError }));
      } else if (name === 'password') {
        const passwordError = validatePassword(value);
        setErrors(prev => ({ ...prev, password: passwordError }));
      }
    }
  };

  const validateForm = (): boolean => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    setErrors({
      email: emailError,
      password: passwordError,
      general: ''
    });

    setTouched({
      email: true,
      password: true
    });

    return !emailError && !passwordError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setErrors(prev => ({
            ...prev,
            general: 'Invalid email or password'
          }));
        } else if (data.message) {
          setErrors(prev => ({
            ...prev,
            general: data.message
          }));
        } else {
          throw new Error('Login failed');
        }
        return;
      }

      login(formData.password, data.user);
      router.push('/');
    } catch {
      setErrors(prev => ({
        ...prev,
        general: 'Network error. Please try again.'
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-[#1B4D3E] hover:text-[#163D37] transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Please sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    touched.email && errors.email 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-[#1B4D3E] focus:border-[#1B4D3E]'
                  } rounded-lg`}
                  placeholder="Enter your email"
                  required
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    touched.password && errors.password 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-[#1B4D3E] focus:border-[#1B4D3E]'
                  } rounded-lg`}
                  placeholder="Enter your password"
                  required
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-[#1B4D3E] focus:ring-[#1B4D3E] border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-[#1B4D3E] hover:text-[#163D37] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-red-400">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-red-700">{errors.general}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B4D3E] text-white py-2 rounded-lg hover:bg-[#163D37] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B4D3E] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-[#1B4D3E] hover:text-[#163D37] transition-colors font-medium"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}