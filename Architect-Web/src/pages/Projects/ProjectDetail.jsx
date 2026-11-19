import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import { apiRequest, getImageUrl } from '../../lib/apiClient'
import NewsletterSection from '../../components/home-sections/NewsletterSection'
import { HiOutlineCheck, HiOutlinePhotograph, HiOutlineVideoCamera } from 'react-icons/hi'

export default function ProjectDetail() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('photos')

  useEffect(() => {
    setLoading(true)
    apiRequest(`/projects/slug/${projectId}`)
      .then(res => setProject(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [projectId])

  if (loading) return <div className="py-24 text-center text-xl">Loading project…</div>
  if (error || !project) {
    return (
      <>
        <PageHeader title="Project Not Found" breadcrumb={["HOME", "PROJECTS"]} />
        <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
          <p className="text-gray-600">We couldn't find the project you're looking for. Please check the URL or go back to the projects list.</p>
        </section>
      </>
    )
  }

  const mainImageSrc = getImageUrl(project.mainImage || project.image)
  const detailsList = Array.isArray(project.details) ? project.details : []
  const roomSizesList = Array.isArray(project.roomSizes) ? project.roomSizes : []
  const photosList = Array.isArray(project.photos) ? project.photos : []
  const videosList = Array.isArray(project.videos) ? project.videos : []
  const relatedList = Array.isArray(project.relatedProjects) ? project.relatedProjects : []

  return (
    <>
      <PageHeader title={project.title} breadcrumb={["HOME", "PROJECTS", project.title]} />

      <section className="mx-auto px-4 lg:px-8 py-12 lg:py-20 space-y-16">
        {/* Client Info Table */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Architect</p>
            <p className="text-sm font-semibold text-gray-900">{project.architect || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Project Type</p>
            <p className="text-sm font-semibold text-gray-900">{project.projectType || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Client</p>
            <p className="text-sm font-semibold text-gray-900">{project.client || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Terms</p>
            <p className="text-sm font-semibold text-gray-900">{project.terms || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Strategy</p>
            <p className="text-sm font-semibold text-gray-900">{project.strategy || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Date</p>
            <p className="text-sm font-semibold text-gray-900">{project.date || project.year || '—'}</p>
          </div>
        </div>

        {/* Main Image */}
        {mainImageSrc && (
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img src={mainImageSrc} alt={project.title} className="w-full h-96 md:h-120 object-cover" />
          </div>
        )}

        {/* Design In Details Section */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Design In Details</h2>
          {project.resultDescription && (
            <p className="text-gray-600 mb-8 leading-relaxed">{project.resultDescription}</p>
          )}

          {/* Details Grid - use check icons instead of dots */}
          {detailsList.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {detailsList.map((detail, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-(--brand-camel) flex items-center justify-center shrink-0 mt-1">
                    <HiOutlineCheck className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Room Sizes - single rectangle with dividers */}
          {roomSizesList.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
              <div className="flex divide-x divide-gray-200 overflow-x-auto">
                {roomSizesList.map((room, idx) => (
                  <div key={idx} className="flex-1 min-w-[120px] py-6 text-center">
                    <p className="text-2xl md:text-3xl font-bold text-black mb-2">{room.size}</p>
                    <p className="text-gray-600 text-sm">{room.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Incredible Result Section */}
        {(photosList.length > 0 || videosList.length > 0 || project.resultDescription) && (
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Incredible Result</h2>
            {project.resultDescription && (
              <p className="text-gray-600 mb-8 leading-relaxed">{project.resultDescription}</p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
              {photosList.length > 0 && (
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                    activeTab === 'photos'
                      ? 'bg-(--brand-camel) text-white shadow-md'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-500'
                  }`}
                >
                  <HiOutlinePhotograph className="inline-block mr-2" /> Photos ({photosList.length})
                </button>
              )}
              {videosList.length > 0 && (
                <button
                  onClick={() => setActiveTab('videos')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                    activeTab === 'videos'
                      ? 'bg-(--brand-camel) text-white shadow-md'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-500'
                  }`}
                >
                  <HiOutlineVideoCamera className="inline-block mr-2" /> Videos ({videosList.length})
                </button>
              )}
            </div>

            {/* Photos Tab */}
            {activeTab === 'photos' && photosList.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {photosList.map((photo, idx) => (
                  <div key={idx} className="rounded-2xl overflow-hidden h-64 md:h-72 shadow-md group">
                    <img
                      src={getImageUrl(photo)}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Videos Tab */}
            {activeTab === 'videos' && videosList.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videosList.map((video, idx) => (
                  <div key={idx} className="relative rounded-2xl overflow-hidden h-96 shadow-md bg-black">
                    <video controls className="w-full h-full object-contain" src={getImageUrl(video)} title={`Video ${idx + 1}`}></video>
                    <button
                      onClick={() => setActiveTab('photos')}
                      className="absolute top-4 right-4 bg-white/80 hover:bg-white text-black rounded-full p-2 transition-all cursor-pointer"
                      title="Close video"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Related Projects Carousel */}
        {relatedList.length > 0 && (
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedList.map((relatedProject) => (
                <div
                  key={relatedProject._id || relatedProject.id}
                  onClick={() => navigate(`/projects/${relatedProject.slug || relatedProject._id}`)}
                  className="cursor-pointer rounded-2xl overflow-hidden group shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="overflow-hidden rounded-2xl">
                    <img
                      src={getImageUrl(relatedProject.mainImage || relatedProject.image)}
                      alt={relatedProject.title}
                      className="w-full h-80 md:h-96 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="px-6 py-4 flex flex-col gap-1">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 group-hover:text-(--brand-camel) transition-colors">{relatedProject.title}</h3>
                    {relatedProject.location && <p className="text-gray-500 text-sm">{relatedProject.location}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />
    </>
  )
}
