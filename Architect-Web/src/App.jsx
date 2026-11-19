import { useEffect } from 'react'
import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './layouts/Layout'
import ScrollToTop from './components/common/Button/ScrollToTop'
import WhatsAppButton from './components/common/Button/WhatsAppButton'
import { initMetaPixel, trackPageView } from './lib/metaPixel'
import { apiRequest } from './lib/apiClient'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import FAQ from './pages/Faq'
import Pricing from './pages/Pricing'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import Gallery from './pages/Gallery'
import GalleryDetail from './pages/GalleryDetail'
import Projects from './pages/Projects/Projects'
import ProjectDetail from './pages/Projects/ProjectDetail'
import Services from './pages/Services/Services'
import ServiceDetail from './pages/Services/ServiceDetail'
import Team from './pages/Team/Team'
import TeamDetail from './pages/Team/TeamDetail'
import Blogs from './pages/Blogs/Blogs'
import BlogDetail from './pages/Blogs/BlogDetail'
import MainAreas from './pages/MainAreas/MainAreas'
import FlashNews from './pages/FlashNews'
import ErrorPage from './pages/ErrorPage'

function App() {
  const location = useLocation()

  // Initialize Meta Pixel from env or backend settings
  useEffect(() => {
    const envPixelId = import.meta.env.VITE_META_PIXEL_ID
    if (envPixelId) {
      initMetaPixel(envPixelId)
    }

    apiRequest('/meta-pixel')
      .then((res) => {
        if (res?.data?.metaPixelId && res?.data?.metaPixelEnabled !== false) {
          initMetaPixel(res.data.metaPixelId)
        }
      })
      .catch(() => {})
  }, [])

  // Automatically track PageView whenever route / page changes
  useEffect(() => {
    trackPageView(location.pathname)
  }, [location.pathname])

  return (
    <>
      <ScrollToTop />
      <WhatsAppButton />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="gallery/:id" element={<GalleryDetail />} />

          <Route path="services" element={<Services />} />
          <Route path="services/:serviceId" element={<ServiceDetail />} />

          <Route path="projects" element={<Projects />} />
          <Route path="projects/:projectId" element={<ProjectDetail />} />

          <Route path="blogs" element={<Blogs />} />
          <Route path="blogs/:id" element={<BlogDetail />} />

          <Route path="main-areas" element={<MainAreas />} />
          <Route path="areas" element={<MainAreas />} />

          <Route path="flash-news" element={<FlashNews />} />

          <Route path="team" element={<Team />} />
          <Route path="team/:id" element={<TeamDetail />} />

          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
