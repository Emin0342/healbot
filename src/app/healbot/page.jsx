"use client";
import React, { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bot, User } from "lucide-react";
import conversationTreeData from "./arbo.json"; // Import statique du fichier JSON
import { doc, getDoc } from "firebase/firestore";
import { firestoreDb } from "@/app/firebase"; // Importer Firebase Firestore
import { realTimeDb } from "@/app/firebase"; // Importer Firebase Realtime Database
import useCurrentUser from "@/hooks/useCurrentUser";
import { TopNavBarBot } from "@/components/topnavbarBot";
import { ref, push } from "firebase/database"; // Importer les fonctions nécessaires

export default function HealthChatbot() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "Bonjour ! Je suis votre assistant santé virtuel. Comment puis-je vous aider aujourd'hui ?",
    },
  ]);
  const [conversationTree] = useState(conversationTreeData);
  const [currentStep, setCurrentStep] = useState(null);
  const [cancerInfo, setCancerInfo] = useState({
    cancerStatus: "non",
    cancerType: "",
  });

  const { user, loading } = useCurrentUser(); // Utilisation du hook pour obtenir l'utilisateur connecté

  const messagesEndRef = useRef(null); // Référence pour le défilement

  // Fonction pour lire le texte avec SpeechSynthesis
  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "fr-FR"; // Langue française
      window.speechSynthesis.speak(utterance);
    }
  };

  // Fonction qui gère l'événement 'mouseover'
  const handleMouseOver = (event) => {
    const textToRead = event.target.innerText;
    if (textToRead) {
      speakText(textToRead); // Lire le texte à haute voix
    }
  };

  // Utiliser useEffect pour gérer l'utilisateur
  useEffect(() => {
    if (loading) return; // Attendre que l'utilisateur soit chargé
    if (user) {
      const fetchUserData = async () => {
        const userDoc = await getDoc(doc(firestoreDb, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCancerInfo({
            cancerStatus: userData.cancerStatus || "non",
            cancerType: userData.cancerType || "",
          });

          // Vérifier si l'utilisateur est malentendant
          if (userData.isHearingImpaired) {
            console.log("L'utilisateur est malentendant");
            document.addEventListener("mouseover", handleMouseOver); // Activer la lecture du texte
          } else {
            console.log("L'utilisateur n'est pas malentendant");
            document.removeEventListener("mouseover", handleMouseOver); // Désactiver la lecture du texte
          }
        }
      };
      fetchUserData();
    }
  }, [user, loading]);

  // Utiliser useEffect pour faire défiler vers le bas chaque fois que les messages changent
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Utiliser useEffect pour ajouter l'événement de survol et lire les messages
  useEffect(() => {
    return () => {
      document.removeEventListener("mouseover", handleMouseOver); // Nettoyer les événements après le démontage du composant
    };
  }, []);

  const handleBodyPartClick = (part) => {
    const nextStep = conversationTree[part];

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: `Douleur au niveau de la ${part}` },
    ]);
    if (nextStep) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: nextStep.question },
        ]);
        setCurrentStep(nextStep);
      }, 1000);
    }
  };

  const handleHeadPartClick = (headPart) => {
    const nextStep = conversationTree[headPart];

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: `Douleur au niveau de la ${headPart}` },
    ]);
    if (nextStep) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: nextStep.question },
        ]);
        setCurrentStep(nextStep);
      }, 1000);
    }

    if (headPart === "gorge") {
      if (
        cancerInfo.cancerStatus === "oui" &&
        cancerInfo.cancerType === "gorge"
      ) {
        setTimeout(() => {
          const cancerResponse = conversationTree.cancer_gorge_oui;
          setMessages((prev) => [
            ...prev,
            { role: "bot", content: cancerResponse.question },
          ]);
          setCurrentStep(cancerResponse);
        }, 1500);
      } else {
        const cancerResponse = conversationTree.cancer_gorge_non;
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { role: "bot", content: cancerResponse.question },
          ]);
          setCurrentStep(cancerResponse);
        }, 1500);
      }
    }
  };

  const handleOptionClick = (option) => {
    if (currentStep) {
      const selectedOption = currentStep.options[option];

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: option },
      ]);

      if (typeof selectedOption === "string") {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { role: "bot", content: selectedOption },
          ]);
          setCurrentStep(null);
        }, 1000);
      } else {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { role: "bot", content: selectedOption.question },
          ]);
          setCurrentStep(selectedOption);
        }, 1000);
      }
    }
  };

  const handleNewConversation = async () => {
    if (user) {
      const conversationRef = ref(realTimeDb, `conversations/${user.uid}`);
      const conversationData = messages
        .map((message, index) => ({
          question: index % 2 === 0 ? message.content : null,
          response: index % 2 !== 0 ? message.content : null,
        }))
        .filter((item) => item.question || item.response); // Filtrer les entrées vides

      await push(conversationRef, conversationData);
    }

    // Réinitialiser les messages pour une nouvelle conversation
    setMessages([
      {
        role: "bot",
        content:
          "Bonjour ! Je suis votre assistant santé virtuel. Comment puis-je vous aider aujourd'hui ?",
      },
    ]);
    setCurrentStep(null); // Réinitialiser l'étape courante
  };

  return (
    <>
      <TopNavBarBot />
      <div className="flex">
        <div className="flex-1 flex items-center justify-center h-screen">
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Assistant Santé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] pr-4 overflow-y-auto">
                {messages.map((message, index) => {
                  const isUserMessage = message.role === "user";
                  const isBotMessage = message.role === "bot";

                  return (
                    <div
                      key={index}
                      className={`flex ${
                        isUserMessage ? "justify-end" : "justify-start"
                      } mb-4`}
                    >
                      <div
                        className={`flex items-start ${
                          isUserMessage ? "flex-row-reverse" : ""
                        }`}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            {isUserMessage ? (
                              <User className="w-6 h-6" />
                            ) : (
                              <Bot className="w-6 h-6" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`mx-2 p-3 rounded-lg ${
                            isUserMessage
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                          onMouseOver={isBotMessage ? handleMouseOver : undefined} // Ajout de l'événement de survol
                        >
                          {isBotMessage
                            ? `${message.content}`
                            : ` ${message.content}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} /> {/* Référence pour faire défiler vers le bas */}
              </div>

              {currentStep === null ? (
                <div className="mt-4 text-center">
                  <p>Cliquez là où vous avez mal :</p>
                  <div className="flex justify-center gap-6 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => handleBodyPartClick("tête")}
                    >
                      Tête
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleBodyPartClick("corps")}
                    >
                      Corps
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleBodyPartClick("bas du corps")}
                    >
                      Bas du corps
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 text-center">
                  <p>Choisissez une option :</p>
                  <div className="flex justify-center gap-6 mt-4">
                    {Object.keys(currentStep.options).map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => {
                          if (currentStep === conversationTree["tête"]) {
                            handleHeadPartClick(option); // Pour les parties de la tête
                          } else {
                            handleOptionClick(option); // Pour les autres parties
                          }
                        }}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
            <Button onClick={handleNewConversation} className="mt-4 flex justify-center"> Nouvelle conversation </Button>

            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
