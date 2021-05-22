import { useState, useRef, useEffect } from 'react';

const useDelayedRequest = (makeRequest, query, requestDelay) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutIdRef = useRef(null);

  useEffect(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    if (!query) return;

    setIsLoading(true);

    timeoutIdRef.current = setTimeout(async () => {
      try {
        const data = await makeRequest(query);
        setData(data);
      } catch (e) {
      } finally {
        setIsLoading(false);
        timeoutIdRef.current = null;
      }
    }, requestDelay);

    return () => {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    }
  }, [query, makeRequest, requestDelay]);

  return [isLoading, data, setData];
};

export default useDelayedRequest;
