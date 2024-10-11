"use client";
import { useEffect } from "react";

export default function TextToSpeechComponent() {
  useEffect(() => {
    // Fonction qui va lire le texte
    const speakText = (text) => {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "fr-FR"; // Définir la langue
        window.speechSynthesis.speak(utterance);
      } else {
        console.log("SpeechSynthesis not supported in this browser.");
      }
    };

    // Fonction pour gérer le survol de la souris sur les éléments
    const handleMouseOver = (event) => {
      const textToRead = event.target.innerText; // Récupérer le texte de l'élément survolé
      if (textToRead) {
        speakText(textToRead); // Lire le texte
      }
    };

    // Ajouter l'événement de survol à tous les éléments contenant du texte
    document.addEventListener("mouseover", handleMouseOver);

    // Nettoyer les événements après le démontage du composant
    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <div>
      <h1>Survolez les éléments pour qu'ils soient lus à haute voix</h1>
      <p>Ceci est un paragraphe que l'IA va lire lorsque vous survolerez avec le curseur.</p>
      <p>Un autre texte que vous pouvez survoler.</p>
      <button>Survolez-moi aussi !</button>
    </div>
  );
}
