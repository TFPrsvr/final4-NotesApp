import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/ui/toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { AnimatedText } from '../../components/magicui/animated-text';
import { GradientText } from '../../components/magicui/gradient-text';
import { FloatingElements } from '../../components/magicui/floating-elements';
import { Shimmer } from '../../components/magicui/shimmer';
import { FileTextIcon, ExitIcon, PersonIcon, GearIcon } from '@radix-ui/react-icons';

const Dashboard = () => {
  const nav = useNavigate();
  const { logout } = useAuth();
  const { user, loading: userLoading, isAuthenticated } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated && !userLoading) {
      toast.warning('Please log in to access your dashboard');
      nav('/login2');
    }
  }, [isAuthenticated, userLoading, nav, toast]);

  if (userLoading || !user) {
    return (
      <FloatingElements className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Shimmer>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
          </Shimmer>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {userLoading ? 'Loading your dashboard...' : 'Redirecting to login...'}
          </p>
        </div>
      </FloatingElements>
    );
  }

  const handleLogOut = () => {
    toast.info('Signing you out...');
    logout();
    toast.success('Successfully signed out');
  };

  return (
    <FloatingElements className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <main id="main-content" className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            <GradientText from="from-blue-600" via="via-purple-600" to="to-indigo-600">
              <AnimatedText text={`Welcome back, ${user.username}!`} animation="slideUp" />
            </GradientText>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            <AnimatedText
              text="Ready to manage your notes?"
              animation="fadeIn"
              staggerChildren={0.05}
            />
          </p>
        </div>

        {/* User Info Card */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <PersonIcon className="w-5 h-5" aria-hidden="true" />
              <AnimatedText text="Profile Information" animation="scaleIn" />
            </CardTitle>
            <CardDescription>
              Your account details and information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">First Name</p>
                <p className="text-lg font-semibold">{user.first}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Last Name</p>
                <p className="text-lg font-semibold">{user.last}</p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Username</p>
                <p className="text-lg font-semibold">{user.username}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">
              <AnimatedText text="Quick Actions" animation="scaleIn" />
            </CardTitle>
            <CardDescription>
              Navigate to different sections of your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Shimmer>
                <Button
                  onClick={() => nav('/get')}
                  aria-label="View your notes"
                  className="h-16 flex items-center gap-3 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transform transition-all duration-200 hover:scale-[1.02]"
                  style={{ borderRadius: '12%' }}
                  size="lg"
                >
                  <FileTextIcon className="w-6 h-6" aria-hidden="true" />
                  <span>View My Notes</span>
                </Button>
              </Shimmer>

              <Button
                onClick={() => nav('/settings')}
                aria-label="Go to settings"
                className="h-16 flex items-center gap-3 text-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 transform transition-all duration-200 hover:scale-[1.02]"
                style={{ borderRadius: '12%' }}
                size="lg"
              >
                <GearIcon className="w-6 h-6" aria-hidden="true" />
                <span>Settings</span>
              </Button>

              <Button
                onClick={handleLogOut}
                variant="outline"
                aria-label="Log out of your account"
                className="h-16 flex items-center gap-3 text-lg border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transform transition-all duration-200 hover:scale-[1.02] sm:col-span-2"
                style={{ borderRadius: '12%' }}
                size="lg"
              >
                <ExitIcon className="w-6 h-6" aria-hidden="true" />
                <span>Log Out</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </FloatingElements>
  );
};

export default Dashboard;
