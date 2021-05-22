import { useEffect } from 'react';

const useClickOutside = (handler) => {
  useEffect(() => {
    document.addEventListener("click", handler, false);

    return () =>
      document.removeEventListener("click", handler, false);
  }, [handler]);
};

export default useClickOutside;
