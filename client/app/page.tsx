'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navigation } from '@/components/navigation'
import { BarChart3, TrendingUp, Upload, Zap, ArrowRight, Play, Star, Users, Award, Globe, Target, Lightbulb, Rocket, Shield } from 'lucide-react'
import Link from 'next/link'
import { api } from '@/lib/api'

export default function LandingPage() {
  const router = useRouter()

  useEffect(() => {
    if (api.isAuthenticated()) {
      router.push('/dashboard')
    }
  }, [router])
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="container mx-auto px-4 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8 max-w-4xl mx-auto"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 text-sm"
              >
                <Star className="h-4 w-4 mr-2" />
                #1 Excel Analytics Platform
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight">
                Transform Excel Data into
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Stunning Visualizations
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Upload your Excel files and instantly create interactive 2D & 3D charts with AI-powered insights. 
                Professional analytics made simple.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300">
                  Start Analyzing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg rounded-xl">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-slate-800/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powerful Features for
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Data Excellence
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to transform raw Excel data into actionable insights
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Upload,
                title: "Smart File Upload",
                description: "Drag & drop Excel files with instant parsing and validation. Supports .xls and .xlsx formats.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: BarChart3,
                title: "3D Visualizations",
                description: "Create stunning 2D and 3D charts with Three.js. Interactive and exportable in multiple formats.",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Zap,
                title: "AI-Powered Insights",
                description: "Get intelligent analysis, trend detection, and actionable recommendations for your data.",
                color: "from-purple-500 to-pink-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 h-full backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${feature.color} p-4 mb-4`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-white mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-400 text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Files Processed", icon: Upload },
              { number: "50K+", label: "Charts Created", icon: BarChart3 },
              { number: "5K+", label: "Happy Users", icon: Users },
              { number: "99.9%", label: "Uptime", icon: Award }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="space-y-2"
              >
                <stat.icon className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-4xl font-bold text-white">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section data-section="about" className="py-20 bg-gradient-to-b from-slate-800/50 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Zidio Development
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Transforming complex Excel data into actionable insights through cutting-edge visualization technology
            </p>
          </motion.div>

          {/* How It Works Flow */}
          <div className="mb-20">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-center text-white mb-12"
            >
              How Our Platform Works
            </motion.h3>
            
            <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                {
                  step: "01",
                  icon: Upload,
                  title: "Upload Excel File",
                  description: "Simply drag & drop your .xlsx or .xls file. Our system instantly parses and validates your data.",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  step: "02",
                  icon: Zap,
                  title: "AI Processing",
                  description: "Advanced algorithms analyze your data structure, detect patterns, and prepare optimal visualizations.",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  step: "03",
                  icon: BarChart3,
                  title: "Generate Charts",
                  description: "Create stunning 2D & 3D interactive charts with real-time customization and multiple chart types.",
                  color: "from-green-500 to-emerald-500"
                },
                {
                  step: "04",
                  icon: TrendingUp,
                  title: "Export & Share",
                  description: "Download professional reports in PNG/PDF format or share interactive dashboards with your team.",
                  color: "from-orange-500 to-red-500"
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className="relative"
                >
                  <div className="text-center">
                    <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${step.color} p-5 mb-4 relative`}>
                      <step.icon className="h-10 w-10 text-white" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-xs font-bold text-white">{step.step}</span>
                      </div>
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-3">{step.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-10 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-600 to-gray-800"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Our Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Target className="h-8 w-8 text-blue-400" />
                <h3 className="text-2xl font-bold text-white">Our Mission</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                To democratize data visualization by making advanced analytics accessible to everyone. 
                We believe that powerful insights shouldn't require complex tools or extensive training.
              </p>
              <div className="space-y-3">
                {[
                  "Simplify complex data analysis",
                  "Provide professional-grade visualizations",
                  "Enable data-driven decision making",
                  "Support businesses of all sizes"
                ].map((point, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-400">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Lightbulb className="h-8 w-8 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">Our Vision</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                To become the world's leading platform for Excel data transformation, 
                empowering millions of users to unlock the hidden potential in their data.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Rocket, label: "Innovation" },
                  { icon: Shield, label: "Security" },
                  { icon: Users, label: "Community" },
                  { icon: Award, label: "Excellence" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-slate-800/30 rounded-lg">
                    <item.icon className="h-5 w-5 text-purple-400" />
                    <span className="text-gray-300 text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Transform Your
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Excel Data?
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              Join thousands of professionals who trust our platform for their data visualization needs.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300">
                Get Started Free
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-slate-900/95 border-t border-slate-700 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-6 w-6 text-blue-400" />
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Zidio Development
                </h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Professional Excel Analytics Platform with cutting-edge data visualization and AI-powered insights.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Star className="h-4 w-4 text-red-400" />
                <span>Built with passion for data excellence</span>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors">
                  <Globe className="h-4 w-4" />
                  <a href="mailto:yadavsatyamsingh078@gmail.com" className="text-sm">
                    yadavsatyamsingh078@gmail.com
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 hover:text-green-400 transition-colors">
                  <Users className="h-4 w-4" />
                  <a href="tel:+919310433939" className="text-sm">
                    +91 9310433939
                  </a>
                </div>
              </div>
            </div>
            
            {/* Features */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Platform Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span>Interactive 2D & 3D Visualizations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span>AI-Powered Data Insights</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  <span>Professional Export (PNG/PDF)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                  <span>Real-time Chart Generation</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-slate-700 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-gray-400">
                © 2024 <span className="text-blue-400 font-medium">Zidio Development</span>. All rights reserved.
              </div>
              <div className="text-sm text-gray-400">
                Developed with <Star className="h-3 w-3 text-red-400 inline mx-1" /> by Satyam Singh Yadav
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}