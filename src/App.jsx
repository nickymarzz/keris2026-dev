import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import AdminGate from './components/AdminGate'

import Landing from './pages/Landing'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import Scholars from './pages/Scholars'
import Scholarships from './pages/Scholarships'
import Resume from './pages/Resume'
import Essay from './pages/Essay'
import AdminDashboard from './pages/admin/AdminDashboard'
import EditScholars from './pages/admin/EditScholars'
import EditScholarships from './pages/admin/EditScholarships'
import EditCommittee from './pages/admin/EditCommittee'
import EditNews from './pages/admin/EditNews'
import EditHistory from './pages/admin/EditHistory'
import ScholarshipDetail from './pages/ScholarshipDetail'
import ScholarDetail from './pages/ScholarDetail'
import NotFound from './pages/NotFound'

export default function App() {
  const init = useAuthStore((s) => s.init)
  useEffect(() => { init() }, [init])

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"              element={<Landing />} />
            <Route path="/news"          element={<News />} />
            <Route path="/news/:id"      element={<NewsDetail />} />
            <Route path="/scholars"          element={<Scholars />} />
            <Route path="/scholars/:id"      element={<ScholarDetail />} />
            <Route path="/scholarships"      element={<Scholarships />} />
            <Route path="/scholarships/:id"  element={<ScholarshipDetail />} />
            <Route path="/resume"        element={<Resume />} />
            <Route path="/essay"         element={<Essay />} />
            <Route path="/admin"               element={<AdminGate><AdminDashboard /></AdminGate>} />
            <Route path="/admin/scholars"      element={<AdminGate><EditScholars /></AdminGate>} />
            <Route path="/admin/scholarships"  element={<AdminGate><EditScholarships /></AdminGate>} />
            <Route path="/admin/committee"     element={<AdminGate><EditCommittee /></AdminGate>} />
            <Route path="/admin/news"          element={<AdminGate><EditNews /></AdminGate>} />
            <Route path="/admin/history"       element={<AdminGate><EditHistory /></AdminGate>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}