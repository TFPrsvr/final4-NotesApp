import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { AnimatedText } from "../../components/magicui/animated-text";
import { GradientText } from "../../components/magicui/gradient-text";
import { Shimmer } from "../../components/magicui/shimmer";
import { FloatingElements } from "../../components/magicui/floating-elements";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const nav = useNavigate();




  const handleSubmit = (e) => {
    e.preventDefault();

    axios({
      method: "post",
      url: "http://localhost:3002/api/users/loginUser",
      data: { username: username, password: password },
    })
      .then((res) => {
        alert("Login successful!");
        nav("/notes");
      })
      .catch((err) => {
        console.log("Login failed", err.res || err.message);
      });
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
          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}
          
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
                required
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
                required
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
