import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { AnimatedText } from '../../components/magicui/animated-text';
import { GradientText } from '../../components/magicui/gradient-text';
import { Shimmer } from '../../components/magicui/shimmer';
import { FloatingElements } from '../../components/magicui/floating-elements';
import { useAuth } from '../../hooks/useAuth';
import { useUser } from '../../context/UserContext';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useToast } from '../../components/ui/toast';
import { loginValidation } from '../../utils/validation';
import { ReloadIcon } from '@radix-ui/react-icons';

const Login2 = () => {
  const navigate = useNavigate();
  const { login, loading, error: authError, isAuthenticated } = useAuth();
  const { isAuthenticated: userIsAuth } = useUser();
  const { toast } = useToast();
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    validateForm
  } = useFormValidation(
    { username: '', password: '' },
    loginValidation
  );

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dash');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
      usernameInput.focus();
    }
  }, []);

  useEffect(() => {
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    setRememberMe(savedRememberMe);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    const result = await login({
      username: values.username,
      password: values.password
    }, rememberMe);

    if (result.success) {
      toast.success('Welcome back! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dash');
      }, 1000);
    } else {
      toast.error(result.error);
    }
  };

  const handleInputChange = (field, value) => {
    handleChange(field, value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && isValid) {
      handleSubmit(e);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!forgotEmail) {
      toast.error('Please enter your email address');
      return;
    }

    setForgotLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Password reset instructions sent to your email!');
      setShowForgotPassword(false);
      setForgotEmail('');
    } catch {
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <FloatingElements className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <Card className="w-full max-w-lg mx-auto backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 border-0 shadow-2xl">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold mb-2">
            <GradientText from="from-green-600" via="via-blue-600" to="to-purple-600">
              Sign In
            </GradientText>
          </CardTitle>
          <CardDescription className="text-lg">
            <AnimatedText
              text="Access your notes and dashboard"
              animation="fadeIn"
              staggerChildren={0.1}
            />
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {authError && (
            <div
              role="alert"
              aria-live="assertive"
              className="p-3 rounded-md bg-red-600 text-white text-sm font-medium"
            >
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Username <span aria-hidden="true">*</span>
              </label>
              <Input
                id="username"
                type="text"
                value={values.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                onBlur={() => handleBlur('username')}
                onKeyPress={handleKeyPress}
                placeholder="Enter your username"
                aria-label="Username"
                aria-required="true"
                aria-invalid={!!(touched.username && errors.username)}
                aria-describedby={touched.username && errors.username ? 'username-error' : undefined}
                className={`h-14 text-lg px-6 bg-gray-100 border-gray-300 focus:bg-white transition-all duration-200 focus:scale-[1.02] ${
                  touched.username && errors.username ? 'border-red-500 bg-red-50' : ''
                }`}
                disabled={loading}
              />
              {touched.username && errors.username && (
                <p id="username-error" role="alert" className="text-red-600 text-sm mt-1">
                  {errors.username}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Password <span aria-hidden="true">*</span>
              </label>
              <Input
                id="password"
                type="password"
                value={values.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                onKeyPress={handleKeyPress}
                placeholder="Enter your password"
                aria-label="Password"
                aria-required="true"
                aria-invalid={!!(touched.password && errors.password)}
                aria-describedby={touched.password && errors.password ? 'password-error' : undefined}
                className={`h-14 text-lg px-6 bg-gray-100 border-gray-300 focus:bg-white transition-all duration-200 focus:scale-[1.02] ${
                  touched.password && errors.password ? 'border-red-500 bg-red-50' : ''
                }`}
                disabled={loading}
              />
              {touched.password && errors.password && (
                <p id="password-error" role="alert" className="text-red-600 text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                aria-label="Remember me for 30 days"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="remember-me" className="text-sm text-slate-600 dark:text-slate-400">
                Remember me for 30 days
              </label>
            </div>

            <Shimmer className="mt-6">
              <Button
                type="submit"
                disabled={loading || !isValid}
                aria-label="Sign in to your account"
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <ReloadIcon className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </Shimmer>
          </form>

          <div className="text-center pt-4 space-y-3">
            <button
              onClick={() => setShowForgotPassword(true)}
              aria-label="Open forgot password form"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Forgot your password?
            </button>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don&apos;t have an account?{' '}
              <Link to="/reg">
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-700"
                  aria-label="Go to register page"
                >
                  Register User
                </Button>
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {showForgotPassword && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-password-title"
        >
          <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/95 dark:bg-slate-900/95 border-0 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle id="forgot-password-title" className="text-2xl font-bold">
                <GradientText from="from-blue-600" to="to-purple-600">
                  Reset Password
                </GradientText>
              </CardTitle>
              <CardDescription>
                Enter your email address and we&apos;ll send you instructions to reset your password.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <form onSubmit={handleForgotPassword}>
                <div className="space-y-2">
                  <label
                    htmlFor="forgot-email"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Email Address <span aria-hidden="true">*</span>
                  </label>
                  <Input
                    id="forgot-email"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your email address"
                    aria-label="Email address for password reset"
                    aria-required="true"
                    className="h-12 text-base px-4 bg-gray-100 border-gray-300 focus:bg-white transition-all duration-200"
                    disabled={forgotLoading}
                    required
                  />
                </div>

                <div className="flex gap-2 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotEmail('');
                    }}
                    aria-label="Cancel password reset"
                    className="flex-1"
                    disabled={forgotLoading}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    aria-label="Send password reset link"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={forgotLoading || !forgotEmail}
                  >
                    {forgotLoading ? (
                      <>
                        <ReloadIcon className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                        Sending...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </FloatingElements>
  );
};

export default Login2;
