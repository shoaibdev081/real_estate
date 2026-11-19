import React, { useState, useEffect } from 'react'
import PageHeader from '../../components/common/PageHeader'
import TitleBadge from '../../components/common/TitleBadge'
import SecondaryButton from '../../components/common/Button/SecondaryButton'
import { useNavigate } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { apiRequest, getImageUrl } from '../../lib/apiClient'

function Team() {
  const [shown, setShown] = useState(6)
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [owner, setOwner] = useState(null)
  const [ownerLoading, setOwnerLoading] = useState(true)
  const [ownerError, setOwnerError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await apiRequest('/team')
        setTeamMembers(res.data)
      } catch (err) {
        setError('Failed to load team members')
      } finally {
        setLoading(false)
      }
    }
    fetchTeam()
    // Fetch company owner data
    const fetchOwner = async () => {
      try {
        const res = await apiRequest('/company-owner')
        setOwner(res.data)
      } catch (err) {
        setOwnerError('Failed to load company owner')
      } finally {
        setOwnerLoading(false)
      }
    }
    fetchOwner()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <>
      <PageHeader title='Our Team' breadcrumb={['HOME', 'TEAM']} />
      {/* Team Header Section */}
      <section className='py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12'>
        <div className='max-w-7xl 2xl:max-w-[1536px] mx-auto'>
          <div className='flex flex-col lg:flex-row items-start gap-6 lg:gap-8 mb-12'>
            <div>
              <TitleBadge text={'AMAZING DESIGN TEAM'} className={'text-black'} />
            </div>
            <div className='flex-1 w-full'>
              <div className='border-l border-l-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl px-4 sm:px-6 font-bold'>
                <span>Meet the </span>
                <span className='text-(--brand-camel)'>Experts</span>
                <span className='block'>Our interior designers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className='py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-gray-50'>
        <div className='max-w-7xl 2xl:max-w-[1536px] mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {teamMembers.slice(0, shown).map((member, idx) => (
              <div
                key={member._id}
                className={idx % 3 === 1 ? 'lg:pt-8' : ''}
              >
                <div
                  onClick={() => navigate(`/team/${member._id}`)}
                  className='group cursor-pointer rounded-2xl overflow-hidden h-96 relative'
                >
                  <img
                    src={getImageUrl(member.image) || '/images/team-3.jpg'}
                    alt={member.name}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                  />
                  {/* Gradient Overlay - light, only at bottom */}
                  <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60' />
                  {/* Member Info */}
                  <div className='absolute bottom-16 left-6 right-0 text-white text-left'>
                    <h3 className='text-xl font-bold group-hover:text-(--brand-camel) transition-colors duration-300'>{member.name}</h3>
                    <p className='text-sm text-gray-300 group-hover:text-gray-100'>{member.role}</p>
                  </div>
                  {/* Social Icons - Hidden by default, shown on hover - Individual hover */}
                  <div className='absolute bottom-2 left-6 right-0 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    {member.social_facebook && (
                      <a href={member.social_facebook} onClick={e => e.stopPropagation()} target="_blank" rel="noopener noreferrer" className='w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-(--brand-camel) hover:border-(--brand-camel) transition-all'>
                        <FaFacebook size={16} />
                      </a>
                    )}
                    {member.social_instagram && (
                      <a href={member.social_instagram} onClick={e => e.stopPropagation()} target="_blank" rel="noopener noreferrer" className='w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-(--brand-camel) hover:border-(--brand-camel) transition-all'>
                        <FaInstagram size={16} />
                      </a>
                    )}
                    {member.social_linkedin && (
                      <a href={member.social_linkedin} onClick={e => e.stopPropagation()} target="_blank" rel="noopener noreferrer" className='w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-(--brand-camel) hover:border-(--brand-camel) transition-all'>
                        <FaLinkedin size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Show/Hide More Button */}
          {(shown < teamMembers.length || shown > 6) && (
            <div className='flex justify-center mt-12'>
              <SecondaryButton
                text={shown < teamMembers.length ? 'Show More Team Members' : 'Show Less'}
                onClick={() => shown < teamMembers.length ? setShown(shown + 6) : setShown(6)}
                className='px-6 py-3 border border-gray-300'
                iconSize={20}
              />
            </div>
          )}
        </div>
      </section>

      {/* Company Owner Quote Section (Live) */}
      <section className='py-16 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12'>
        <div className='max-w-3xl mx-auto text-center'>
          <div className='mx-auto w-24 h-24 mb-8 bg-white rounded-full p-2 inline-flex items-center justify-center'>
            <img src={getImageUrl(owner?.logo) || '/assets/images1/Monda/logo_monda.png'} alt={owner?.companyName || 'Company Logo'} className='w-20 h-20' />
          </div>
          <p className='text-2xl md:text-3xl font-semibold text-gray-800 mb-8'>
            {ownerLoading ? 'Loading quote...' : (owner?.quote || '"I absolutely love my the new modern living room! The clean lines, a neutral tones, and minimalist interior create such a calming & stylish atmosphere. Highly recommend their modern interior design services!"')}
          </p>
          <div className='mx-auto w-20 h-20 rounded-full overflow-hidden mb-4'>
            <img src={getImageUrl(owner?.image) || '/images/team-3.jpg'} alt={owner?.name || 'Company Owner'} className='w-full h-full object-cover' />
          </div>
          <div className='text-center'>
            <h4 className='text-lg font-bold'>{owner?.name || 'Morgan Dufresne'}</h4>
            <p className='text-gray-500'>{owner?.role || 'Company owner'}</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Team