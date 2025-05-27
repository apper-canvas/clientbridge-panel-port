import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, addDays } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletingCustomerId, setDeletingCustomerId] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [view, setView] = useState('list') // 'list', 'pipeline', 'analytics'
  
  const [dragOver, setDragOver] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'lead',
    notes: '',
    companySize: 'small',
    budget: 'unknown',
    timeline: 'long',
    industry: 'technology',
    attachments: []
  })

  
  // Lead scoring state
  const [showScoring, setShowScoring] = useState(false)
  const [scoringCustomerId, setScoringCustomerId] = useState(null)


  // Sample data initialization
  // Lead scoring algorithm
  const calculateLeadScore = (customer) => {
    let score = 0
    
    // Company size scoring (0-25 points)
    const companySizeScores = {
      'startup': 10,
      'small': 15,
      'medium': 20,
      'large': 25,
      'enterprise': 25
    }
    score += companySizeScores[customer.companySize] || 0
    
    // Budget scoring (0-25 points)
    const budgetScores = {
      'low': 5,
      'medium': 15,
      'high': 25,
      'unknown': 10
    }
    score += budgetScores[customer.budget] || 0
    
    // Timeline scoring (0-20 points)
    const timelineScores = {
      'immediate': 20,
      'short': 15,
      'medium': 10,
      'long': 5
    }
    score += timelineScores[customer.timeline] || 0
    
    // Industry fit scoring (0-15 points)
    const industryScores = {
      'technology': 15,
      'healthcare': 12,
      'finance': 10,
      'manufacturing': 8,
      'retail': 6,
      'other': 3
    }
    score += industryScores[customer.industry] || 0
    
    // Engagement scoring (0-15 points)
    const daysSinceContact = Math.floor((new Date() - customer.lastContact) / (1000 * 60 * 60 * 24))
    if (daysSinceContact <= 1) score += 15
    else if (daysSinceContact <= 7) score += 10
    else if (daysSinceContact <= 30) score += 5
    
    // Deal value scoring (0-10 points)
    const totalDealValue = customer.deals?.reduce((sum, deal) => sum + deal.value, 0) || 0
    if (totalDealValue >= 50000) score += 10
    else if (totalDealValue >= 20000) score += 7
    else if (totalDealValue >= 5000) score += 4
    
    return Math.min(score, 100) // Cap at 100
  }
  
  // Get lead temperature based on score
  const getLeadTemperature = (score) => {
    if (score >= 80) return 'hot'
    if (score >= 60) return 'warm'
    if (score >= 40) return 'lukewarm'
    return 'cold'
  }
  
  // Automated workflow based on score
  const triggerAutomatedWorkflow = (customer, score) => {
    const temperature = getLeadTemperature(score)
    
    if (temperature === 'hot' && customer.status === 'lead') {
      // Auto-promote to prospect and create high-priority task
      setCustomers(prev => prev.map(c => 
        c.id === customer.id 
          ? {
              ...c,
              status: 'prospect',
              tasks: [
                ...c.tasks,
                {
                  id: `task_${Date.now()}`,
                  title: 'Immediate follow-up required - Hot lead!',
                  dueDate: new Date(),
                  priority: 'high',
                  completed: false,
                  automated: true
                }
              ]
            }
          : c
      ))
      toast.success(`🔥 ${customer.name} promoted to hot prospect with auto-task created!`)
    } else if (temperature === 'warm') {
      // Create medium priority task for warm leads
      setCustomers(prev => prev.map(c => 
        c.id === customer.id 
          ? {
              ...c,
              tasks: [
                ...c.tasks.filter(t => !t.automated),
                {
                  id: `task_${Date.now()}`,
                  title: 'Follow up with warm lead',
                  dueDate: addDays(new Date(), 2),
                  priority: 'medium',
                  completed: false,
                  automated: true
                }
              ]
            }
          : c
      ))
      toast.info(`🌡️ ${customer.name} marked as warm lead with follow-up scheduled`)
    } else if (temperature === 'cold') {
      // Create nurturing task for cold leads
      setCustomers(prev => prev.map(c => 
        c.id === customer.id 
          ? {
              ...c,
              tasks: [
                ...c.tasks.filter(t => !t.automated),
                {
                  id: `task_${Date.now()}`,
                  title: 'Add to nurturing campaign',
                  dueDate: addDays(new Date(), 7),
                  priority: 'low',
                  completed: false,
                  automated: true
                }
              ]
            }
          : c
      ))
      toast.info(`❄️ ${customer.name} added to cold lead nurturing workflow`)
    }
  }

  // Sample data initialization with scoring data
  useEffect(() => {

    const sampleCustomers = [
      {
        id: '1',
        name: 'Sarah Chen',
        email: 'sarah.chen@techcorp.com',
        phone: '+1 (555) 123-4567',
        company: 'TechCorp Solutions',
        status: 'active',
        createdAt: new Date('2024-01-15'),
        lastContact: new Date('2024-01-20'),
        notes: 'Interested in enterprise package. Follow up next week.',
        companySize: 'large',
        budget: 'high',
        timeline: 'short',
        industry: 'technology',
        attachments: [
          {
            id: 'att1',
            name: 'meeting-notes-jan20.pdf',
            type: 'application/pdf',
            size: 245000,
            uploadedAt: new Date('2024-01-20'),
            url: '#'
          },
          {
            id: 'att2',
            name: 'company-logo.png',
            type: 'image/png',
            size: 89000,
            uploadedAt: new Date('2024-01-15'),
            url: '#'
          }
        ],
        deals: [
          { id: 'd1', title: 'Enterprise License', value: 25000, stage: 'proposal', probability: 75 }
        ],
        tasks: [
          { id: 't1', title: 'Send proposal', dueDate: addDays(new Date(), 2), priority: 'high', completed: false }
        ]
      },
      {
        id: '2',
        name: 'Marcus Johnson',
        email: 'm.johnson@innovate.io',
        phone: '+1 (555) 987-6543',
        company: 'Innovate Labs',
        status: 'lead',
        createdAt: new Date('2024-01-18'),
        lastContact: new Date('2024-01-18'),
        notes: 'Cold lead from website form. Initial interest in consulting services.',
        companySize: 'medium',
        budget: 'medium',
        timeline: 'medium',
        industry: 'technology',
        attachments: [],
        deals: [],
        tasks: [
          { id: 't2', title: 'Initial qualification call', dueDate: addDays(new Date(), 1), priority: 'medium', completed: false }
        ]
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily.r@startupxyz.com',
        phone: '+1 (555) 456-7890',
        company: 'StartupXYZ',
        status: 'prospect',
        createdAt: new Date('2024-01-10'),
        lastContact: new Date('2024-01-22'),
        notes: 'Met at tech conference. Very interested in our startup package.',
        companySize: 'startup',
        budget: 'low',
        timeline: 'immediate',
        industry: 'technology',
        attachments: [
          {
            id: 'att3',
            name: 'startup-requirements.docx',
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            size: 156000,
            uploadedAt: new Date('2024-01-22'),
            url: '#'
          }
        ],
        deals: [
          { id: 'd2', title: 'Startup Package', value: 5000, stage: 'negotiation', probability: 60 }
        ],
        tasks: []
      }
    ]
    setCustomers(sampleCustomers)
  }, [])


  // Filter customers based on search and status
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleScoreUpdate = (customerId, newScoreData) => {
    setCustomers(prev => prev.map(customer => {
      if (customer.id === customerId) {
        const updatedCustomer = { ...customer, ...newScoreData, lastContact: new Date() }
        const score = calculateLeadScore(updatedCustomer)
        
        // Trigger automated workflow
        setTimeout(() => triggerAutomatedWorkflow(updatedCustomer, score), 500)
        
        return updatedCustomer
      }
      return customer
    }))
    setScoringCustomerId(null)
    setShowScoring(false)
    toast.success('Lead scoring updated and workflow triggered!')
  }



  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.company) {
      toast.error('Please fill in all required fields')
      return
    }
    
    const newCustomer = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date(),
      lastContact: new Date(),
      deals: [],
      tasks: [],
      attachments: []
    }



    setCustomers(prev => [newCustomer, ...prev])
    
    // Calculate initial score and trigger workflow
    const score = calculateLeadScore(newCustomer)
    setTimeout(() => triggerAutomatedWorkflow(newCustomer, score), 1000)
    
    setFormData({ 
      name: '', 
      email: '', 
      phone: '', 
      company: '', 
      status: 'lead', 
      notes: '',
      companySize: 'small',
      budget: 'unknown',
      timeline: 'long',
      industry: 'technology'
    })
    setShowAddForm(false)
    toast.success('Customer added successfully with automated scoring!')
  }




  const handleStatusChange = (customerId, newStatus) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId ? { ...customer, status: newStatus, lastContact: new Date() } : customer
    ))
    toast.success('Customer status updated!')
  }

  const handleEdit = (customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      company: customer.company,
      status: customer.status,
      notes: customer.notes || '',
      companySize: customer.companySize || 'small',
      budget: customer.budget || 'unknown',
      timeline: customer.timeline || 'long',
      industry: customer.industry || 'technology'
    })
    setShowEditForm(true)
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.company) {
      toast.error('Please fill in all required fields')
      return
    }

    setCustomers(prev => prev.map(customer => 
      customer.id === editingCustomer.id 
        ? {
            ...customer,
            ...formData,
            lastContact: new Date()
          }
        : customer
    ))
    
    setFormData({ 
      name: '', 
      email: '', 
      phone: '', 
      company: '', 
      status: 'lead', 
      notes: '',
      companySize: 'small',
      budget: 'unknown',
      timeline: 'long',
      industry: 'technology'
    })
    setShowEditForm(false)
    setEditingCustomer(null)
    
    // Update selected customer if it was the one being edited
    if (selectedCustomer?.id === editingCustomer.id) {
      setSelectedCustomer(prev => ({ ...prev, ...formData, lastContact: new Date() }))
    }
    
    toast.success('Customer updated successfully!')
  }

  const handleDelete = (customerId) => {
    setDeletingCustomerId(customerId)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = () => {
    const customerToDelete = customers.find(c => c.id === deletingCustomerId)
    
    setCustomers(prev => prev.filter(customer => customer.id !== deletingCustomerId))
    
    // Clear selected customer if it was the one being deleted
    if (selectedCustomer?.id === deletingCustomerId) {
      setSelectedCustomer(null)
    }
    
    setShowDeleteConfirm(false)
    setDeletingCustomerId(null)
    toast.success(`${customerToDelete?.name} has been deleted successfully`)
  }


  const handleFileUpload = async (customerId, files) => {
    setUploadingFile(true)
    
    try {
      const validFiles = Array.from(files).filter(file => {
        const validTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg',
          'image/png',
          'image/gif',
          'text/plain',
          'text/csv'
        ]
        
        if (!validTypes.includes(file.type)) {
          toast.error(`File type ${file.type} not supported`)
          return false
        }
        
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          toast.error(`File ${file.name} is too large (max 10MB)`)
          return false
        }
        
        return true
      })
      
      if (validFiles.length === 0) {
        setUploadingFile(false)
        return
      }
      
      const newAttachments = validFiles.map(file => ({
        id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
        url: URL.createObjectURL(file) // In real app, this would be server URL
      }))
      
      setCustomers(prev => prev.map(customer => 
        customer.id === customerId 
          ? { 
              ...customer, 
              attachments: [...customer.attachments, ...newAttachments],
              lastContact: new Date()
            }
          : customer
      ))
      
      // Update selected customer if it matches
      setSelectedCustomer(prev => {
        if (prev && prev.id === customerId) {
          return {
            ...prev,
            attachments: [...prev.attachments, ...newAttachments],
            lastContact: new Date()
          }
        }
        return prev
      })
      
      toast.success(`${newAttachments.length} file(s) uploaded successfully`)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload files')
    } finally {
      setUploadingFile(false)
    }
  }
  
  const handleDeleteAttachment = (customerId, attachmentId) => {
    if (!window.confirm('Are you sure you want to delete this attachment?')) return
    
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId 
        ? { 
            ...customer, 
            attachments: customer.attachments.filter(att => att.id !== attachmentId),
            lastContact: new Date()
          }
        : customer
    ))
    
    // Update selected customer if it matches
    setSelectedCustomer(prev => {
      if (prev && prev.id === customerId) {
        return {
          ...prev,
          attachments: prev.attachments.filter(att => att.id !== attachmentId),
          lastContact: new Date()
        }
      }
      return prev
    })
    
    toast.success('Attachment deleted successfully')
  }
  
  const handleDownloadAttachment = (attachment) => {
    // In real app, this would download from server
    const link = document.createElement('a')
    link.href = attachment.url
    link.download = attachment.name
    link.click()
    toast.success(`Downloaded ${attachment.name}`)
  }
  
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return '🖼️'
    if (fileType.includes('pdf')) return '📄'
    if (fileType.includes('word') || fileType.includes('document')) return '📝'
    if (fileType.includes('text')) return '📃'
    return '📎'
  }
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }


  const getScoreColor = (score) => {
    if (score >= 80) return 'text-red-600 bg-red-50 border-red-200' // Hot
    if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200' // Warm
    if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200' // Lukewarm
    return 'text-blue-600 bg-blue-50 border-blue-200' // Cold
  }

  const getTemperatureIcon = (score) => {
    const temp = getLeadTemperature(score)
    if (temp === 'hot') return '🔥'
    if (temp === 'warm') return '🌡️'
    if (temp === 'lukewarm') return '🌤️'
    return '❄️'
  }


  const getStatusColor = (status) => {
    const colors = {
      lead: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      prospect: 'bg-blue-100 text-blue-800 border-blue-200',
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[status] || colors.lead
  }

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-orange-100 text-orange-800 border-orange-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    }
    return colors[priority] || colors.medium
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
      >
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-surface-100 mb-2">
            Customer Management
          </h2>
          <p className="text-surface-600 dark:text-surface-400">
            Manage your customer relationships and track interactions
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="flex items-center space-x-2 bg-surface-100 dark:bg-surface-800 rounded-lg p-1">
            <button
              onClick={() => setView('list')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                view === 'list' 
                  ? 'bg-white dark:bg-surface-700 text-primary shadow-card' 
                  : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200'
              }`}
            >
              <ApperIcon name="List" className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setView('pipeline')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                view === 'pipeline' 
                  ? 'bg-white dark:bg-surface-700 text-primary shadow-card' 
                  : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200'
              }`}
            >
              <ApperIcon name="TrendingUp" className="w-4 h-4" />
              <span className="hidden sm:inline">Pipeline</span>
            </button>
            <button
              onClick={() => setView('analytics')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                view === 'analytics' 
                  ? 'bg-white dark:bg-surface-700 text-primary shadow-card' 
                  : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200'
              }`}
            >
              <ApperIcon name="BarChart3" className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </button>
          </div>
          
          <button
            onClick={() => {
              window.location.href = '/lead-scoring'
            }}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-card"
          >
            <span>🎯</span>
            <span className="hidden sm:inline">Lead Scoring</span>
          </button>

          
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      {view === 'list' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4"
        >
          <div className="flex-1 relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              placeholder="Search customers, companies, or emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field w-full sm:w-auto"
          >
            <option value="all">All Status</option>
            <option value="lead">Leads</option>
            <option value="prospect">Prospects</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </motion.div>
      )}

      {/* Main Content Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {view === 'list' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Customer List */}
            <div className="xl:col-span-2">
              <div className="card-container">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                    Customers ({filteredCustomers.length})
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-surface-500 dark:text-surface-400">
                    <ApperIcon name="Users" className="w-4 h-4" />
                    <span>{customers.length} total</span>
                  </div>
                </div>
                
                <div className="space-y-4 max-h-96 lg:max-h-[600px] overflow-y-auto scrollbar-hide">
                  <AnimatePresence>
                    {filteredCustomers.map((customer, index) => (
                      <motion.div
                        key={customer.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        onClick={() => setSelectedCustomer(customer)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                          selectedCustomer?.id === customer.id
                            ? 'border-primary bg-primary bg-opacity-5 shadow-glow'
                            : 'border-surface-200 dark:border-surface-700 hover:border-primary hover:shadow-card bg-white dark:bg-surface-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-card">
                                <span className="text-white font-semibold text-sm">
                                  {customer.name.charAt(0)}
                                </span>
                              </div>
                              <div className="absolute -top-1 -right-1 text-xs">
                                {getTemperatureIcon(calculateLeadScore(customer))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-surface-900 dark:text-surface-100">
                                {customer.name}
                              </h4>
                              <p className="text-sm text-surface-600 dark:text-surface-400">
                                {customer.company}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className={`px-2 py-1 rounded-lg border text-xs font-semibold ${getScoreColor(calculateLeadScore(customer))}`}>
                              {calculateLeadScore(customer)}
                            </div>
                            
                            <select
                              value={customer.status}
                              onChange={(e) => {
                                e.stopPropagation()
                                handleStatusChange(customer.id, e.target.value)
                              }}
                              className={`status-badge border text-xs ${getStatusColor(customer.status)}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value="lead">Lead</option>
                              <option value="prospect">Prospect</option>
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                            
                            <div className="flex items-center space-x-2">

                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setScoringCustomerId(customer.id)
                                setShowScoring(true)
                              }}
                              className="p-1 rounded bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors text-xs"
                              title="Update lead scoring"
                            >
                              🎯
                            </button>

                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEdit(customer)
                              }}
                              className="p-1 rounded bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors text-xs"
                              title="Edit customer"
                            >
                              ✏️
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(customer.id)
                              }}
                              className="p-1 rounded bg-red-100 text-red-600 hover:bg-red-200 transition-colors text-xs"
                              title="Delete customer"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        
                        <div className="mb-3 space-y-2">

                          <div className="flex items-center space-x-2 text-surface-600 dark:text-surface-400">
                            <ApperIcon name="Mail" className="w-4 h-4" />
                            <span className="truncate">{customer.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-surface-600 dark:text-surface-400">
                            <ApperIcon name="Calendar" className="w-4 h-4" />
                            <span>Last: {format(customer.lastContact, 'MMM dd')}</span>
                          </div>
                        </div>
                        
                        <div className="mb-3 p-2 bg-surface-50 dark:bg-surface-700 rounded-lg">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-surface-600 dark:text-surface-400">Lead Temperature:</span>
                            <span className={`font-semibold ${getScoreColor(calculateLeadScore(customer))}`}>
                              {getLeadTemperature(calculateLeadScore(customer)).toUpperCase()}
                            </span>
                          </div>
                          <div className="w-full bg-surface-200 dark:bg-surface-600 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-500 ${
                                calculateLeadScore(customer) >= 80 ? 'bg-red-500' :
                                calculateLeadScore(customer) >= 60 ? 'bg-orange-500' :
                                calculateLeadScore(customer) >= 40 ? 'bg-yellow-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${calculateLeadScore(customer)}%` }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {filteredCustomers.length === 0 && (
                    <div className="text-center py-12">
                      <ApperIcon name="Users" className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
                      <p className="text-surface-500 dark:text-surface-400">
                        {searchTerm || filterStatus !== 'all' 
                          ? 'No customers match your search criteria' 
                          : 'No customers yet. Add your first customer to get started.'}
                      </p>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Customer Detail Panel */}
            <div className="xl:col-span-1">
              <AnimatePresence mode="wait">
                {selectedCustomer ? (
                  <motion.div
                    key={selectedCustomer.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="card-container"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                        Customer Details
                      </h3>
                      <button
                        onClick={() => setSelectedCustomer(null)}
                        className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors duration-200"
                      >
                        <ApperIcon name="X" className="w-4 h-4 text-surface-500" />
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Customer Info */}
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-card">
                          <span className="text-white font-bold text-xl">
                            {selectedCustomer.name.charAt(0)}
                          </span>
                        </div>
                        <h4 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
                          {selectedCustomer.name}
                        </h4>
                        <p className="text-surface-600 dark:text-surface-400">
                          {selectedCustomer.company}
                        </p>
                        <div className={`status-badge ${getStatusColor(selectedCustomer.status)} mt-3 border`}>
                          {selectedCustomer.status}
                        </div>
                      </div>
                      
                      {/* Contact Information */}
                      <div className="space-y-3">
                        <h5 className="font-semibold text-surface-900 dark:text-surface-100">Contact Info</h5>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3 text-sm">
                            <ApperIcon name="Mail" className="w-4 h-4 text-surface-500" />
                            <span className="text-surface-700 dark:text-surface-300">{selectedCustomer.email}</span>
                          </div>
                          {selectedCustomer.phone && (
                            <div className="flex items-center space-x-3 text-sm">
                              <ApperIcon name="Phone" className="w-4 h-4 text-surface-500" />
                              <span className="text-surface-700 dark:text-surface-300">{selectedCustomer.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-3 text-sm">
                            <ApperIcon name="Calendar" className="w-4 h-4 text-surface-500" />
                            <span className="text-surface-700 dark:text-surface-300">
                              Last contact: {format(selectedCustomer.lastContact, 'MMM dd, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Deals */}
                      {selectedCustomer.deals.length > 0 && (
                        <div className="space-y-3">
                          <h5 className="font-semibold text-surface-900 dark:text-surface-100">Active Deals</h5>
                          <div className="space-y-2">
                            {selectedCustomer.deals.map((deal) => (
                              <div key={deal.id} className="p-3 bg-surface-50 dark:bg-surface-700 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                  <h6 className="font-medium text-surface-900 dark:text-surface-100">{deal.title}</h6>
                                  <span className="text-sm font-semibold text-primary">
                                    ${deal.value.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm text-surface-600 dark:text-surface-400">
                                  <span className="capitalize">{deal.stage}</span>
                                  <span>{deal.probability}% chance</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Tasks */}
                      {selectedCustomer.tasks.length > 0 && (
                        <div className="space-y-3">
                          <h5 className="font-semibold text-surface-900 dark:text-surface-100">Upcoming Tasks</h5>
                          <div className="space-y-2">
                            {selectedCustomer.tasks.map((task) => (
                              <div key={task.id} className="p-3 bg-surface-50 dark:bg-surface-700 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                  <h6 className="font-medium text-surface-900 dark:text-surface-100">{task.title}</h6>
                                  <span className={`status-badge ${getPriorityColor(task.priority)} border text-xs`}>
                                    {task.priority}
                                  </span>
                                </div>
                                <div className="text-sm text-surface-600 dark:text-surface-400">
                                  Due: {format(task.dueDate, 'MMM dd, yyyy')}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Notes */}
                      {selectedCustomer.notes && (
                        <div className="space-y-3">
                          <h5 className="font-semibold text-surface-900 dark:text-surface-100">Notes</h5>
                          <p className="text-sm text-surface-700 dark:text-surface-300 bg-surface-50 dark:bg-surface-700 p-3 rounded-lg">
                            {selectedCustomer.notes}
                          </p>
                        </div>
                      )}

                      {/* Attachments */}

                      {selectedCustomer.attachments && selectedCustomer.attachments.length > 0 && (
                        <div className="space-y-3">
                          <h5 className="font-semibold text-surface-900 dark:text-surface-100">Attachments</h5>
                          <div className="space-y-2">
                            {selectedCustomer.attachments.map((attachment) => (
                              <div key={attachment.id} className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-700 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <span className="text-lg">{getFileIcon(attachment.type)}</span>
                                  <div>
                                    <h6 className="font-medium text-surface-900 dark:text-surface-100 text-sm">
                                      {attachment.name}
                                    </h6>
                                    <p className="text-xs text-surface-600 dark:text-surface-400">
                                      {formatFileSize(attachment.size)} • {format(attachment.uploadedAt, 'MMM dd, yyyy')}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleDownloadAttachment(attachment)}
                                    className="p-1 rounded hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                                    title="Download"
                                  >
                                    <ApperIcon name="Download" className="w-4 h-4 text-surface-500" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAttachment(selectedCustomer.id, attachment.id)}
                                    className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                                    title="Delete"
                                  >
                                    <ApperIcon name="Trash2" className="w-4 h-4 text-red-500" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* File Upload Area */}
                      <div className="space-y-3">
                        <h5 className="font-semibold text-surface-900 dark:text-surface-100">Add Attachments</h5>
                        <div 
                          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                            dragOver 
                              ? 'border-primary bg-primary bg-opacity-5' 
                              : 'border-surface-300 dark:border-surface-600 hover:border-primary'
                          }`}
                          onDragOver={(e) => {
                            e.preventDefault()
                            setDragOver(true)
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault()
                            setDragOver(false)
                          }}
                          onDrop={(e) => {
                            e.preventDefault()
                            setDragOver(false)
                            const files = e.dataTransfer.files
                            if (files.length > 0) {
                              handleFileUpload(selectedCustomer.id, files)
                            }
                          }}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <ApperIcon name="Upload" className="w-8 h-8 text-surface-400" />
                            <div className="text-sm text-surface-600 dark:text-surface-400">
                              <span className="font-medium text-primary cursor-pointer hover:underline"
                                onClick={() => {
                                  const input = document.createElement('input')
                                  input.type = 'file'
                                  input.multiple = true
                                  input.accept = '.pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.txt,.csv'
                                  input.onchange = (e) => {
                                    if (e.target.files.length > 0) {
                                      handleFileUpload(selectedCustomer.id, e.target.files)
                                    }
                                  }
                                  input.click()
                                }}
                              >
                                Click to upload
                              </span>
                              <span> or drag and drop</span>
                            </div>
                            <p className="text-xs text-surface-500 dark:text-surface-400">
                              PDF, DOC, Images, TXT (max 10MB each)
                            </p>
                            {uploadingFile && (
                              <div className="flex items-center space-x-2 text-primary">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                <span className="text-sm">Uploading...</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                      </div>


                  </motion.div>



                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="card-container text-center py-12"
                  >
                    <ApperIcon name="MousePointer" className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
                      Select a Customer
                    </h3>
                    <p className="text-surface-600 dark:text-surface-400">
                      Click on a customer from the list to view their details and manage interactions.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {view === 'pipeline' && (
          <div className="card-container">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-6">
              Sales Pipeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {['lead', 'prospect', 'proposal', 'negotiation'].map((stage) => (
                <div key={stage} className="kanban-column">
                  <h4 className="font-semibold text-surface-900 dark:text-surface-100 mb-4 capitalize">
                    {stage}s
                  </h4>
                  <div className="space-y-3">
                    {customers
                      .filter(customer => customer.status === stage || 
                        customer.deals.some(deal => deal.stage === stage))
                      .map((customer) => (
                        <div key={customer.id} className="kanban-card">
                          <h5 className="font-medium text-surface-900 dark:text-surface-100 mb-2">
                            {customer.name}
                          </h5>
                          <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">
                            {customer.company}
                          </p>
                          {customer.deals.length > 0 && (
                            <div className="text-sm text-primary font-semibold">
                              ${customer.deals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card-container">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Users" className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-surface-900 dark:text-surface-100">Total Customers</h3>
                  <p className="text-2xl font-bold text-primary">{customers.length}</p>
                </div>
              </div>
            </div>
            
            <div className="card-container">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="TrendingUp" className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-surface-900 dark:text-surface-100">Active Deals</h3>
                  <p className="text-2xl font-bold text-secondary">
                    {customers.reduce((sum, customer) => sum + customer.deals.length, 0)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card-container">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="DollarSign" className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-surface-900 dark:text-surface-100">Pipeline Value</h3>
                  <p className="text-2xl font-bold text-accent">
                    ${customers.reduce((sum, customer) => 
                      sum + customer.deals.reduce((dealSum, deal) => dealSum + deal.value, 0), 0
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Add Customer Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-surface-800 rounded-2xl shadow-card max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
                    Add New Customer
                  </h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors duration-200"
                  >
                    <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter customer name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Company *
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter company name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="lead">Lead</option>
                      <option value="prospect">Prospect</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Company Size
                    </label>
                    <select
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="startup">Startup (1-10)</option>
                      <option value="small">Small (11-50)</option>
                      <option value="medium">Medium (51-200)</option>
                      <option value="large">Large (201-1000)</option>
                      <option value="enterprise">Enterprise (1000+)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Budget Range
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="unknown">Unknown</option>
                      <option value="low">Low ($1K-$10K)</option>
                      <option value="medium">Medium ($10K-$50K)</option>
                      <option value="high">High ($50K+)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Timeline
                    </label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="immediate">Immediate (This month)</option>
                      <option value="short">Short (1-3 months)</option>
                      <option value="medium">Medium (3-6 months)</option>
                      <option value="long">Long (6+ months)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Industry
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="technology">Technology</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="finance">Finance</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="retail">Retail</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Attachments
                    </label>
                    <div 
                      className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                        dragOver 
                          ? 'border-primary bg-primary bg-opacity-5' 
                          : 'border-surface-300 dark:border-surface-600 hover:border-primary'
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault()
                        setDragOver(true)
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault()
                        setDragOver(false)
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        setDragOver(false)
                        // For new customers, we'll store files temporarily
                        const files = e.dataTransfer.files
                        if (files.length > 0) {
                          toast.info('Files will be attached after customer is created')
                        }
                      }}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <ApperIcon name="Upload" className="w-6 h-6 text-surface-400" />
                        <div className="text-sm text-surface-600 dark:text-surface-400">
                          <span className="font-medium text-primary cursor-pointer hover:underline"
                            onClick={() => {
                              toast.info('Files can be added after customer is created')
                            }}
                          >
                            Click to upload
                          </span>
                          <span> or drag and drop</span>
                        </div>
                        <p className="text-xs text-surface-500 dark:text-surface-400">
                          Files can be added after creation
                        </p>
                      </div>
                    </div>
                  </div>


                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary flex-1"
                    >
                      Add Customer
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Customer Modal */}
      <AnimatePresence>
        {showEditForm && editingCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEditForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-surface-800 rounded-2xl shadow-card max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
                    Edit Customer
                  </h3>
                  <button
                    onClick={() => setShowEditForm(false)}
                    className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors duration-200"
                  >
                    <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                  </button>
                </div>
                
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter customer name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Company *
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter company name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="lead">Lead</option>
                      <option value="prospect">Prospect</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Company Size
                    </label>
                    <select
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="startup">Startup (1-10)</option>
                      <option value="small">Small (11-50)</option>
                      <option value="medium">Medium (51-200)</option>
                      <option value="large">Large (201-1000)</option>
                      <option value="enterprise">Enterprise (1000+)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Budget Range
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="unknown">Unknown</option>
                      <option value="low">Low ($1K-$10K)</option>
                      <option value="medium">Medium ($10K-$50K)</option>
                      <option value="high">High ($50K+)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Timeline
                    </label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="immediate">Immediate (This month)</option>
                      <option value="short">Short (1-3 months)</option>
                      <option value="medium">Medium (3-6 months)</option>
                      <option value="long">Long (6+ months)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Industry
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="technology">Technology</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="finance">Finance</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="retail">Retail</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="input-field min-h-[80px] resize-vertical"
                      placeholder="Add notes about this customer..."
                      rows={3}
                    />
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Attachments
                    </label>
                    
                    {editingCustomer && editingCustomer.attachments && editingCustomer.attachments.length > 0 && (
                      <div className="mb-4 space-y-2">
                        <div className="text-sm text-surface-600 dark:text-surface-400 mb-2">Current attachments:</div>
                        {editingCustomer.attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center justify-between p-2 bg-surface-50 dark:bg-surface-700 rounded">
                            <div className="flex items-center space-x-2">
                              <span>{getFileIcon(attachment.type)}</span>
                              <span className="text-sm">{attachment.name}</span>
                              <span className="text-xs text-surface-500">({formatFileSize(attachment.size)})</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteAttachment(editingCustomer.id, attachment.id)}
                              className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                              title="Delete attachment"
                            >
                              <ApperIcon name="Trash2" className="w-3 h-3 text-red-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div 
                      className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                        dragOver 
                          ? 'border-primary bg-primary bg-opacity-5' 
                          : 'border-surface-300 dark:border-surface-600 hover:border-primary'
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault()
                        setDragOver(true)
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault()
                        setDragOver(false)
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        setDragOver(false)
                        const files = e.dataTransfer.files
                        if (files.length > 0 && editingCustomer) {
                          handleFileUpload(editingCustomer.id, files)
                        }
                      }}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <ApperIcon name="Upload" className="w-6 h-6 text-surface-400" />
                        <div className="text-sm text-surface-600 dark:text-surface-400">
                          <span className="font-medium text-primary cursor-pointer hover:underline"
                            onClick={() => {
                              if (!editingCustomer) return
                              const input = document.createElement('input')
                              input.type = 'file'
                              input.multiple = true
                              input.accept = '.pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.txt,.csv'
                              input.onchange = (e) => {
                                if (e.target.files.length > 0) {
                                  handleFileUpload(editingCustomer.id, e.target.files)
                                }
                              }
                              input.click()
                            }}
                          >
                            Click to upload
                          </span>
                          <span> or drag and drop</span>
                        </div>
                        <p className="text-xs text-surface-500 dark:text-surface-400">
                          PDF, DOC, Images, TXT (max 10MB each)
                        </p>
                        {uploadingFile && (
                          <div className="flex items-center space-x-2 text-primary">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            <span className="text-sm">Uploading...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditForm(false)}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary flex-1"
                    >
                      Update Customer
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-surface-800 rounded-2xl shadow-card max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
                    Delete Customer
                  </h3>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors duration-200"
                  >
                    <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                  </button>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                      <ApperIcon name="AlertTriangle" className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-surface-900 dark:text-surface-100">
                        Are you sure?
                      </h4>
                      <p className="text-sm text-surface-600 dark:text-surface-400">
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                  
                  {(() => {
                    const customerToDelete = customers.find(c => c.id === deletingCustomerId)
                    return customerToDelete ? (
                      <div className="bg-surface-50 dark:bg-surface-700 rounded-lg p-4">
                        <p className="text-sm text-surface-700 dark:text-surface-300 mb-2">
                          You are about to permanently delete:
                        </p>
                        <div className="font-medium text-surface-900 dark:text-surface-100">
                          <div>{customerToDelete.name}</div>
                          <div className="text-sm text-surface-600 dark:text-surface-400">
                            {customerToDelete.company}
                          </div>
                        </div>
                        {customerToDelete.deals?.length > 0 && (
                          <div className="mt-2 text-sm text-orange-600 dark:text-orange-400">
                            ⚠️ This customer has {customerToDelete.deals.length} active deal(s)
                          </div>
                        )}
                      </div>
                    ) : null
                  })()} 
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 shadow-card"
                  >
                    Delete Customer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lead Scoring Modal */}
      <AnimatePresence>
        {showScoring && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowScoring(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-surface-800 rounded-2xl shadow-card max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
                    🎯 Update Lead Scoring
                  </h3>
                  <button
                    onClick={() => setShowScoring(false)}
                    className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors duration-200"
                  >
                    <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                  </button>
                </div>
                
                {scoringCustomerId && (() => {
                  const customer = customers.find(c => c.id === scoringCustomerId)
                  if (!customer) return null
                  
                  const currentScore = calculateLeadScore(customer)
                  const temperature = getLeadTemperature(currentScore)
                  
                  return (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.target)
                        const scoreData = {
                          companySize: formData.get('companySize'),
                          budget: formData.get('budget'),
                          timeline: formData.get('timeline'),
                          industry: formData.get('industry')
                        }
                        handleScoreUpdate(scoringCustomerId, scoreData)
                      }} 
                      className="space-y-4"
                    >
                      <div className="text-center mb-6">
                        <h4 className="font-semibold text-surface-900 dark:text-surface-100 mb-2">
                          {customer.name}
                        </h4>
                        <div className="flex items-center justify-center space-x-4">
                          <div className={`px-3 py-1 rounded-lg border ${getScoreColor(currentScore)}`}>
                            Score: {currentScore}/100
                          </div>
                          <div className="text-lg">
                            {getTemperatureIcon(currentScore)} {temperature.toUpperCase()}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Company Size
                        </label>
                        <select
                          name="companySize"
                          defaultValue={customer.companySize || 'small'}
                          className="input-field"
                        >
                          <option value="startup">Startup (1-10) - 10pts</option>
                          <option value="small">Small (11-50) - 15pts</option>
                          <option value="medium">Medium (51-200) - 20pts</option>
                          <option value="large">Large (201-1000) - 25pts</option>
                          <option value="enterprise">Enterprise (1000+) - 25pts</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Budget Range
                        </label>
                        <select
                          name="budget"
                          defaultValue={customer.budget || 'unknown'}
                          className="input-field"
                        >
                          <option value="unknown">Unknown - 10pts</option>
                          <option value="low">Low ($1K-$10K) - 5pts</option>
                          <option value="medium">Medium ($10K-$50K) - 15pts</option>
                          <option value="high">High ($50K+) - 25pts</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Timeline
                        </label>
                        <select
                          name="timeline"
                          defaultValue={customer.timeline || 'long'}
                          className="input-field"
                        >
                          <option value="immediate">Immediate - 20pts</option>
                          <option value="short">Short (1-3 months) - 15pts</option>
                          <option value="medium">Medium (3-6 months) - 10pts</option>
                          <option value="long">Long (6+ months) - 5pts</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Industry Fit
                        </label>
                        <select
                          name="industry"
                          defaultValue={customer.industry || 'technology'}
                          className="input-field"
                        >
                          <option value="technology">Technology - 15pts</option>
                          <option value="healthcare">Healthcare - 12pts</option>
                          <option value="finance">Finance - 10pts</option>
                          <option value="manufacturing">Manufacturing - 8pts</option>
                          <option value="retail">Retail - 6pts</option>
                          <option value="other">Other - 3pts</option>
                        </select>
                      </div>
                      
                      <div className="bg-surface-50 dark:bg-surface-700 p-3 rounded-lg">
                        <h5 className="font-medium text-surface-900 dark:text-surface-100 mb-2">Automatic Scoring Factors:</h5>
                        <div className="text-sm text-surface-600 dark:text-surface-400 space-y-1">
                          <div>• Recent engagement: +15pts (last 24h), +10pts (last week), +5pts (last month)</div>
                          <div>• Deal value: +10pts ($50K+), +7pts ($20K+), +4pts ($5K+)</div>
                          <div>• Workflow actions will be triggered automatically based on final score</div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowScoring(false)}
                          className="btn-secondary flex-1"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn-primary flex-1"
                        >
                          Update Score
                        </button>
                      </div>
                    </form>
                  )
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature