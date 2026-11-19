import React from 'react'
import TitleBadge from '../components/common/TitleBadge'
import SecondaryButton from '../components/common/Button/SecondaryButton'
import PageHeader from '../components/common/PageHeader'
import { useState, useEffect } from 'react'

const plans = [
  {
    id: 'basic',
    title: 'Basic Plan',
    description: 'Our foundation plan offers essential features at an affordable price, without breaking the bank.',
    price: '$99.0',
    image: '/images/gallery-1.jpg',
    perks: ['Individuals & Small Projects', 'Access To Design Features', 'Limited Library Of Decorative Items', 'Email Support', 'Monthly Updates']
  },
  {
    id: 'blueprint',
    title: 'Blueprint Plan',
    description: 'Our blueprint plan unlocks tools and broader, ideal for growing teams ready to take their projects to the next level.',
    price: '$169.0',
    image: '/images/intro-bg.jpg',
    perks: ['Small Teams & Growing Businesses', 'Full Access To Design Features', 'Extended Library Of Decorative Items', 'Priority Email Support', 'Bi-Weekly Updates']
  },
  {
    id: 'premium',
    title: 'Premium Plan',
    price: '$249.0',
    image: '/images/intro-bg.avif',
    perks: ['Enterprise Support', 'Custom Library Access', 'Dedicated Designer', 'Onsite Consultations', 'Priority Scheduling']
  }
]

export default function Pricing() {
  const clients = [
    { id: 1, name: 'Olivia Peterson', role: 'Co-founder', feedback: 'A wonderful experience! They knew what they were doing and were incredibly knowledgeable throughout the process.', image: '/images/gallery-1.jpg' },
    { id: 2, name: 'Liam Carter', role: 'CEO', feedback: 'Professional, timely, and the result was better than imagined. Highly recommended.', image: '/images/gallery-3.jpg' },
    { id: 3, name: 'Emma Stone', role: 'Homeowner', feedback: 'They transformed our space with clear communication and beautiful design.', image: '/images/gallery-4.jpg' }
  ]

  const [active, setActive] = useState(0)
  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % clients.length)
    }, 2000)
    return () => clearInterval(id)
  }, [])

  return (
    <>
    <PageHeader title='Our Pricing' breadcrumb={["HOME", "PRICING"]} />
    <div className='py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col lg:flex-row items-start gap-6 lg:gap-8 mb-8'>
          <div>
            <TitleBadge text={'OUR PRICING'} className={'text-black'} />
          </div>
          <div className='flex-1 w-full'>
            <div className='border-l border-l-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl px-4 sm:px-6 font-bold'>
              <span>Design your </span>
              <span className='text-(--brand-camel)'>space,</span>
              <span className='block'>know the cost</span>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch'>
          {/* Left: full height image with overlay text */}
          <div className='rounded-2xl overflow-hidden relative'>
            <img src='/images/service-detail.jpg' alt='pricing hero' className='w-full h-full object-cover min-h-[28rem] md:min-h-[36rem]' />
            <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-transparent flex items-start p-8 md:p-12'>
              <div className='text-white max-w-xs md:max-w-sm'>
                <h2 className='text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight'>
                  <span>Your Dreams, </span>
                  <span className='text-(--brand-camel)'>Our Mission,</span>
                  <span className='block'>Let's Make It Happen.</span>
                </h2>
              </div>
            </div>
          </div>

          {/* Right: two plan cards */}
          {plans.slice(0,2).map(plan => (
            <div key={plan.id} className='bg-white rounded-2xl shadow-sm overflow-hidden relative flex flex-col'>
              {/* subtle blueprint background */}
              <img src='/images/history-bg.png' alt='' className='absolute inset-0 w-full h-full object-cover opacity-5 pointer-events-none' />
              <div className='p-8 relative z-10 flex-1 flex flex-col'>
                <h3 className='text-2xl font-bold mb-2'>{plan.title}</h3>
                {plan.description && (
                  <p className='text-gray-600 mb-4'>{plan.description}</p>
                )}

                <div className='flex items-baseline gap-4 mb-6'>
                  <div className='text-5xl md:text-6xl font-extrabold text-(--brand-camel)'>{plan.price}</div>
                  <div className='text-sm text-gray-400 relative top-1'>/ Per Month</div>
                </div>

                <hr className='border-gray-200 mb-6' />

                <ul className='space-y-3 mb-6'>
                  {plan.perks.map((perk, i) => (
                    <li key={i} className='flex items-start gap-3'>
                      <span className='w-6 h-6 rounded-full bg-(--brand-camel) flex items-center justify-center text-white text-sm'>✓</span>
                      <span className='text-gray-700'>{perk}</span>
                    </li>
                  ))}
                </ul>

                <div className='mt-auto'>
                  <SecondaryButton text='Get Started Now' className='px-6 py-3 border border-gray-300' iconSize={25} />
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
    {/* Simple Testimonial Carousel */}
    <div className='py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12'>
      <div className='max-w-3xl mx-auto text-center'>
        <div className='text-xl md:text-2xl font-semibold text-gray-800 mb-6'>
          "{clients[active].feedback}"
        </div>
        <div className='mx-auto w-18 h-18 rounded-full overflow-hidden mb-4'>
          <img src={clients[active].image} alt={clients[active].name} className='w-full h-full object-cover' />
        </div>
        <div className='text-sm text-gray-500'>
          <div className='font-bold'>{clients[active].name}</div>
          <div>{clients[active].role}</div>
        </div>
      </div>
    </div>
    </>
  )
}

