import { useState, useEffect } from 'react';
import { getPortfolioItems } from '../firebase/firestore';

/**
 * Custom hook to fetch properties based on type
 * @param {string} type - 'residential' or 'land'
 * @returns {object} { properties, loading, error }
 */
export const usePropertyData = (type) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        let result;

        if (type === 'residential') {
          // Fetch all residential properties
          result = await getPortfolioItems('residential');
        } else if (type === 'land') {
          // Fetch land properties
          result = await getPortfolioItems('land');
        } else {
          throw new Error('Invalid property type');
        }

        if (result.success && result.data) {
          // Sort by name for better UX
          const sortedData = result.data.sort((a, b) => {
            const nameA = (a.name || a.title || '').toLowerCase();
            const nameB = (b.name || b.title || '').toLowerCase();
            return nameA.localeCompare(nameB);
          });
          setProperties(sortedData);
        } else {
          setError(result.error || 'Failed to fetch properties');
          setProperties([]);
        }
      } catch (err) {
        setError(err.message);
        setProperties([]);
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    if (type) {
      fetchProperties();
    }
  }, [type]);

  return { properties, loading, error };
};
