import React from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'

function ErrorPage() {
  return (
    <>
      <PageHeader title='404 - Page Not Found' breadcrumb={['HOME', 'ERROR']} />
      <section className='py-20 px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto text-center'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>Sorry, page not found</h2>
          <p className='text-gray-600 text-lg mb-10 max-w-2xl mx-auto'>The page you're looking for doesn't exist or has been moved. Please check the URL or go back to the home page.</p>
          <Link
            to="/"
            className='inline-block px-8 py-3 rounded-lg font-semibold transition text-white'
            style={{ backgroundColor: 'var(--brand-camel)' }}
          >
            Go Back Home
          </Link>
        </div>
      </section>
    </>
  )
}

export default ErrorPage