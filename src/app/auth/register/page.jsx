"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { auth, firestoreDb } from "@/app/firebase";
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from 'next/navigation';

export default function RegisterComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [cancerStatus, setCancerStatus] = useState("");
  const [cancerType, setCancerType] = useState("");
  const [vaccines, setVaccines] = useState({});
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Format d'email invalide.");
        return;
      }
      if (password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères.");
        return;
      }
      setError("");
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3 && cancerType) {
      setStep(4);
    } else if (step === 4) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        const userDocRef = doc(firestoreDb, "users", user.uid);
        await setDoc(userDocRef, {
          email: user.email,
          cancerStatus: cancerStatus,
          cancerType: cancerType,
          vaccines: vaccines,
        });
        console.log("User registered with success");
        router.push('/healbot');
      } catch (error) {
        console.error("Error registering user", error);
        setError("Erreur lors de l'inscription. Veuillez réessayer.");
      }
    }
  };

  const handleVaccineChange = (vaccine) => {
    setVaccines((prev) => ({
      ...prev,
      [vaccine]: !prev[vaccine],
    }));
  };

  return (
    <>
      <div className="bg-gray-100 dark:bg-gray-900 w-full h-screen flex justify-center items-center">
        <Card className="max-w-sm w-full shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Inscription</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleRegister} className="space-y-4">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full"
                  >
                    Suivant
                  </Button>
                </>
              )}
              {step === 2 && (
                <>
                  <Label>Avez-vous un cancer ?</Label>
                  <Button
                    type="button"
                    onClick={() => {
                      setCancerStatus("oui");
                      setStep(3);
                    }}
                    className="w-full"
                  >
                    Oui
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setCancerStatus("non");
                      setStep(4);
                    }}
                    className="w-full"
                  >
                    Non
                  </Button>
                </>
              )}
              {step === 3 && cancerStatus === "oui" && (
                <>
                  <Label>Type de cancer :</Label>
                  <Select onValueChange={setCancerType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionnez un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cerveau">Cancer du cerveau</SelectItem>
                      <SelectItem value="gorge">Cancer de la gorge</SelectItem>
                      <SelectItem value="sein">Cancer du sein</SelectItem>
                      <SelectItem value="poumon">Cancer du poumon</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={() => setStep(4)}
                    className="w-full"
                  >
                    Suivant
                  </Button>
                </>
              )}
              {step === 4 && (
                <>
                  <Label>Vaccins reçus :</Label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox
                        id="vaccine1"
                        onCheckedChange={() => handleVaccineChange("HépatiteB")}
                      />
                      <Label htmlFor="vaccine1" className="ml-2">
                        Hépatite B
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        id="vaccine2"
                        onCheckedChange={() =>
                          handleVaccineChange("Haemophilus")
                        }
                      />
                      <Label htmlFor="vaccine2" className="ml-2">
                        Haemophilus influenzae B
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        id="vaccine3"
                        onCheckedChange={() => handleVaccineChange("Corona")}
                      />
                      <Label htmlFor="vaccine3" className="ml-2">
                        CoronaVirus (COVID-19)
                      </Label>
                    </div>
                    {/* Ajoutez d'autres vaccins ici */}
                  </div>
                  <Button type="submit" className="w-full">
                    Terminer l'inscription
                  </Button>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
