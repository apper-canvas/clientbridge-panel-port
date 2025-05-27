import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)
  const navigate = useNavigate()


  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 glass-effect border-b border-surface-200 dark:border-surface-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-card">
                <ApperIcon name="Bridge" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                  ClientBridge
                </h1>
                <p className="text-xs text-surface-500 dark:text-surface-400">
                  CRM Platform
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all duration-200"
              >
                <ApperIcon 
                  name={darkMode ? "Sun" : "Moon"} 
                  className="w-5 h-5 text-surface-600 dark:text-surface-400" 
                />
              </button>
              
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center">
                  <ApperIcon name="User" className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  Demo User
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 shadow-soft"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto scrollbar-hide py-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium whitespace-nowrap">
              <ApperIcon name="Users" className="w-4 h-4" />
              <span className="hidden sm:inline">Customers</span>
            </button>
            <button 
              onClick={() => navigate('/pipeline')}
              className="flex items-center space-x-2 px-4 py-2 text-surface-600 dark:text-surface-400 hover:text-primary hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg transition-all duration-200 whitespace-nowrap"
            >
              <ApperIcon name="TrendingUp" className="w-4 h-4" />
              <span className="hidden sm:inline">Pipeline</span>
            </button>

            <button className="flex items-center space-x-2 px-4 py-2 text-surface-600 dark:text-surface-400 hover:text-primary hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg transition-all duration-200 whitespace-nowrap">
              <ApperIcon name="Calendar" className="w-4 h-4" />
              <span className="hidden sm:inline">Tasks</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 text-surface-600 dark:text-surface-400 hover:text-primary hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg transition-all duration-200 whitespace-nowrap">
              <ApperIcon name="BarChart3" className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <MainFeature />
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-surface-50 dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 mt-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Bridge" className="w-5 h-5 text-primary" />
              <span className="text-sm text-surface-600 dark:text-surface-400">
                ClientBridge CRM © 2024
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-surface-500 dark:text-surface-400">
              <span>Demo Version</span>
              <span>•</span>
              <span>Built with React</span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default Home