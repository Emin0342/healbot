'use client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { auth, firestoreDb } from '@/app/firebase';
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore"; // Importer setDoc pour écrire dans Firestore
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"; // Importer le composant Checkbox

export default function Component() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1); // Étape du formulaire
  const [cancerStatus, setCancerStatus] = useState(""); // État pour la question sur le cancer
  const [cancerType, setCancerType] = useState(""); // État pour le type de cancer
  const [vaccines, setVaccines] = useState({}); // État pour les vaccins
  const [error, setError] = useState(""); // État pour les messages d'erreur

  const handleRegister = async (e) => {
    e.preventDefault();
    if (step === 1) {
      // Vérifier le format de l'email et la longueur du mot de passe
      if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Format d'email invalide.");
        return;
      }
      if (password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères.");
        return;
      }
      setError(""); // Réinitialiser les erreurs si tout est bon
      setStep(2); // Passer à l'étape 2
    } else if (step === 2) {
      // Étape 2 : Vérifier la réponse à la question sur le cancer
      setStep(3); // Passer à l'étape 3 pour afficher le type de cancer
    } else if (step === 3) {
      // Vérifier que le type de cancer est sélectionné
      if (!cancerType) {
        setError("Veuillez sélectionner un type de cancer.");
        return;
      }
      setStep(4); // Passer à l'étape 4 pour les vaccins
    } else if (step === 4) {
      // Étape 4 : Vérification des vaccins
      // Création de l'utilisateur
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Créer une sous-collection pour l'utilisateur
        const userDocRef = doc(firestoreDb, "users", user.uid);
        await setDoc(userDocRef, {
          email: user.email,
          cancerStatus: cancerStatus,
          cancerType: cancerType,
          vaccines: vaccines, // Ajouter les vaccins à la collection
        });

        console.log("User registered with success");
      } catch (error) {
        console.error("Error registering user", error);
        setError("Erreur lors de l'inscription. Veuillez réessayer."); // Message d'erreur générique
      }
    }
  };

  // Fonction pour gérer le changement d'état des vaccins
  const handleVaccineChange = (vaccine) => {
    setVaccines((prev) => ({
      ...prev,
      [vaccine]: !prev[vaccine], // Basculer l'état du vaccin
    }));
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Inscription</CardTitle>
        {/* <CardDescription>Entrez votre email et votre mot de passe pour vous inscrire</CardDescription> */}
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500">{error}</p>} {/* Afficher le message d'erreur */}
        <form onSubmit={handleRegister} className="space-y-4">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" type="password" required onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="button" onClick={() => setStep(2)} className="w-full">
                Suivant
              </Button>
            </>
          )}
          {step === 2 && (
            <>
              <Label>Avez-vous un cancer ?</Label>
              <div className="space-y-2">
                <Button 
                  type="button" 
                  onClick={() => {
                    setCancerStatus("oui");
                    setStep(3); // Passer à l'étape 3
                  }} 
                  className={`w-full ${cancerStatus === "oui" ? "bg-black text-white" : ""}`}>
                  Oui
                </Button>
                <Button 
                  type="button" 
                  onClick={() => {
                    setCancerStatus("non");
                    setStep(4); // Passer à l'étape 3
                  }} 
                  className={`w-full ${cancerStatus === "non" ? "bg-black text-white" : ""}`}>
                  Non
                </Button>
              </div>
            </>
          )}
          {step === 3 && cancerStatus === "oui" && (
            <>
              <Label htmlFor="cancerType">Type de cancer :</Label>
              <Select onValueChange={setCancerType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cerveau">Cancer du cerveau</SelectItem>
                  <SelectItem value="gorge">Cancer de la gorge</SelectItem>
                  <SelectItem value="sein">Cancer du sein</SelectItem>
                  <SelectItem value="poumon">Cancer du poumon</SelectItem>
                  <SelectItem value="prostate">Cancer de la prostate</SelectItem>
                  <SelectItem value="peau">Cancer de la peau</SelectItem>
                  <SelectItem value="colorectal">Cancer colorectal</SelectItem>
                  {/* Ajoutez d'autres types de cancer ici */}
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full" onClick={() => setStep(4)}>
                Terminer l&apos;inscription
              </Button>
            </>
          )}
          {step === 4 && (
            <>
              <Label>Vaccins reçus :</Label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox id="vaccine1" onCheckedChange={() => handleVaccineChange("HépatiteB")} />
                  <Label htmlFor="vaccine1" className="ml-2">Hépatite B</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="vaccine2" onCheckedChange={() => handleVaccineChange("Haemophilus")} />
                  <Label htmlFor="vaccine2" className="ml-2">Haemophilus influenzae B</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="vaccine3" onCheckedChange={() => handleVaccineChange("Corona")} />
                  <Label htmlFor="vaccine3" className="ml-2">CoronaVirus (COVID-19)</Label>
                </div>
                {/* Ajoutez d'autres vaccins ici */}
              </div>
              <Button type="submit" className="w-full">
                Terminer l&apos;inscription
              </Button>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
