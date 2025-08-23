import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { AnimatedText } from "../../components/magicui/animated-text";
import { GradientText } from "../../components/magicui/gradient-text";
import { FloatingElements } from "../../components/magicui/floating-elements";
import { Shimmer } from "../../components/magicui/shimmer";
import { FileTextIcon, ExitIcon, PersonIcon } from "@radix-ui/react-icons";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:3002/api/getUser', { withCredentials: true })
      .then((res) => {
        console.log('User data fetched: ', res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.error('Error fetching user data: ', err.response ? err.response.data : err.message);
        nav('/login'); 
      });
  }, [nav]);

  if (!user) {
    return (
      <FloatingElements className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Shimmer>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
          </Shimmer>
          <p className="text-lg text-slate-600 dark:text-slate-400">Loading your dashboard...</p>
        </div>
      </FloatingElements>
    );
  }

  const handleLogOut = () => {
    axios.post('http://localhost:3002/api/logout', {}, { withCredentials: true })
      .then(() => {
        setUser(null);
        nav('/login');
      })
      .catch(() => {
        setUser(null);
        nav('/login');
      });
  }

  return (
    <FloatingElements className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
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
              <PersonIcon className="w-5 h-5" />
              <AnimatedText text="Profile Information" animation="scaleIn" />
            </CardTitle>
            <CardDescription>
              Your account details and information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  First Name
                </label>
                <p className="text-lg font-semibold">{user.firstName}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Last Name
                </label>
                <p className="text-lg font-semibold">{user.lastName}</p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Username
                </label>
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
                  onClick={() => nav('/notes')}
                  className="h-16 flex items-center gap-3 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transform transition-all duration-200 hover:scale-[1.02]"
                  size="lg"
                >
                  <FileTextIcon className="w-6 h-6" />
                  <span>View My Notes</span>
                </Button>
              </Shimmer>
              
              <Button 
                onClick={handleLogOut}
                variant="outline"
                className="h-16 flex items-center gap-3 text-lg border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transform transition-all duration-200 hover:scale-[1.02]"
                size="lg"
              >
                <ExitIcon className="w-6 h-6" />
                <span>Log Out</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </FloatingElements>
  );
};

export default Dashboard;
