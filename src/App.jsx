import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import LeadScoring from './pages/LeadScoring'
import Tasks from './pages/Tasks'
import Analytics from './pages/Analytics'


import Pipeline from './pages/Pipeline'


import NotFound from './pages/NotFound'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-surface-100 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lead-scoring" element={<LeadScoring />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/tasks" element={<Tasks />} />

        <Route path="/analytics" element={<Analytics />} />



        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="!mt-16"
        toastClassName="!rounded-xl !shadow-card"
      />
    </div>
  )
}

export default App