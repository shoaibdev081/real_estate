import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import useFetchBase from './useFetch';

export default function useFetchWithToast(url, options) {
  const toast = useToast();
  const { data, loading, error } = useFetchBase(url, options);

  // Only show toast on actual error, not on initial load
  useEffect(() => {
    if (error && !loading) {
      toast.showToast('Failed to fetch data from backend', 'error');
    }
  }, [error, loading]);

  return { data, loading, error };
}
