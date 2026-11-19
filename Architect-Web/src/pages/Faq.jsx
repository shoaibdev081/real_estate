import React from 'react'
import PageHeader from '../components/common/PageHeader'

function Faq() {
  return (
    <>
      <PageHeader title='FAQ' breadcrumb={['HOME', 'FAQ']} />
      <section className='py-16 lg:py-24 px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4'>Frequently Asked Questions</h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>Find answers to common questions about our services and process.</p>
          </div>
          {/* FAQ items will go here */}
        </div>
      </section>
    </>
  )
}

export default Faq