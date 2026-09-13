import { useEffect, useState } from "react";
import makeRequest from "../makeRequest";

const CACHE_PREFIX = "shivexa_cache_";

const useFetch = (url) => {
  const cacheKey = CACHE_PREFIX + url;

  // Try reading initial data from session storage for instant render
  const getInitialData = () => {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch (e) {
      // Ignore cache errors
    }
    return null;
  };

  const initialData = getInitialData();
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        // If we didn't have cached data, set loading state
        if (!sessionStorage.getItem(cacheKey)) {
          setLoading(true);
        }

        const res = await makeRequest.get(url);
        const result = res.data ?? null;

        if (isMounted) {
          setData(result);
          setError(false);
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify(result));
          } catch (e) {}
        }
      } catch (err) {
        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url, cacheKey]);

  return { data, loading, error };
};

export default useFetch;
