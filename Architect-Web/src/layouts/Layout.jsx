import { Outlet } from "react-router-dom"
import Footer from "../components/Footer/Footer"
import ToastStack from '../components/common/ToastStack'

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
      <ToastStack />
    </div>
  )
}

export default Layout
