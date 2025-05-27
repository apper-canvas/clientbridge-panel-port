import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-card"
        >
          <ApperIcon name="AlertTriangle" className="w-12 h-12 text-white" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-6xl sm:text-8xl font-bold text-surface-200 dark:text-surface-700 mb-4"
        >
          404
        </motion.h1>
        
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-2xl sm:text-3xl font-semibold text-surface-900 dark:text-surface-100 mb-4"
        >
          Page Not Found
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-surface-600 dark:text-surface-400 mb-8 max-w-md mx-auto"
        >
          The page you're looking for doesn't exist or has been moved to a different location.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 btn-primary"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound