import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'

const Analytics = () => {
  const navigate = useNavigate()
  const [dateRange, setDateRange] = useState('30')
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  const [loading, setLoading] = useState(false)
  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: 125000,
    totalLeads: 342,
    conversionRate: 24.5,
    averageDealSize: 3650,
    newCustomers: 28,
    retentionRate: 94.2,
    salesGrowth: 18.7,
    customerLifetimeValue: 15200
  })

  const [chartData, setChartData] = useState({
    revenue: [
      { month: 'Jan', value: 12000 },
      { month: 'Feb', value: 15000 },
      { month: 'Mar', value: 18000 },
      { month: 'Apr', value: 22000 },
      { month: 'May', value: 19000 },
      { month: 'Jun', value: 25000 }
    ],
    leads: [
      { month: 'Jan', value: 45 },
      { month: 'Feb', value: 52 },
      { month: 'Mar', value: 61 },
      { month: 'Apr', value: 58 },
      { month: 'May', value: 67 },
      { month: 'Jun', value: 73 }
    ],
    conversion: [
      { stage: 'Lead', value: 100 },
      { stage: 'Qualified', value: 75 },
      { stage: 'Proposal', value: 45 },
      { stage: 'Negotiation', value: 32 },
      { stage: 'Closed Won', value: 24 }
    ]
  })

  const [filters, setFilters] = useState({
    region: 'all',
    source: 'all',
    product: 'all'
  })

  useEffect(() => {
    loadAnalyticsData()
  }, [dateRange, filters])

  const loadAnalyticsData = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update data based on filters and date range
      const multiplier = dateRange === '7' ? 0.3 : dateRange === '30' ? 1 : dateRange === '90' ? 2.5 : 4
      
      setAnalyticsData(prev => ({
        ...prev,
        totalRevenue: Math.round(prev.totalRevenue * multiplier),
        totalLeads: Math.round(prev.totalLeads * multiplier),
        newCustomers: Math.round(prev.newCustomers * multiplier)
      }))
      
      toast.success('Analytics data refreshed successfully')
    } catch (error) {
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const exportData = (format) => {
    setLoading(true)
    try {
      // Simulate export process
      setTimeout(() => {
        toast.success(`Data exported successfully as ${format.toUpperCase()}`)
        setLoading(false)
      }, 1500)
    } catch (error) {
      toast.error('Failed to export data')
      setLoading(false)
    }
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
    toast.info(`Filter applied: ${filterType} = ${value}`)
  }

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: `$${analyticsData.totalRevenue.toLocaleString()}`,
      change: '+18.7%',
      changeType: 'positive',
      icon: 'DollarSign'
    },
    {
      title: 'Total Leads',
      value: analyticsData.totalLeads.toLocaleString(),
      change: '+12.3%',
      changeType: 'positive',
      icon: 'Users'
    },
    {
      title: 'Conversion Rate',
      value: `${analyticsData.conversionRate}%`,
      change: '+5.2%',
      changeType: 'positive',
      icon: 'TrendingUp'
    },
    {
      title: 'Avg Deal Size',
      value: `$${analyticsData.averageDealSize.toLocaleString()}`,
      change: '-2.1%',
      changeType: 'negative',
      icon: 'Target'
    },
    {
      title: 'New Customers',
      value: analyticsData.newCustomers.toLocaleString(),
      change: '+28.9%',
      changeType: 'positive',
      icon: 'UserPlus'
    },
    {
      title: 'Retention Rate',
      value: `${analyticsData.retentionRate}%`,
      change: '+1.8%',
      changeType: 'positive',
      icon: 'Heart'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-surface-100 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 glass-effect border-b border-surface-200 dark:border-surface-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-surface-600 dark:text-surface-400 hover:text-primary transition-colors"
              >
                <ApperIcon name="ArrowLeft" className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                Analytics Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => exportData('pdf')}
                disabled={loading}
                className="btn-secondary flex items-center space-x-2"
              >
                <ApperIcon name="Download" className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
              
              <button
                onClick={() => exportData('csv')}
                disabled={loading}
                className="btn-primary flex items-center space-x-2"
              >
                <ApperIcon name="FileSpreadsheet" className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Filters & Controls */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card-container mb-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Date Range
                </label>
                <select 
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="input-field w-32"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Region
                </label>
                <select 
                  value={filters.region}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                  className="input-field w-32"
                >
                  <option value="all">All Regions</option>
                  <option value="north">North</option>
                  <option value="south">South</option>
                  <option value="east">East</option>
                  <option value="west">West</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Lead Source
                </label>
                <select 
                  value={filters.source}
                  onChange={(e) => handleFilterChange('source', e.target.value)}
                  className="input-field w-32"
                >
                  <option value="all">All Sources</option>
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="social">Social Media</option>
                  <option value="email">Email</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={loadAnalyticsData}
              disabled={loading}
              className="btn-primary flex items-center space-x-2"
            >
              <ApperIcon name="RefreshCw" className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {kpiCards.map((kpi, index) => (
            <div key={index} className="card-container">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-600 dark:text-surface-400">
                    {kpi.title}
                  </p>
                  <p className="text-2xl font-bold text-surface-900 dark:text-surface-100 mt-1">
                    {kpi.value}
                  </p>
                  <p className={`text-sm mt-1 flex items-center space-x-1 ${
                    kpi.changeType === 'positive' ? 'text-success' : 'text-danger'
                  }`}>
                    <ApperIcon 
                      name={kpi.changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'} 
                      className="w-3 h-3" 
                    />
                    <span>{kpi.change}</span>
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  kpi.changeType === 'positive' 
                    ? 'bg-success/10 text-success' 
                    : 'bg-danger/10 text-danger'
                }`}>
                  <ApperIcon name={kpi.icon} className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card-container"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                Revenue Trend
              </h3>
              <select 
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="text-sm border-0 bg-transparent text-surface-600 dark:text-surface-400 focus:ring-0"
              >
                <option value="revenue">Revenue</option>
                <option value="leads">Leads</option>
                <option value="customers">Customers</option>
              </select>
            </div>
            
            <div className="h-64 flex items-end justify-between space-x-2">
              {chartData.revenue.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-primary to-primary-light rounded-t-lg transition-all duration-300 hover:opacity-80"
                    style={{ height: `${(item.value / 25000) * 100}%` }}
                    title={`${item.month}: $${item.value.toLocaleString()}`}
                  ></div>
                  <span className="text-xs text-surface-500 dark:text-surface-400 mt-2">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Conversion Funnel */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="card-container"
          >
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-6">
              Conversion Funnel
            </h3>
            
            <div className="space-y-4">
              {chartData.conversion.map((stage, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                      {stage.stage}
                    </span>
                    <span className="text-sm text-surface-500 dark:text-surface-400">
                      {stage.value}%
                    </span>
                  </div>
                  <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
                      style={{ width: `${stage.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Performance Metrics */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card-container"
        >
          <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-6">
            Performance Insights
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Clock" className="w-8 h-8" />
              </div>
              <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">12.5</p>
              <p className="text-sm text-surface-600 dark:text-surface-400">Avg Response Time (hrs)</p>
            </div>
            
            <div className="text-center p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
              <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Star" className="w-8 h-8" />
              </div>
              <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">4.8</p>
              <p className="text-sm text-surface-600 dark:text-surface-400">Customer Satisfaction</p>
            </div>
            
            <div className="text-center p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
              <div className="w-16 h-16 bg-warning/10 text-warning rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Repeat" className="w-8 h-8" />
              </div>
              <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">34%</p>
              <p className="text-sm text-surface-600 dark:text-surface-400">Repeat Purchase Rate</p>
            </div>
            
            <div className="text-center p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Calendar" className="w-8 h-8" />
              </div>
              <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">18</p>
              <p className="text-sm text-surface-600 dark:text-surface-400">Days to Close (avg)</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default Analytics