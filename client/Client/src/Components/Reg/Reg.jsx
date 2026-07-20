import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { AnimatedText } from '../../components/magicui/animated-text';
import { GradientText } from '../../components/magicui/gradient-text';
import { FloatingElements } from '../../components/magicui/floating-elements';
import { Shimmer } from '../../components/magicui/shimmer';
import { useFormValidation } from '../../hooks/useFormValidation';
import { registerValidation } from '../../utils/validation';
import { ReloadIcon } from '@radix-ui/react-icons';

const Reg = () => {
  const nav = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    validateForm
  } = useFormValidation(
    { firstName: '', lastName: '', username: '', email: '', password: '' },
    registerValidation
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    axios({
      method: 'post',
      url: `${import.meta.env.VITE_API_URL}/api/users/register`,
      data: {
        first: values.firstName,
        last: values.lastName,
        username: values.username,
        email: values.email,
        password: values.password
      },
      withCredentials: true
    })
      .then(() => {
        nav('/login2');
      })
      .catch(error => {
        console.error('Registration error:', error.message);
        setServerError(error.response?.data?.msg || 'Registration failed. Please try again.');
        setSubmitting(false);
      });
  };

  const fields = [
    { id: 'firstName', label: 'First Name', type: 'text', placeholder: 'Enter your first name' },
    { id: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Enter your last name' },
    { id: 'username', label: 'Username', type: 'text', placeholder: 'Choose a username' },
    { id: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter your email' },
    { id: 'password', label: 'Password', type: 'password', placeholder: 'Create a password (min 6 characters)' }
  ];

  return (
    <FloatingElements className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <Card className="w-full max-w-lg mx-auto backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 border-0 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold mb-2">
            <GradientText from="from-purple-600" via="via-blue-600" to="to-indigo-600">
              <AnimatedText text="Create Account" animation="slideUp" />
            </GradientText>
          </CardTitle>
          <CardDescription className="text-lg">
            <AnimatedText
              text="Join us and start taking notes"
              animation="fadeIn"
              staggerChildren={0.05}
            />
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {serverError && (
            <div
              role="alert"
              aria-live="assertive"
              className="p-3 rounded-md bg-red-600 text-white text-sm font-medium"
            >
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {fields.map(field => (
              <div key={field.id} className="space-y-1">
                <label
                  htmlFor={field.id}
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  {field.label} <span aria-hidden="true">*</span>
                </label>
                <Input
                  id={field.id}
                  type={field.type}
                  value={values[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  onBlur={() => handleBlur(field.id)}
                  placeholder={field.placeholder}
                  aria-label={field.label}
                  aria-required="true"
                  aria-invalid={!!(touched[field.id] && errors[field.id])}
                  aria-describedby={touched[field.id] && errors[field.id] ? `${field.id}-error` : undefined}
                  disabled={submitting}
                  className={`h-12 text-base px-4 bg-gray-100 border-gray-300 focus:bg-white transition-all duration-200 ${
                    touched[field.id] && errors[field.id] ? 'border-red-500 bg-red-50' : ''
                  }`}
                />
                {touched[field.id] && errors[field.id] && (
                  <p
                    id={`${field.id}-error`}
                    role="alert"
                    className="text-red-600 text-sm mt-1"
                  >
                    {errors[field.id]}
                  </p>
                )}
              </div>
            ))}

            <Shimmer className="mt-6">
              <Button
                type="submit"
                disabled={submitting || !isValid}
                aria-label="Submit registration form"
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {submitting ? (
                  <>
                    <ReloadIcon className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </Shimmer>
          </form>

          <div className="text-center pt-2">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login2">
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-700"
                  aria-label="Go to login page"
                >
                  Sign In
                </Button>
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </FloatingElements>
  );
};

export default Reg;
