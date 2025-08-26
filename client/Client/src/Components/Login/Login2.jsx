import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const Login2 = () => {
    const navigate = useNavigate();
    const { login, loading, error: authError, isAuthenticated } = useAuth();
    const { user, isAuthenticated: userIsAuth } = useUser();
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

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/dash');
        }
    }, [isAuthenticated, navigate]);

    // Auto-focus username input
    useEffect(() => {
        const usernameInput = document.getElementById('username');
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
            // Simulate API call for forgot password
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast.success('Password reset instructions sent to your email!');
            setShowForgotPassword(false);
            setForgotEmail('');
        } catch (error) {
            toast.error('Failed to send reset email. Please try again.');
        } finally {
            setForgotLoading(false);
        }
    };

    // Load remember me preference
    useEffect(() => {
        const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
        setRememberMe(savedRememberMe);
    }, []);

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
                        <div className="p-3 rounded-md bg-red-600 text-white text-sm font-medium">
                            {authError}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="username" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Username *
                            </label>
                            <Input
                                id="username"
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
                            <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Password *
                            </label>
                            <Input
                                id="password"
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
                        
                        {/* Remember Me Checkbox */}
                        <div className="flex items-center space-x-2">
                            <input
                                id="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
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
                                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                    
                    {/* Forgot Password & Register Links */}
                    <div className="text-center pt-4 space-y-3">
                        <button
                            onClick={() => setShowForgotPassword(true)}
                            className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                        >
                            Forgot your password?
                        </button>
                        
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Don't have an account?{" "}
                            <Link to="/reg">
                                <Button variant="link" className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-700">
                                    Register User
                                </Button>
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
            
            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/95 dark:bg-slate-900/95 border-0 shadow-2xl">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-bold">
                                <GradientText from="from-blue-600" to="to-purple-600">
                                    Reset Password
                                </GradientText>
                            </CardTitle>
                            <CardDescription>
                                Enter your email address and we'll send you instructions to reset your password.
                            </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                            <form onSubmit={handleForgotPassword}>
                                <div className="space-y-2">
                                    <label htmlFor="forgot-email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Email Address *
                                    </label>
                                    <Input
                                        id="forgot-email"
                                        type="email"
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                        placeholder="Enter your email address"
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
                                        className="flex-1"
                                        disabled={forgotLoading}
                                    >
                                        Cancel
                                    </Button>
                                    
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                        disabled={forgotLoading || !forgotEmail}
                                    >
                                        {forgotLoading ? (
                                            <>
                                                <ReloadIcon className="w-4 h-4 mr-2 animate-spin" />
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