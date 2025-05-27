import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'

import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'

const Pipeline = () => {
  const navigate = useNavigate()
  const [deals, setDeals] = useState([])
  const [stages] = useState([
    { id: 'lead', name: 'Lead', color: 'blue' },
    { id: 'qualified', name: 'Qualified', color: 'yellow' },
    { id: 'proposal', name: 'Proposal', color: 'orange' },
    { id: 'negotiation', name: 'Negotiation', color: 'purple' },
    { id: 'closed-won', name: 'Closed Won', color: 'green' },
    { id: 'closed-lost', name: 'Closed Lost', color: 'red' }
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStage, setFilterStage] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [newDeal, setNewDeal] = useState({
    title: '',
    company: '',
    value: '',
    stage: 'lead',
    contact: '',
    email: '',
    phone: '',
    attachments: [],
    notes: ''

  })

  const [dragOver, setDragOver] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)


  useEffect(() => {

  // Sample data initialization
    const sampleDeals = [
      {
        id: 1,
        title: 'Enterprise Software License',
        company: 'TechCorp Inc.',
        value: 75000,
        stage: 'proposal',
        contact: 'John Smith',
        email: 'john.smith@techcorp.com',
        phone: '+1 (555) 123-4567',
        notes: 'Large enterprise deal, decision by end of quarter',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
        attachments: [
          {
            id: 'att1',
            name: 'proposal-v2.pdf',
            type: 'application/pdf',
            size: 2100000,
            uploadedAt: new Date('2024-01-20'),
            url: '#'
          },
          {
            id: 'att2',
            name: 'requirements.docx',
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            size: 456000,
            uploadedAt: new Date('2024-01-18'),
            url: '#'
          }
        ]
      },
      {
        id: 2,
        title: 'Cloud Migration Project',
        company: 'StartupXYZ',
        value: 45000,
        stage: 'negotiation',
        contact: 'Sarah Johnson',
        email: 'sarah@startupxyz.com',
        phone: '+1 (555) 987-6543',
        notes: 'Needs custom pricing, budget constraints',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-22'),
        attachments: [
          {
            id: 'att3',
            name: 'architecture-diagram.png',
            type: 'image/png',
            size: 890000,
            uploadedAt: new Date('2024-01-22'),
            url: '#'
          }
        ]
      },
      {
        id: 3,
        title: 'Security Audit Services',
        company: 'FinanceFirst Bank',
        value: 32000,
        stage: 'qualified',
        contact: 'Michael Chen',
        email: 'mchen@financefirst.com',
        phone: '+1 (555) 456-7890',
        notes: 'Compliance requirements, Q2 timeline',
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-21'),
        attachments: []
      },
      {
        id: 4,
        title: 'Marketing Automation Setup',
        company: 'RetailMax',
        value: 18500,
        stage: 'lead',
        contact: 'Emily Davis',
        email: 'emily.davis@retailmax.com',
        phone: '+1 (555) 321-0987',
        notes: 'Initial contact, sent proposal',
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-25'),
        attachments: []
      }
    ]
    setDeals(sampleDeals)
  }, [])



  // Filter deals based on search and stage
  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.contact.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStage = filterStage === 'all' || deal.stage === filterStage
    return matchesSearch && matchesStage
  })

  // Get deals by stage
  const getDealsByStage = (stageId) => {
    return filteredDeals.filter(deal => deal.stage === stageId)
  }

  // Handle drag and drop
  const handleDragStart = (e, dealId) => {
    e.dataTransfer.setData('text/plain', dealId)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, newStage) => {
    e.preventDefault()
    const dealId = parseInt(e.dataTransfer.getData('text/plain'))
    updateDealStage(dealId, newStage)
  }

  // Update deal stage
  const updateDealStage = (dealId, newStage) => {
    setDeals(prev => prev.map(deal => {
      if (deal.id === dealId) {
        const updatedDeal = { ...deal, stage: newStage, updatedAt: new Date() }
        toast.success(`Deal moved to ${stages.find(s => s.id === newStage)?.name}`)
        return updatedDeal
      }
      return deal
    }))
  }

  // Add new deal
  const handleAddDeal = (e) => {
    e.preventDefault()
    if (!newDeal.title.trim() || !newDeal.company.trim()) {
      toast.error('Please fill in required fields')
      return
    }

    const deal = {
      id: deals.length + 1,
      ...newDeal,
      value: parseFloat(newDeal.value) || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      attachments: []
    }

    setDeals(prev => [...prev, deal])


    setNewDeal({
      title: '',
      company: '',
      value: '',
      stage: 'lead',
      contact: '',
      email: '',
      phone: '',
      notes: '',
      attachments: []
    })

    setShowAddModal(false)
    toast.success('Deal added successfully')
  }

  // Edit deal
  const handleEditDeal = (deal) => {
    setSelectedDeal(deal)
    setNewDeal({ ...deal, value: deal.value.toString() })
    setShowEditModal(true)
  }

  const handleUpdateDeal = (e) => {
    e.preventDefault()
    if (!newDeal.title.trim() || !newDeal.company.trim()) {
      toast.error('Please fill in required fields')
      return
    }

    setDeals(prev => prev.map(deal => {
      if (deal.id === selectedDeal.id) {
        return {
          ...deal,
          ...newDeal,
          value: parseFloat(newDeal.value) || 0,
          updatedAt: new Date()
        }
      }
      return deal
    }))

    setShowEditModal(false)
    setSelectedDeal(null)
    setNewDeal({
      title: '',
      company: '',
      value: '',
      stage: 'lead',
      contact: '',
      email: '',
      phone: '',
      attachments: [],
      notes: ''

    })
    toast.success('Deal updated successfully')
  }

  // Delete deal
  const handleDeleteDeal = (dealId) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      setDeals(prev => prev.filter(deal => deal.id !== dealId))
      toast.success('Deal deleted successfully')
    }
  }

  // File upload handlers for deals
  const handleFileUpload = async (dealId, files) => {
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
          'text/csv',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
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
      
      setDeals(prev => prev.map(deal => 
        deal.id === dealId 
          ? { 
              ...deal, 
              attachments: [...(deal.attachments || []), ...newAttachments],
              updatedAt: new Date()
            }
          : deal
      ))
      
      toast.success(`${newAttachments.length} file(s) uploaded successfully`)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload files')
    } finally {
      setUploadingFile(false)
    }
  }
  
  const handleDeleteAttachment = (dealId, attachmentId) => {
    if (!window.confirm('Are you sure you want to delete this attachment?')) return
    
    setDeals(prev => prev.map(deal => 
      deal.id === dealId 
        ? { 
            ...deal, 
            attachments: (deal.attachments || []).filter(att => att.id !== attachmentId),
            updatedAt: new Date()
          }
        : deal
    ))
    
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
    if (fileType.includes('sheet') || fileType.includes('excel')) return '📊'
    if (fileType.includes('text')) return '📃'
    return '📎'
  }
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Calculate stage totals
  const getStageTotal = (stageId) => {
    return getDealsByStage(stageId).reduce((total, deal) => total + deal.value, 0)
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

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
                className="p-2 rounded-lg bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all duration-200"
              >
                <ApperIcon name="ArrowLeft" className="w-5 h-5 text-surface-600 dark:text-surface-400" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                  Sales Pipeline
                </h1>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  Manage your deals and track progress
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span>Add Deal</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Filters and Search */}
      <motion.div 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 shadow-soft"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <ApperIcon name="Search" className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search deals, companies, or contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="input-field w-full sm:w-48"
            >
              <option value="all">All Stages</option>
              {stages.map(stage => (
                <option key={stage.id} value={stage.id}>{stage.name}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Pipeline Board */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 min-h-96">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="kanban-column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full bg-${stage.color}-500`}></div>
                  <h3 className="font-semibold text-surface-900 dark:text-surface-100">
                    {stage.name}
                  </h3>
                  <span className="bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400 text-xs px-2 py-1 rounded-full">
                    {getDealsByStage(stage.id).length}
                  </span>
                </div>
              </div>

              {/* Stage Total */}
              <div className="mb-4 text-sm font-medium text-surface-600 dark:text-surface-400">
                Total: {formatCurrency(getStageTotal(stage.id))}
              </div>

              {/* Deals */}
              <div className="space-y-3">
                {getDealsByStage(stage.id).map(deal => (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal.id)}
                    className="card-container cursor-move hover:shadow-soft transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-surface-900 dark:text-surface-100 text-sm">
                        {deal.title}
                      </h4>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditDeal(deal)}
                          className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                        >
                          <ApperIcon name="Edit" className="w-3 h-3 text-surface-500" />
                        </button>
                        <button
                          onClick={() => handleDeleteDeal(deal.id)}
                          className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                        >
                          <ApperIcon name="Trash2" className="w-3 h-3 text-surface-500" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-xs text-surface-600 dark:text-surface-400 mb-2">
                      {deal.company}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        {formatCurrency(deal.value)}
                      </span>
                      <div className="flex items-center space-x-1 text-xs text-surface-500">
                        <ApperIcon name="User" className="w-3 h-3" />
                        <span>{deal.contact}</span>
                      </div>
                    </div>
                    
                    {deal.notes && (
                      <p className="text-xs text-surface-500 dark:text-surface-400 mt-2 truncate">
                        {deal.notes}
                      </p>
                    )}
                    
                    {deal.attachments && deal.attachments.length > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-1 text-xs text-surface-500 mb-1">
                          <ApperIcon name="Paperclip" className="w-3 h-3" />
                          <span>{deal.attachments.length} file(s)</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {deal.attachments.slice(0, 2).map(attachment => (
                            <span key={attachment.id} className="text-xs bg-surface-100 dark:bg-surface-600 px-1 py-0.5 rounded">
                              {getFileIcon(attachment.type)} {attachment.name.length > 15 ? attachment.name.substring(0, 15) + '...' : attachment.name}
                            </span>
                          ))}
                          {deal.attachments.length > 2 && (
                            <span className="text-xs text-surface-500">+{deal.attachments.length - 2} more</span>
                          )}
                        </div>
                      </div>
                    )}

                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Add Deal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-surface-800 rounded-2xl shadow-card max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                  Add New Deal
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                </button>
              </div>

              <form onSubmit={handleAddDeal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Deal Title *
                  </label>
                  <input
                    type="text"
                    value={newDeal.title}
                    onChange={(e) => setNewDeal(prev => ({ ...prev, title: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={newDeal.company}
                    onChange={(e) => setNewDeal(prev => ({ ...prev, company: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Value ($)
                    </label>
                    <input
                      type="number"
                      value={newDeal.value}
                      onChange={(e) => setNewDeal(prev => ({ ...prev, value: e.target.value }))}
                      className="input-field"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Stage
                    </label>
                    <select
                      value={newDeal.stage}
                      onChange={(e) => setNewDeal(prev => ({ ...prev, stage: e.target.value }))}
                      className="input-field"
                    >
                      {stages.map(stage => (
                        <option key={stage.id} value={stage.id}>{stage.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={newDeal.contact}
                    onChange={(e) => setNewDeal(prev => ({ ...prev, contact: e.target.value }))}
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newDeal.email}
                      onChange={(e) => setNewDeal(prev => ({ ...prev, email: e.target.value }))}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={newDeal.phone}
                      onChange={(e) => setNewDeal(prev => ({ ...prev, phone: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={newDeal.notes}
                    onChange={(e) => setNewDeal(prev => ({ ...prev, notes: e.target.value }))}
                    className="input-field h-20 resize-none"
                    placeholder="Additional notes..."
                  />
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
                      const files = e.dataTransfer.files
                      if (files.length > 0) {
                        toast.info('Files will be attached after deal is created')
                      }
                    }}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <ApperIcon name="Upload" className="w-6 h-6 text-surface-400" />
                      <div className="text-sm text-surface-600 dark:text-surface-400">
                        <span className="font-medium text-primary cursor-pointer hover:underline"
                          onClick={() => {
                            toast.info('Files can be added after deal is created')
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

                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Add Deal
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Deal Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-surface-800 rounded-2xl shadow-card max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                  Edit Deal
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                </button>
              </div>

              <form onSubmit={handleUpdateDeal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Deal Title *
                  </label>
                  <input
                    type="text"
                    value={newDeal.title}
                    onChange={(e) => setNewDeal(prev => ({ ...prev, title: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={newDeal.company}
                    onChange={(e) => setNewDeal(prev => ({ ...prev, company: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Value ($)
                    </label>
                    <input
                      type="number"
                      value={newDeal.value}
                      onChange={(e) => setNewDeal(prev => ({ ...prev, value: e.target.value }))}
                      className="input-field"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Stage
                    </label>
                    <select
                      value={newDeal.stage}
                      onChange={(e) => setNewDeal(prev => ({ ...prev, stage: e.target.value }))}
                      className="input-field"
                    >
                      {stages.map(stage => (
                        <option key={stage.id} value={stage.id}>{stage.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={newDeal.contact}
                    onChange={(e) => setNewDeal(prev => ({ ...prev, contact: e.target.value }))}
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newDeal.email}
                      onChange={(e) => setNewDeal(prev => ({ ...prev, email: e.target.value }))}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={newDeal.phone}
                      onChange={(e) => setNewDeal(prev => ({ ...prev, phone: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={newDeal.notes}
                    onChange={(e) => setNewDeal(prev => ({ ...prev, notes: e.target.value }))}
                    className="input-field h-20 resize-none"
                    placeholder="Additional notes..."
                  />

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Attachments
                  </label>
                  
                  {selectedDeal && selectedDeal.attachments && selectedDeal.attachments.length > 0 && (
                    <div className="mb-4 space-y-2">
                      <div className="text-sm text-surface-600 dark:text-surface-400 mb-2">Current attachments:</div>
                      {selectedDeal.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{getFileIcon(attachment.type)}</span>
                            <div>
                              <div className="font-medium text-surface-900 dark:text-surface-100 text-sm">
                                {attachment.name}
                              </div>
                              <div className="text-xs text-surface-600 dark:text-surface-400">
                                {formatFileSize(attachment.size)} • {format(attachment.uploadedAt, 'MMM dd, yyyy')}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleDownloadAttachment(attachment)}
                              className="p-1 rounded hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                              title="Download"
                            >
                              <ApperIcon name="Download" className="w-4 h-4 text-surface-500" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAttachment(selectedDeal.id, attachment.id)}
                              className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                              title="Delete"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
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
                      if (files.length > 0 && selectedDeal) {
                        handleFileUpload(selectedDeal.id, files)
                      }
                    }}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <ApperIcon name="Upload" className="w-6 h-6 text-surface-400" />
                      <div className="text-sm text-surface-600 dark:text-surface-400">
                        <span className="font-medium text-primary cursor-pointer hover:underline"
                          onClick={() => {
                            if (!selectedDeal) return
                            const input = document.createElement('input')
                            input.type = 'file'
                            input.multiple = true
                            input.accept = '.pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.txt,.csv,.xls,.xlsx'
                            input.onchange = (e) => {
                              if (e.target.files.length > 0) {
                                handleFileUpload(selectedDeal.id, e.target.files)
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
                        PDF, DOC, Images, Excel, TXT (max 10MB each)
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
                    onClick={() => setShowEditModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Update Deal
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Pipeline