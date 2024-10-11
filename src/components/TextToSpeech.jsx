import { useEffect } from "react";

const TextToSpeech = () => {
  let utterance = null;

  // Fonction pour lire le texte
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("La synthèse vocale n'est pas supportée par ce navigateur.");
    }
  };

  // Fonction pour arrêter la lecture
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Arrête toute lecture en cours
    }
  };

  // Effet pour nettoyer au cas où la lecture se poursuit
  useEffect(() => {
    return () => {
      stopSpeaking(); // Nettoyage en quittant le composant
    };
  }, []);

  return (
    <div>
      <h1 
        onMouseEnter={() => speak("Bienvenue sur la page de profil")} 
        onMouseLeave={stopSpeaking}
      >
        Bienvenue sur la page de profil
      </h1>
      
      <p
        onMouseEnter={() => speak("Voici des informations importantes sur votre profil.")}
        onMouseLeave={stopSpeaking}
      >
        Voici des informations importantes sur votre profil.
      </p>

      <button
        onMouseEnter={() => speak("Cliquez ici pour mettre à jour votre profil.")}
        onMouseLeave={stopSpeaking}
      >
        Mettre à jour le profil
      </button>
    </div>
  );
};

export default TextToSpeech;
