import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { AnimatedText } from "../magicui/animated-text";
import { GradientText } from "../magicui/gradient-text";
import { FloatingElements } from "../magicui/floating-elements";
import { PlusIcon, FileTextIcon, UserIcon } from "@radix-ui/react-icons";

export function DashboardExample() {
  const stats = [
    { title: "Total Notes", value: "24", description: "Active notes" },
    { title: "This Week", value: "8", description: "Notes created" },
    { title: "Categories", value: "5", description: "Organized topics" },
  ];

  return (
    <FloatingElements className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            <GradientText from="from-blue-600" via="via-purple-600" to="to-indigo-600">
              <AnimatedText text="Your Dashboard" animation="slideUp" />
            </GradientText>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            <AnimatedText 
              text="Manage your notes and stay organized" 
              animation="fadeIn"
              staggerChildren={0.05}
            />
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">
                  <GradientText from="from-blue-500" to="to-purple-500">
                    {stat.value}
                  </GradientText>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">
              <AnimatedText text="Quick Actions" animation="scaleIn" />
            </CardTitle>
            <CardDescription>
              Common tasks to help you stay productive
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button 
                className="h-20 flex-col gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transform transition-all duration-200 hover:scale-[1.02]"
                size="lg"
              >
                <PlusIcon className="w-6 h-6" />
                <span>Create Note</span>
              </Button>
              
              <Button 
                className="h-20 flex-col gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transform transition-all duration-200 hover:scale-[1.02]"
                size="lg"
              >
                <FileTextIcon className="w-6 h-6" />
                <span>View All Notes</span>
              </Button>
              
              <Button 
                className="h-20 flex-col gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 transform transition-all duration-200 hover:scale-[1.02]"
                size="lg"
              >
                <UserIcon className="w-6 h-6" />
                <span>Profile</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">
              <AnimatedText text="Recent Activity" animation="slideUp" />
            </CardTitle>
            <CardDescription>
              Your latest notes and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Project Ideas", "Meeting Notes", "Daily Journal"].map((note, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <div>
                      <h4 className="font-medium">{note}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Updated {Math.floor(Math.random() * 5) + 1} hours ago
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </FloatingElements>
  );
}