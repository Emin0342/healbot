// useCurrentUser.jsx
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/app/firebase'; // Importer Firebase depuis votre fichier

const useCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.error('Current user:', currentUser);
      setUser(currentUser);
      setLoading(false);
    });

    // Nettoyer l'écouteur quand le composant se démonte
    return () => unsubscribe();
  }, []);

  return { user, loading };
};

export default useCurrentUser;
