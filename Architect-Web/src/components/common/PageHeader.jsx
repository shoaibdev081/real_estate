import Navbar from "../Navbar/Navbar"
import PageHero from "./PageHero"

export default function PageHeader({ title, breadcrumb = [] }) {
  return (
    <section
      className="relative w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/images/history-bg.png)" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Navbar - force transparent on all inner pages */}
      <Navbar isHome={true} />

      {/* Hero Content */}
      <PageHero title={title} breadcrumb={breadcrumb} />
    </section>
  )
}
