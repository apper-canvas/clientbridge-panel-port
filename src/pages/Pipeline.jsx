import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
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
    notes: ''
  })

  // Sample data initialization
  useEffect(() => {
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
        updatedAt: new Date('2024-01-20')
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
        updatedAt: new Date('2024-01-22')
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
        updatedAt: new Date('2024-01-21')
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
        updatedAt: new Date('2024-01-25')
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
      updatedAt: new Date()
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
      notes: ''
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