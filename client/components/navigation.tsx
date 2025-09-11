'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { BarChart3, Menu, User, LogOut, TrendingUp, History, Home, Info, Layout } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    const currentUser = api.getCurrentUser()
    setUser(currentUser)
  }, [])

  const handleLogout = () => {
    api.logout()
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    router.push('/auth/signin')
  }

  const handleAnalytics = () => {
    if (pathname === '/dashboard') {
      const chartsSection = document.querySelector('[data-section="charts"]')
      if (chartsSection) {
        chartsSection.scrollIntoView({ behavior: 'smooth' })
      } else {
        // If no charts, show message to upload data first
        alert('📊 Please upload an Excel file first to view analytics!')
        const uploadSection = document.querySelector('[data-section="upload"]')
        if (uploadSection) {
          uploadSection.scrollIntoView({ behavior: 'smooth' })
        }
      }
    } else {
      router.push('/dashboard')
    }
  }

  const handleHistory = () => {
    if (pathname === '/dashboard') {
      const historySection = document.querySelector('[data-section="history"]')
      if (historySection) {
        historySection.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      router.push('/dashboard')
    }
  }

  const handleExportAll = () => {
    if (pathname === '/dashboard') {
      const exportButton = document.querySelector('[data-action="export-all"]') as HTMLButtonElement
      if (exportButton) {
        exportButton.click()
      } else {
        alert('📁 No charts available to export. Please create some visualizations first!')
      }
    } else {
      router.push('/dashboard')
    }
  }

  const handleNewUpload = () => {
    if (pathname === '/dashboard') {
      const newAnalysisButton = document.querySelector('[data-action="new-analysis"]') as HTMLButtonElement
      if (newAnalysisButton) {
        newAnalysisButton.click()
      } else {
        const uploadSection = document.querySelector('[data-section="upload"]')
        if (uploadSection) {
          uploadSection.scrollIntoView({ behavior: 'smooth' })
        }
      }
    } else {
      router.push('/dashboard')
    }
  }

  const handleTemplates = () => {
    if (pathname === '/dashboard') {
      const templatesButton = document.querySelector('[data-action="templates"]') as HTMLButtonElement
      if (templatesButton) {
        templatesButton.click()
      } else {
        alert('📋 Templates feature is available in the dashboard sidebar!')
      }
    } else {
      router.push('/dashboard')
    }
  }

  const handleAboutUs = () => {
    // Scroll to about section if on landing page
    if (pathname === '/') {
      const aboutSection = document.querySelector('[data-section="about"]')
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      router.push('/#about')
    }
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold text-white">ExcelAnalytics</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/dashboard">
              <Button 
                variant="ghost" 
                className={`${isActive('/dashboard') ? 'text-blue-400 bg-blue-900/20' : 'text-gray-300'} hover:text-white hover:bg-slate-700`}
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              onClick={handleAnalytics}
              className="text-gray-300 hover:text-white hover:bg-slate-700"
              title="View charts and analytics"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleHistory}
              className="text-gray-300 hover:text-white hover:bg-slate-700"
              title="View upload history"
            >
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleTemplates}
              className="text-gray-300 hover:text-white hover:bg-slate-700"
              title="View chart templates"
            >
              <Layout className="h-4 w-4 mr-2" />
              Templates
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleAboutUs}
              className="text-gray-300 hover:text-white hover:bg-slate-700"
            >
              <Info className="h-4 w-4 mr-2" />
              About Us
            </Button>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300 text-sm">Welcome, {user.name}</span>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 space-y-2"
          >
            <Link href="/dashboard">
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${isActive('/dashboard') ? 'text-blue-400 bg-blue-900/20' : 'text-gray-300'}`}
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              onClick={handleAnalytics}
              className="w-full justify-start text-gray-300"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleHistory}
              className="w-full justify-start text-gray-300"
            >
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleTemplates}
              className="w-full justify-start text-gray-300"
            >
              <Layout className="h-4 w-4 mr-2" />
              Templates
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleAboutUs}
              className="w-full justify-start text-gray-300"
            >
              <Info className="h-4 w-4 mr-2" />
              About Us
            </Button>
            {user ? (
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="w-full justify-start border-red-500 text-red-400"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Link href="/auth/signin">
                <Button variant="outline" className="w-full justify-start border-blue-500 text-blue-400">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  )
}