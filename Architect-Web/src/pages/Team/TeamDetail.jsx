import React, { useState, useEffect } from 'react'
import { useUI } from '../../context/UIContext'
import { useParams, useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import PrimaryButton from '../../components/common/Button/PrimaryButton'
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'
import SecondaryButton from '../../components/common/Button/SecondaryButton'
// Static array removed. Data comes from backend.
import { apiRequest, getImageUrl } from '../../lib/apiClient'

function TeamDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
    subscribe: false
  })
  const { showToast } = useUI()
  const [error, setError] = useState(null)
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await apiRequest(`/team/${id}`)
        setMember(res.data)
      } catch (err) {
        setError('Team Member Not Found')
      } finally {
        setLoading(false)
      }
    }
    fetchMember()
  }, [id])

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await apiRequest('/contact', {
        method: 'POST',
        body: {
          fullName: formData.fullName || formData.name,
          phone: formData.phone,
          email: formData.email,
          subject: formData.subject || `Contact Team Member: ${member?.name || ''}`,
          message: formData.message
        }
      })
      setFormData({ fullName: '', phone: '', email: '', subject: '', message: '', subscribe: false })
      showToast({ type: 'success', message: 'Data submitted successfully!' })
    } catch (err) {
      setError('Failed to send message. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (error || !member) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold mb-4'>Team Member Not Found</h1>
          <PrimaryButton href='/team' text='Back to Team' />
        </div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold mb-4'>Team Member Not Found</h1>
          <PrimaryButton href='/team' text='Back to Team' />
        </div>
      </div>
    )
  }

  return (
    <>
      <PageHeader 
        title={member.name} 
        breadcrumb={['HOME', 'TEAM', member.name?.toUpperCase()]} 
      />
      
      <section className='py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12'>
            {/* Left - Sticky Image */}
            <div className='lg:col-span-2 h-fit lg:sticky lg:top-20'>
              <div className='relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-lg'>
                <img 
                  src={getImageUrl(member.image) || '/images/team-3.jpg'} 
                  alt={member.name}
                  className='w-full h-full object-cover'
                />
              </div>
            </div>
            {/* Right - Scrollable Content */}
            <div className='lg:col-span-3 space-y-8'>
              {/* Header Info */}
              <div>
                <h1 className='text-4xl lg:text-5xl font-bold mb-2'>{member.name}</h1>
                <p className='text-xl lg:text-2xl text-(--brand-camel) font-semibold mb-6'>{member.role}</p>
                {/* Social Icons */}
                <div className='flex gap-4 mt-4'>
                  {member.social_facebook && (
                    <a href={member.social_facebook} target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                  )}
                  {member.social_instagram && (
                    <a href={member.social_instagram} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                  )}
                  {member.social_linkedin && (
                    <a href={member.social_linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                  )}
                </div>
                {/* Multi-paragraph bio */}
                <div className='mt-6'>
                  {member.bio?.split('\n').map((para, idx) => (
                    <p key={idx} className='text-gray-700 text-base lg:text-lg leading-relaxed mb-4'>{para}</p>
                  ))}
                </div>
              </div>

              {/* Info Cards */}
              <div className='space-y-3'>
                <div>
                  <p className='text-xs uppercase text-gray-500 font-semibold mb-1'>Responsibility</p>
                  <p className='text-lg font-bold text-gray-900'>{member.responsibility}</p>
                </div>
                <div>
                  <p className='text-xs uppercase text-gray-500 font-semibold mb-1'>Address</p>
                  <p className='text-lg font-bold text-gray-900'>{member.address}</p>
                </div>
                <div>
                  <p className='text-xs uppercase text-gray-500 font-semibold mb-1'>Experience</p>
                  <p className='text-lg font-bold text-gray-900'>{member.experience}</p>
                </div>
                <div>
                  <p className='text-xs uppercase text-gray-500 font-semibold mb-1'>Email</p>
                  <a href={`mailto:${member.email}`} className='text-lg font-bold text-gray-900 hover:text-(--brand-camel) transition-colors'>
                    {member.email}
                  </a>
                </div>
                <div>
                  <p className='text-xs uppercase text-gray-500 font-semibold mb-1'>Phone</p>
                  <a href={`tel:${member.phone}`} className='text-xl font-bold text-(--brand-camel) hover:underline'>
                    {member.phone}
                  </a>
                </div>
              </div>

              {/* Contact Info */}
              <div className='space-y-4'>
                <div>
                  <p className='text-sm text-gray-600 font-semibold mb-1'>Email</p>
                  <a href={`mailto:${member.email}`} className='text-base lg:text-lg font-bold hover:text-(--brand-camel) transition-colors'>
                    {member.email}
                  </a>
                </div>
                <div>
                  <p className='text-sm text-gray-600 font-semibold mb-1'>Phone</p>
                  <a href={`tel:${member.phone}`} className='text-lg lg:text-xl font-bold text-(--brand-camel) hover:underline'>
                    {member.phone}
                  </a>
                </div>
              </div>

              {/* Educational Qualification */}
              <div className='pt-6 border-t border-gray-200'>
                <h2 className='text-2xl lg:text-3xl font-bold mb-6'>Educational Qualification</h2>
                <p className='text-gray-700 text-base lg:text-lg leading-relaxed mb-6'>
                  Our team brings unparalleled creativity and technical proficiency to the world of interior design. We specialize in crafting spaces that are not only aesthetically stunning but also functional and tailored to our clients' unique lifestyles and needs.
                </p>
                <ul className='space-y-4'>
                  {member.education?.split('\n').map((line, idx) => (
                    <li key={idx} className='flex gap-4 items-start'>
                      <span className='w-6 h-6 rounded-full bg-(--brand-camel) text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold'>
                        ✓
                      </span>
                      <span className='text-gray-700 text-base lg:text-lg font-semibold'>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Professional Skills */}
              <div className='pt-6 border-t border-gray-200'>
                <h2 className='text-2xl lg:text-3xl font-bold mb-6'>Professional Skills</h2>
                <p className='text-gray-700 text-base lg:text-lg leading-relaxed mb-8'>
                  {member.name} is a dynamic leader with a comprehensive skill set spanning strategic planning, business development. We specialize in crafting spaces that are not only aesthetically stunning but also functional and tailored to our clients' unique lifestyles and needs.
                </p>
                <div className='space-y-6'>
                  {[
                    { name: 'Specialized Design Areas', percentage: member.specializedDesignAreas || 0 },
                    { name: 'Styles And Trends', percentage: member.stylesAndTrends || 0 },
                    { name: 'Design Principles', percentage: member.designPrinciples || 0 }
                  ].map((skill, idx) => (
                    <div key={idx}>
                      <div className='flex justify-between items-center mb-2'>
                        <p className='font-bold text-gray-800 text-base lg:text-lg'>{skill.name}</p>
                        <p className='text-(--brand-camel) font-bold text-lg'>{skill.percentage}%</p>
                      </div>
                      <div className='border-b-2 border-black' style={{ width: `${skill.percentage}%` }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Form */}
              <div className='pt-6 border-t border-gray-200 pb-12'>
                <h2 className='text-2xl lg:text-3xl font-bold mb-3'>Contact Form</h2>
                <p className='text-gray-600 text-base lg:text-lg mb-8'>
                  I'm here to support your design needs and ensure reliable solutions. Whether it's consultations, design revisions, or implementation support, I\'ve got you covered.
                </p>
                <form onSubmit={handleSubmit} className='space-y-4'>
                  {/* Success toast handled globally */}
                  {error && (
                    <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4'>
                      {error}
                    </div>
                  )}
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <input
                      type='text'
                      name='fullName'
                      placeholder='Your Name*'
                      value={formData.fullName}
                      onChange={handleFormChange}
                      required
                      className='w-full px-4 py-3 rounded-3xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-(--brand-camel) bg-white'
                    />
                    <input
                      type='tel'
                      name='phone'
                      placeholder='Phone'
                      value={formData.phone}
                      onChange={handleFormChange}
                      className='w-full px-4 py-3 rounded-3xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-(--brand-camel) bg-white'
                    />
                  </div>
                  <input
                    type='email'
                    name='email'
                    placeholder='Email Address*'
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className='w-full px-4 py-3 rounded-3xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-(--brand-camel) bg-white'
                  />
                  <input
                    type='text'
                    name='subject'
                    placeholder='Subject'
                    value={formData.subject}
                    onChange={handleFormChange}
                    className='w-full px-4 py-3 rounded-3xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-(--brand-camel) bg-white'
                  />
                  <textarea
                    name='message'
                    placeholder='Message Here...'
                    value={formData.message}
                    onChange={handleFormChange}
                    rows='5'
                    className='w-full px-4 py-3 rounded-3xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-(--brand-camel) bg-white resize-none'
                  />
                  
                  <div className='pt-4'>
                    <SecondaryButton
                      text='Submit Message'
                      type='submit'
                      className='px-6 py-3'
                      iconSize={18}
                    />
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default TeamDetail