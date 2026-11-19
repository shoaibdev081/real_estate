import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/apiClient';

export default function ExampleApiUsage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiRequest('/projects')
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading…</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div>
      <h2>Projects (API Example)</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
