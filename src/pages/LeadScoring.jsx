import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, addDays, subDays } from 'date-fns'
import ApperIcon from '../components/ApperIcon'

const LeadScoring = () => {
  const [leads, setLeads] = useState([])
  const [scoreFilter, setScoreFilter] = useState('all')
  const [temperatureFilter, setTemperatureFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showBatchScoring, setShowBatchScoring] = useState(false)
  const [selectedLeads, setSelectedLeads] = useState([])
  const [scoringCriteria, setScoringCriteria] = useState({
    companySize: 25,
    budget: 25,
    timeline: 20,
    industry: 15,
    engagement: 15
  })
  const [showCriteriaConfig, setShowCriteriaConfig] = useState(false)
  
  // Lead scoring algorithm
  const calculateLeadScore = (lead, criteria = scoringCriteria) => {
    let score = 0
    
    // Company size scoring
    const companySizeScores = {
      'startup': Math.round(criteria.companySize * 0.4),
      'small': Math.round(criteria.companySize * 0.6),
      'medium': Math.round(criteria.companySize * 0.8),
      'large': criteria.companySize,
      'enterprise': criteria.companySize
    }
    score += companySizeScores[lead.companySize] || 0
    
    // Budget scoring
    const budgetScores = {
      'low': Math.round(criteria.budget * 0.2),
      'medium': Math.round(criteria.budget * 0.6),
      'high': criteria.budget,
      'unknown': Math.round(criteria.budget * 0.4)
    }
    score += budgetScores[lead.budget] || 0
    
    // Timeline scoring
    const timelineScores = {
      'immediate': criteria.timeline,
      'short': Math.round(criteria.timeline * 0.75),
      'medium': Math.round(criteria.timeline * 0.5),
      'long': Math.round(criteria.timeline * 0.25)
    }
    score += timelineScores[lead.timeline] || 0
    
    // Industry fit scoring
    const industryScores = {
      'technology': criteria.industry,
      'healthcare': Math.round(criteria.industry * 0.8),
      'finance': Math.round(criteria.industry * 0.67),
      'manufacturing': Math.round(criteria.industry * 0.53),
      'retail': Math.round(criteria.industry * 0.4),
      'other': Math.round(criteria.industry * 0.2)
    }
    score += industryScores[lead.industry] || 0
    
    // Engagement scoring
    const daysSinceContact = Math.floor((new Date() - lead.lastContact) / (1000 * 60 * 60 * 24))
    if (daysSinceContact <= 1) score += criteria.engagement
    else if (daysSinceContact <= 7) score += Math.round(criteria.engagement * 0.67)
    else if (daysSinceContact <= 30) score += Math.round(criteria.engagement * 0.33)
    
    return Math.min(score, 100)
  }
  
  // Get lead temperature based on score
  const getLeadTemperature = (score) => {
    if (score >= 80) return 'hot'
    if (score >= 60) return 'warm'
    if (score >= 40) return 'lukewarm'
    return 'cold'
  }
  
  // Sample data initialization
  useEffect(() => {
    const sampleLeads = [
      {
        id: '1',
        name: 'Sarah Chen',
        email: 'sarah.chen@techcorp.com',
        company: 'TechCorp Solutions',
        status: 'prospect',
        companySize: 'large',
        budget: 'high',
        timeline: 'short',
        industry: 'technology',
        lastContact: subDays(new Date(), 1),
        source: 'Website',
        phone: '+1 (555) 123-4567'
      },
      {
        id: '2',
        name: 'Marcus Johnson',
        email: 'm.johnson@innovate.io',
        company: 'Innovate Labs',
        status: 'lead',
        companySize: 'medium',
        budget: 'medium',
        timeline: 'medium',
        industry: 'technology',
        lastContact: subDays(new Date(), 5),
        source: 'Referral',
        phone: '+1 (555) 987-6543'
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily.r@startupxyz.com',
        company: 'StartupXYZ',
        status: 'lead',
        companySize: 'startup',
        budget: 'low',
        timeline: 'immediate',
        industry: 'technology',
        lastContact: new Date(),
        source: 'Event',
        phone: '+1 (555) 456-7890'
      },
      {
        id: '4',
        name: 'David Wilson',
        email: 'd.wilson@healthplus.com',
        company: 'HealthPlus Medical',
        status: 'lead',
        companySize: 'large',
        budget: 'high',
        timeline: 'long',
        industry: 'healthcare',
        lastContact: subDays(new Date(), 10),
        source: 'LinkedIn',
        phone: '+1 (555) 321-0987'
      },
      {
        id: '5',
        name: 'Lisa Zhang',
        email: 'l.zhang@financetech.com',
        company: 'FinanceTech Inc',
        status: 'prospect',
        companySize: 'medium',
        budget: 'medium',
        timeline: 'short',
        industry: 'finance',
        lastContact: subDays(new Date(), 3),
        source: 'Google Ads',
        phone: '+1 (555) 654-3210'
      }
    ]
    setLeads(sampleLeads)
  }, [])
  
  // Filter leads based on search and filters
  const filteredLeads = leads.filter(lead => {
    const score = calculateLeadScore(lead)
    const temperature = getLeadTemperature(score)
    
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesScore = scoreFilter === 'all' ||
                        (scoreFilter === 'high' && score >= 80) ||
                        (scoreFilter === 'medium' && score >= 40 && score < 80) ||
                        (scoreFilter === 'low' && score < 40)
    
    const matchesTemp = temperatureFilter === 'all' || temperature === temperatureFilter
    
    return matchesSearch && matchesScore && matchesTemp
  })
  
  // Sort leads by score (highest first)
  const sortedLeads = [...filteredLeads].sort((a, b) => 
    calculateLeadScore(b) - calculateLeadScore(a)
  )
  
  // Get scoring statistics
  const getScoreStats = () => {
    const scores = leads.map(lead => calculateLeadScore(lead))
    const temperatures = scores.map(score => getLeadTemperature(score))
    
    return {
      total: leads.length,
      averageScore: Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) || 0,
      hot: temperatures.filter(temp => temp === 'hot').length,
      warm: temperatures.filter(temp => temp === 'warm').length,
      lukewarm: temperatures.filter(temp => temp === 'lukewarm').length,
      cold: temperatures.filter(temp => temp === 'cold').length
    }
  }
  
  const stats = getScoreStats()
  
  // Handle batch scoring
  const handleBatchScoring = (newCriteria) => {
    setScoringCriteria(newCriteria)
    setShowBatchScoring(false)
    toast.success(`Batch scoring applied to ${leads.length} leads with new criteria!`)
  }
  
  // Handle individual lead scoring update
  const handleLeadUpdate = (leadId, updates) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, ...updates, lastContact: new Date() } : lead
    ))
    toast.success('Lead scoring updated successfully!')
  }
  
  // Export leads
  const handleExport = () => {
    const exportData = sortedLeads.map(lead => ({
      name: lead.name,
      email: lead.email,
      company: lead.company,
      score: calculateLeadScore(lead),
      temperature: getLeadTemperature(calculateLeadScore(lead)),
      companySize: lead.companySize,
      budget: lead.budget,
      timeline: lead.timeline,
      industry: lead.industry,
      lastContact: format(lead.lastContact, 'yyyy-MM-dd')
    }))
    
    const csvContent = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lead-scores-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Lead scores exported successfully!')
  }
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-red-600 bg-red-50 border-red-200'
    if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200'
    if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-blue-600 bg-blue-50 border-blue-200'
  }
  
  const getTemperatureIcon = (score) => {
    const temp = getLeadTemperature(score)
    if (temp === 'hot') return '🔥'
    if (temp === 'warm') return '🌡️'
    if (temp === 'lukewarm') return '🌤️'
    return '❄️'
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-surface-100 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
        >
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                <ApperIcon name="ArrowLeft" className="w-5 h-5 text-surface-600" />
              </button>
              <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-100">
                🎯 Lead Scoring System
              </h1>
            </div>
            <p className="text-surface-600 dark:text-surface-400">
              Prioritize and qualify leads with intelligent scoring algorithms
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mt-4 lg:mt-0">
            <button
              onClick={() => setShowCriteriaConfig(true)}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-card"
            >
              <ApperIcon name="Settings" className="w-4 h-4" />
              <span>Configure Criteria</span>
            </button>
            
            <button
              onClick={() => setShowBatchScoring(true)}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-card"
            >
              <ApperIcon name="Zap" className="w-4 h-4" />
              <span>Batch Score</span>
            </button>
            
            <button
              onClick={handleExport}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-card"
            >
              <ApperIcon name="Download" className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </motion.div>
        
        {/* Statistics Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
        >
          <div className="card-container text-center">
            <div className="text-2xl font-bold text-primary mb-1">{stats.total}</div>
            <div className="text-sm text-surface-600 dark:text-surface-400">Total Leads</div>
          </div>
          
          <div className="card-container text-center">
            <div className="text-2xl font-bold text-secondary mb-1">{stats.averageScore}</div>
            <div className="text-sm text-surface-600 dark:text-surface-400">Avg Score</div>
          </div>
          
          <div className="card-container text-center">
            <div className="text-2xl font-bold text-red-500 mb-1">🔥 {stats.hot}</div>
            <div className="text-sm text-surface-600 dark:text-surface-400">Hot Leads</div>
          </div>
          
          <div className="card-container text-center">
            <div className="text-2xl font-bold text-orange-500 mb-1">🌡️ {stats.warm}</div>
            <div className="text-sm text-surface-600 dark:text-surface-400">Warm Leads</div>
          </div>
          
          <div className="card-container text-center">
            <div className="text-2xl font-bold text-blue-500 mb-1">❄️ {stats.cold}</div>
            <div className="text-sm text-surface-600 dark:text-surface-400">Cold Leads</div>
          </div>
        </motion.div>
        
        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-container mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                placeholder="Search leads by name, company, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              className="input-field w-full lg:w-auto"
            >
              <option value="all">All Scores</option>
              <option value="high">High (80-100)</option>
              <option value="medium">Medium (40-79)</option>
              <option value="low">Low (0-39)</option>
            </select>
            
            <select
              value={temperatureFilter}
              onChange={(e) => setTemperatureFilter(e.target.value)}
              className="input-field w-full lg:w-auto"
            >
              <option value="all">All Temperatures</option>
              <option value="hot">🔥 Hot</option>
              <option value="warm">🌡️ Warm</option>
              <option value="lukewarm">🌤️ Lukewarm</option>
              <option value="cold">❄️ Cold</option>
            </select>
          </div>
        </motion.div>
        
        {/* Leads List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-container"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
              Lead Scores ({sortedLeads.length})
            </h2>
            <div className="text-sm text-surface-500 dark:text-surface-400">
              Sorted by score (highest first)
            </div>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-hide">
            <AnimatePresence>
              {sortedLeads.map((lead, index) => {
                const score = calculateLeadScore(lead)
                const temperature = getLeadTemperature(score)
                
                return (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    className="p-4 border border-surface-200 dark:border-surface-700 rounded-xl hover:border-primary hover:shadow-card transition-all duration-200 bg-white dark:bg-surface-800"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-card">
                            <span className="text-white font-semibold">
                              {lead.name.charAt(0)}
                            </span>
                          </div>
                          <div className="absolute -top-1 -right-1 text-lg">
                            {getTemperatureIcon(score)}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-surface-900 dark:text-surface-100">
                            {lead.name}
                          </h3>
                          <p className="text-sm text-surface-600 dark:text-surface-400">
                            {lead.company}
                          </p>
                          <p className="text-xs text-surface-500 dark:text-surface-500">
                            {lead.email} • {lead.source}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-lg border font-semibold ${getScoreColor(score)}`}>
                            {score}/100
                          </div>
                          <div className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                            {temperature.toUpperCase()}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => {
                            // Quick score adjustment
                            const newScore = prompt(`Current score: ${score}\nEnter quick adjustment (+/- points):`, '0')
                            if (newScore !== null) {
                              const adjustment = parseInt(newScore)
                              if (!isNaN(adjustment)) {
                                // This is a simplified quick adjustment - in real app would update underlying data
                                toast.success(`Score adjusted by ${adjustment} points`)
                              }
                            }
                          }}
                          className="p-2 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                          title="Quick score adjustment"
                        >
                          <ApperIcon name="Edit3" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Score Breakdown */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-surface-500 dark:text-surface-400">Size:</span>
                        <span className="font-medium capitalize">{lead.companySize}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-surface-500 dark:text-surface-400">Budget:</span>
                        <span className="font-medium capitalize">{lead.budget}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-surface-500 dark:text-surface-400">Timeline:</span>
                        <span className="font-medium capitalize">{lead.timeline}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-surface-500 dark:text-surface-400">Industry:</span>
                        <span className="font-medium capitalize">{lead.industry}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-surface-500 dark:text-surface-400">Contact:</span>
                        <span className="font-medium">{format(lead.lastContact, 'MMM dd')}</span>
                      </div>
                    </div>
                    
                    {/* Score Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-surface-200 dark:bg-surface-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            score >= 80 ? 'bg-red-500' :
                            score >= 60 ? 'bg-orange-500' :
                            score >= 40 ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            
            {sortedLeads.length === 0 && (
              <div className="text-center py-12">
                <ApperIcon name="Search" className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
                <p className="text-surface-500 dark:text-surface-400">
                  No leads match your current filters
                </p>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Scoring Criteria Configuration Modal */}
        <AnimatePresence>
          {showCriteriaConfig && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowCriteriaConfig(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-surface-800 rounded-2xl shadow-card max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
                      ⚙️ Scoring Criteria
                    </h3>
                    <button
                      onClick={() => setShowCriteriaConfig(false)}
                      className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                    >
                      <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                    </button>
                  </div>
                  
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault()
                      const formData = new FormData(e.target)
                      const newCriteria = {
                        companySize: parseInt(formData.get('companySize')),
                        budget: parseInt(formData.get('budget')),
                        timeline: parseInt(formData.get('timeline')),
                        industry: parseInt(formData.get('industry')),
                        engagement: parseInt(formData.get('engagement'))
                      }
                      
                      const total = Object.values(newCriteria).reduce((sum, val) => sum + val, 0)
                      if (total !== 100) {
                        toast.error('Total weight must equal 100%')
                        return
                      }
                      
                      handleBatchScoring(newCriteria)
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Company Size Weight (%)
                      </label>
                      <input
                        type="number"
                        name="companySize"
                        defaultValue={scoringCriteria.companySize}
                        min="0"
                        max="100"
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Budget Range Weight (%)
                      </label>
                      <input
                        type="number"
                        name="budget"
                        defaultValue={scoringCriteria.budget}
                        min="0"
                        max="100"
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Timeline Weight (%)
                      </label>
                      <input
                        type="number"
                        name="timeline"
                        defaultValue={scoringCriteria.timeline}
                        min="0"
                        max="100"
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Industry Fit Weight (%)
                      </label>
                      <input
                        type="number"
                        name="industry"
                        defaultValue={scoringCriteria.industry}
                        min="0"
                        max="100"
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Engagement Weight (%)
                      </label>
                      <input
                        type="number"
                        name="engagement"
                        defaultValue={scoringCriteria.engagement}
                        min="0"
                        max="100"
                        className="input-field"
                      />
                    </div>
                    
                    <div className="bg-surface-50 dark:bg-surface-700 p-3 rounded-lg">
                      <p className="text-sm text-surface-600 dark:text-surface-400">
                        <strong>Note:</strong> Total weights must equal 100%. Current total: {Object.values(scoringCriteria).reduce((sum, val) => sum + val, 0)}%
                      </p>
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowCriteriaConfig(false)}
                        className="btn-secondary flex-1"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-primary flex-1"
                      >
                        Apply Changes
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Batch Scoring Modal */}
        <AnimatePresence>
          {showBatchScoring && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowBatchScoring(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-surface-800 rounded-2xl shadow-card max-w-lg w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
                      ⚡ Batch Scoring
                    </h3>
                    <button
                      onClick={() => setShowBatchScoring(false)}
                      className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                    >
                      <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        📊 Current Scoring Performance
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-blue-700 dark:text-blue-300">Average Score</div>
                          <div className="font-bold text-blue-900 dark:text-blue-100">{stats.averageScore}/100</div>
                        </div>
                        <div>
                          <div className="text-blue-700 dark:text-blue-300">Hot Leads</div>
                          <div className="font-bold text-blue-900 dark:text-blue-100">{stats.hot} of {stats.total}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          // Simulate batch re-scoring with engagement boost
                          setLeads(prev => prev.map(lead => ({
                            ...lead,
                            lastContact: new Date() // Boost all engagement scores
                          })))
                          setShowBatchScoring(false)
                          toast.success('🚀 All leads re-scored with engagement boost!')
                        }}
                        className="w-full p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left"
                      >
                        <div className="font-semibold text-green-900 mb-1">
                          🚀 Engagement Boost
                        </div>
                        <div className="text-sm text-green-700">
                          Mark all leads as recently contacted to boost engagement scores
                        </div>
                      </button>
                      
                      <button
                        onClick={() => {
                          // Simulate industry-based scoring adjustment
                          const industryMultipliers = {
                            'technology': 1.2,
                            'healthcare': 1.1,
                            'finance': 1.0,
                            'manufacturing': 0.9,
                            'retail': 0.8,
                            'other': 0.7
                          }
                          
                          setLeads(prev => prev.map(lead => {
                            const multiplier = industryMultipliers[lead.industry] || 1.0
                            // In real implementation, would adjust underlying scoring factors
                            return { ...lead, industryMultiplier: multiplier }
                          }))
                          
                          setShowBatchScoring(false)
                          toast.success('🎯 Industry-based scoring adjustments applied!')
                        }}
                        className="w-full p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left"
                      >
                        <div className="font-semibold text-purple-900 mb-1">
                          🎯 Industry Focus
                        </div>
                        <div className="text-sm text-purple-700">
                          Apply industry-specific scoring multipliers based on fit
                        </div>
                      </button>
                      
                      <button
                        onClick={() => {
                          // Simulate timeline urgency scoring
                          setLeads(prev => prev.map(lead => {
                            const timelineBoosts = {
                              'immediate': 10,
                              'short': 5,
                              'medium': 0,
                              'long': -5
                            }
                            return { ...lead, timelineBoost: timelineBoosts[lead.timeline] || 0 }
                          }))
                          
                          setShowBatchScoring(false)
                          toast.success('⏰ Timeline urgency scoring applied!')
                        }}
                        className="w-full p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-left"
                      >
                        <div className="font-semibold text-orange-900 mb-1">
                          ⏰ Timeline Urgency
                        </div>
                        <div className="text-sm text-orange-700">
                          Boost scores based on immediate and short-term timelines
                        </div>
                      </button>
                    </div>
                    
                    <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
                      <button
                        onClick={() => setShowBatchScoring(false)}
                        className="btn-secondary w-full"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default LeadScoring