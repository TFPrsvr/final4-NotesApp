import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { AnimatedText } from "../../components/magicui/animated-text";
import { GradientText } from "../../components/magicui/gradient-text";
import { Shimmer } from "../../components/magicui/shimmer";
import { FloatingElements } from "../../components/magicui/floating-elements";
import { useAuth } from '../../hooks/useAuth';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useToast } from '../../components/ui/toast';
import { loginValidation } from '../../utils/validation';
import { ReloadIcon } from '@radix-ui/react-icons';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error: authError, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
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

  // Redirect if already authenticated
  useEffect(() => {
      if (isAuthenticated()) {
          navigate('/dash');
      }
  }, [isAuthenticated, navigate]);

  // Auto-focus username input
  useEffect(() => {
      const usernameInput = document.getElementById('username-login1');
      if (usernameInput) {
          usernameInput.focus();
      }
  }, []);




  const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Validate form before submission
      if (!validateForm()) {
          toast.error('Please fix the errors below');
          return;
      }

      const result = await login({
          username: values.username,
          password: values.password
      });

      if (result.success) {
          toast.success('Login successful! Redirecting to notes...');
          setTimeout(() => {
              navigate('/notes');
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

  return (
    <FloatingElements className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <Card className="w-full max-w-lg mx-auto backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 border-0 shadow-2xl">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold mb-2">
            <GradientText from="from-blue-600" via="via-purple-600" to="to-indigo-600">
              Welcome Back
            </GradientText>
          </CardTitle>
          <CardDescription className="text-lg">
            <AnimatedText 
              text="Sign in to your account to continue" 
              animation="fadeIn"
              staggerChildren={0.1}
            />
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {authError && (
            <div className="p-3 rounded-md bg-red-600 text-white text-sm font-medium">
              {authError}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username-login1" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Username *
              </label>
              <Input
                id="username-login1"
                type="text"
                value={values.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                onBlur={() => handleBlur('username')}
                onKeyPress={handleKeyPress}
                placeholder="Enter your username"
                className={`h-14 text-lg px-6 bg-gray-100 border-gray-300 focus:bg-white transition-all duration-200 focus:scale-[1.02] ${
                    touched.username && errors.username ? 'border-red-500 bg-red-50' : ''
                }`}
                disabled={loading}
              />
              {touched.username && errors.username && (
                  <p className="text-red-600 text-sm mt-1">{errors.username}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password-login1" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Password *
              </label>
              <Input
                id="password-login1"
                type="password"
                value={values.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                onKeyPress={handleKeyPress}
                placeholder="Enter your password"
                className={`h-14 text-lg px-6 bg-gray-100 border-gray-300 focus:bg-white transition-all duration-200 focus:scale-[1.02] ${
                    touched.password && errors.password ? 'border-red-500 bg-red-50' : ''
                }`}
                disabled={loading}
              />
              {touched.password && errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            
            <Shimmer className="mt-6">
              <Button 
                type="submit" 
                disabled={loading || !isValid}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                    <>
                        <ReloadIcon className="w-4 h-4 mr-2 animate-spin" />
                        Signing In...
                    </>
                ) : (
                    'Sign In'
                )}
              </Button>
            </Shimmer>
          </form>
          
          <div className="text-center pt-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{" "}
              <Link to="/reg">
                <Button variant="link" className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-700">
                  Sign up
                </Button>
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </FloatingElements>
  );
};

export default Login;
