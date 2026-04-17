import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { MapPage } from './pages/MapPage'
import { ReportNew } from './pages/ReportNew'
import { About } from './pages/About'
import { Profile } from './pages/Profile'
import { ReportDetail } from './pages/ReportDetail'
import { NotFound } from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/report/new" element={<ReportNew />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/report/:id" element={<ReportDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App