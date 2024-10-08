"use client"

import * as React from "react"
import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User } from "lucide-react"
import conversationTreeData from './arbo.json'; // Import statique du fichier JSON

// Typage de l'arborescence de conversation
type ConversationOptions = {
  [key: string]: string | ConversationStep // Peut être une réponse finale ou un sous-étape
}

type ConversationStep = {
  question: string
  options: ConversationOptions
}

type ConversationTree = {
  [key: string]: ConversationStep
}

type Message = {
  role: "user" | "bot"
  content: string
}

export default function HealthChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Bonjour ! Je suis votre assistant santé virtuel. Comment puis-je vous aider aujourd'hui ?" },
  ])
  const [conversationTree] = useState<ConversationTree>(conversationTreeData) // Arborescence chargée directement
  const [currentStep, setCurrentStep] = useState<ConversationStep | null>(null) // Étape actuelle de la conversation

  // Gérer les clics sur les différentes parties du corps
  const handleBodyPartClick = (part: keyof ConversationTree) => {
    const nextStep = conversationTree[part]

    // Ajouter le message de l'utilisateur et la prochaine question
    setMessages([...messages, { role: "user", content: `Douleur au niveau de la ${part}` }])
    if (nextStep) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: "bot", content: nextStep.question }])
        setCurrentStep(nextStep)
      }, 1000)
    }
  }

  // Gérer les sous-options (par exemple : mal à la tête, puis mal aux yeux)
  const handleOptionClick = (option: string) => {
    if (currentStep) {
      const selectedOption = currentStep.options[option]

      // Ajouter le message de l'utilisateur
      setMessages([...messages, { role: "user", content: option }])

      if (typeof selectedOption === "string") {
        // Si l'option sélectionnée est une réponse finale
        setTimeout(() => {
          setMessages(prev => [...prev, { role: "bot", content: selectedOption }])
          setCurrentStep(null) // Réinitialiser la conversation
        }, 1000)
      } else {
        // Si l'option est une sous-étape, poser la nouvelle question
        setTimeout(() => {
          setMessages(prev => [...prev, { role: "bot", content: selectedOption.question }])
          setCurrentStep(selectedOption)
        }, 1000)
      }
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Assistant Santé</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}>
              <div className={`flex items-start ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {message.role === "user" ? (
                      <User className="w-6 h-6" />
                    ) : (
                      <Bot className="w-6 h-6" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className={`mx-2 p-3 rounded-lg ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {message.content}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>

        {/* Choix des parties du corps ou sous-options */}
        {currentStep === null ? (
          <div className="mt-4 text-center">
            <p>Cliquez là où vous avez mal :</p>
            <div className="flex justify-center gap-6 mt-4">
              <Button variant="outline" onClick={() => handleBodyPartClick("tête")}>
                Tête
              </Button>
              <Button variant="outline" onClick={() => handleBodyPartClick("corps")}>
                Corps
              </Button>
              <Button variant="outline" onClick={() => handleBodyPartClick("bas du corps")}>
                Bas du corps
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-center">
            <p>Choisissez une option :</p>
            <div className="flex justify-center gap-6 mt-4">
              {Object.keys(currentStep.options).map((option, index) => (
                <Button key={index} variant="outline" onClick={() => handleOptionClick(option)}>
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {/* Rien ici */}
      </CardFooter>
    </Card>
  )
}
