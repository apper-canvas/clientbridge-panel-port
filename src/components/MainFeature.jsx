import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, addDays } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [view, setView] = useState('list') // 'list', 'pipeline', 'analytics'
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'lead',
    notes: ''
  })

  // Sample data initialization
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
      tasks: []
    }

    setCustomers(prev => [newCustomer, ...prev])
    setFormData({ name: '', email: '', phone: '', company: '', status: 'lead', notes: '' })
    setShowAddForm(false)
    toast.success('Customer added successfully!')
  }

  const handleStatusChange = (customerId, newStatus) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId ? { ...customer, status: newStatus, lastContact: new Date() } : customer
    ))
    toast.success('Customer status updated!')
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
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-card">
                              <span className="text-white font-semibold text-sm">
                                {customer.name.charAt(0)}
                              </span>
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
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center space-x-2 text-surface-600 dark:text-surface-400">
                            <ApperIcon name="Mail" className="w-4 h-4" />
                            <span className="truncate">{customer.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-surface-600 dark:text-surface-400">
                            <ApperIcon name="Calendar" className="w-4 h-4" />
                            <span>Last: {format(customer.lastContact, 'MMM dd')}</span>
                          </div>
                        </div>
                        
                        {customer.deals.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-surface-100 dark:border-surface-700">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-surface-600 dark:text-surface-400">
                                Active deals: {customer.deals.length}
                              </span>
                              <span className="font-semibold text-primary">
                                ${customer.deals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}
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
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="input-field resize-none"
                      rows="3"
                      placeholder="Add any additional notes..."
                    />
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
    </div>
  )
}

export default MainFeature