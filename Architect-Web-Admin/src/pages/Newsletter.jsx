import React, { useState, useEffect } from 'react';
import { FiMail, FiUsers, FiDownload, FiTrash2, FiSearch } from 'react-icons/fi';
import useFetchWithToast from '../hooks/useFetchWithToast';

function Newsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);

  // Fetch subscribers
  const { data, loading: fetchLoading } = useFetchWithToast('/api/newsletter/subscribers');

  useEffect(() => {
    console.log('Newsletter data response:', data);
    if (data?.success) {
      setSubscribers(data.data || []);
    } else if (data) {
      // Handle case where response is direct data without success wrapper
      setSubscribers(Array.isArray(data) ? data : []);
    }
    setLoading(false);
  }, [data]);

  // Filter subscribers based on search
  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle delete subscriber
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscriber?')) {
      try {
        const response = await fetch(`/api/newsletter/subscribers/${id}`, {
          method: 'DELETE'
        });
        const result = await response.json();
        if (result.success) {
          setSubscribers(subscribers.filter(sub => sub._id !== id));
        }
      } catch (error) {
        console.error('Failed to delete subscriber:', error);
      }
    }
  };

  // Export subscribers to CSV
  const exportToCSV = () => {
    const csvContent = [
      ['Email', 'Subscribed Date'],
      ...filteredSubscribers.map(sub => [
        sub.email,
        new Date(sub.subscribedAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter_subscribers.csv';
    a.click();
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedSubscribers.length === 0) {
      alert('Please select subscribers to delete');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedSubscribers.length} subscribers?`)) {
      try {
        const response = await fetch('/api/newsletter/subscribers/bulk-delete', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedSubscribers })
        });
        const result = await response.json();
        if (result.success) {
          setSubscribers(subscribers.filter(sub => !selectedSubscribers.includes(sub._id)));
          setSelectedSubscribers([]);
        }
      } catch (error) {
        console.error('Failed to delete subscribers:', error);
      }
    }
  };

  if (loading || fetchLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Newsletter Subscribers</h1>
        <p className="text-gray-600">Manage your newsletter subscribers and export their emails</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FiUsers className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">{subscribers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <FiMail className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Email List Ready</p>
              <p className="text-2xl font-bold text-gray-900">Export</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <FiDownload className="text-purple-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Download</p>
              <p className="text-2xl font-bold text-gray-900">CSV</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search subscribers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiDownload size={16} />
              Export Emails
            </button>
            {selectedSubscribers.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FiTrash2 size={16} />
                Delete Selected ({selectedSubscribers.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto scrollbar-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSubscribers(filteredSubscribers.map(sub => sub._id));
                      } else {
                        setSelectedSubscribers([]);
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscribed Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscribers.map((subscriber) => (
                <tr key={subscriber._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedSubscribers.includes(subscriber._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSubscribers([...selectedSubscribers, subscriber._id]);
                        } else {
                          setSelectedSubscribers(selectedSubscribers.filter(id => id !== subscriber._id));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {subscriber.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(subscriber.subscribedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDelete(subscriber._id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSubscribers.length === 0 && (
          <div className="text-center py-8">
            <FiMail className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">No subscribers found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Newsletter;
