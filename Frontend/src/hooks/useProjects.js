import { useState, useEffect } from 'react';

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This is where you'd fetch data from a backend or a database like Firestore.
    // For now, we'll use a timeout to simulate a network request.
    const dummyData = [];
    setTimeout(() => {
      setProjects(dummyData);
      setIsLoading(false);
    }, 1000);
  }, []);

  return { projects, isLoading };
};

export default useProjects;