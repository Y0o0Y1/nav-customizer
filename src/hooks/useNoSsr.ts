import { useEffect, useState } from 'react';

export const useNoSsr = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return { isClient };
}; 