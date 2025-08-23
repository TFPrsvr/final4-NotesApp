import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AnimatedText } from "../magicui/animated-text";
import { GradientText } from "../magicui/gradient-text";
import { Shimmer } from "../magicui/shimmer";
import { FloatingElements } from "../magicui/floating-elements";

export function LoginExample() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", { username, password });
  };

  return (
    <FloatingElements className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 border-0 shadow-2xl">
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
              staggerChildren={0.03}
            />
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="transition-all duration-200 focus:scale-[1.02]"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="transition-all duration-200 focus:scale-[1.02]"
              />
            </div>
            
            <Shimmer className="mt-6">
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Sign In
              </Button>
            </Shimmer>
          </form>
          
          <div className="text-center pt-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{" "}
              <Button variant="link" className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-700">
                Sign up
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </FloatingElements>
  );
}