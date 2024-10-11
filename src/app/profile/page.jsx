"use client";
import { useEffect, useState } from "react";
import { firestoreDb } from "@/app/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import useCurrentUser from "@/hooks/useCurrentUser";
import { TopNavBarBot } from "@/components/topnavbarBot";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircledIcon } from "@radix-ui/react-icons";

const ProfilePage = () => {
  const { user } = useCurrentUser();
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [hasCancer, setHasCancer] = useState(false);
  const [cancerType, setCancerType] = useState("");
  const [vaccines, setVaccines] = useState({});
  const [isHearingImpaired, setIsHearingImpaired] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  let utterance = null;

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      console.log("La synthèse vocale est supportée par ce navigateur.");
      utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      console.error(
        "La synthèse vocale n'est pas supportée par ce navigateur."
      );
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  console.log("ProfilePage");

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(firestoreDb, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setEmail(data.email || user.email);
          setPhoneNumber(data.phoneNumber || "");
          setHasCancer(data.cancerStatus === "oui");
          setCancerType(data.cancerType || "");
          setVaccines(data.vaccines || {});
          setIsHearingImpaired(data.isHearingImpaired || false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (user) {
      try {
        if (user.email !== email) {
          await user.updateEmail(email);
        }

        const userDocRef = doc(firestoreDb, "users", user.uid);
        await setDoc(userDocRef, {
          email: email,
          phoneNumber: phoneNumber,
          cancerStatus: hasCancer ? "oui" : "non",
          cancerType: hasCancer ? cancerType : "",
          vaccines: vaccines,
          isHearingImpaired: isHearingImpaired,
        });

        console.log("Profile updated successfully");
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 5000);
      } catch (error) {
        console.error("Error updating profile", error);
        setError(
          "Erreur lors de la mise à jour du profil. Veuillez réessayer."
        );
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
      <TopNavBarBot></TopNavBarBot>
      <div className="bg-gray-100 dark:bg-gray-900 w-full h-screen flex justify-center items-center">
        <Card className="max-w-sm w-full shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle
              className="text-2xl font-bold"
              onMouseEnter={() => speak("Profil")}
              onMouseLeave={stopSpeaking}
            >
              Profil
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-500">{error}</p>}
            {showSuccessAlert && (
              <Alert className="mb-4">
                <CheckCircledIcon className="h-4 w-4" />
                <AlertTitle>Succès</AlertTitle>
                <AlertDescription>
                  Votre profil a été mis à jour avec succès.
                </AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  onMouseEnter={() => speak("Email")}
                  onMouseLeave={stopSpeaking}
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  required
                  onMouseEnter={() => speak("Renseigner votre email")}
                  onMouseLeave={stopSpeaking}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="phoneNumber"
                  onMouseEnter={() => speak("Numéro de téléphone")}
                  onMouseLeave={stopSpeaking}
                >
                  Numéro de téléphone
                </Label>
                <Input
                id="phoneNumber"
                type="tel"
                pattern="^0[1-9]\d{8}$"
                placeholder="** ** ** ** **"
                value={phoneNumber}
                onMouseEnter={() => speak("Renseigner votre numéro de téléphone")}
                onMouseLeave={stopSpeaking}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              </div>
              <Label
                onMouseEnter={() => speak("Avez-vous un cancer ?")}
                onMouseLeave={stopSpeaking}
              >
                Avez-vous un cancer ?
              </Label>
              <div className="flex items-center">
                <Checkbox
                  id="hasCancer"
                  checked={hasCancer}
                  onCheckedChange={(checked) => setHasCancer(checked)}
                />
                <Label
                  htmlFor="hasCancer"
                  className="ml-2"
                  onMouseEnter={() => speak("Oui j'ai un cancer")}
                  onMouseLeave={stopSpeaking}
                >
                  Oui
                </Label>
                <Checkbox
                  id="noCancer"
                  checked={!hasCancer}
                  onCheckedChange={(checked) => setHasCancer(!checked)}
                />
                <Label
                  htmlFor="noCancer"
                  className="ml-2"
                  onMouseEnter={() => speak("Non je n'ai pas de cancer")}
                  onMouseLeave={stopSpeaking}
                >
                  Non
                </Label>
              </div>
              {hasCancer && (
                <>
                  <Label
                    onMouseEnter={() => speak("Type de cancer")}
                    onMouseLeave={stopSpeaking}
                  >
                    Type de cancer :
                  </Label>
                  <Select value={cancerType} onValueChange={setCancerType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionnez un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        onMouseEnter={() => speak("J'ai un cancer du Cerveau")}
                        onMouseLeave={stopSpeaking}
                        value="cerveau"
                      >
                        Cancer du cerveau
                      </SelectItem>
                      <SelectItem
                        onMouseEnter={() => speak("J'ai un cancer de la gorge")}
                        onMouseLeave={stopSpeaking}
                        value="gorge"
                      >
                        Cancer de la gorge
                      </SelectItem>
                      <SelectItem
                        onMouseEnter={() => speak("J'ai un cancer du sein")}
                        onMouseLeave={stopSpeaking}
                        value="sein"
                      >
                        Cancer du sein
                      </SelectItem>
                      <SelectItem
                        onMouseEnter={() => speak("J'ai un cancer des poumons")}
                        onMouseLeave={stopSpeaking}
                        value="poumon"
                      >
                        Cancer du poumon
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
              <Label
                onMouseEnter={() => speak("Vaccins reçus")}
                onMouseLeave={stopSpeaking}
              >
                Vaccins reçus :
              </Label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox
                    id="vaccine1"
                    checked={vaccines["HépatiteB"] || false}
                    onCheckedChange={() => handleVaccineChange("HépatiteB")}
                  />
                  <Label
                    htmlFor="vaccine1"
                    className="ml-2"
                    onMouseEnter={() => speak("VACCIN Hépatite B")}
                    onMouseLeave={stopSpeaking}
                  >
                    Hépatite B
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="vaccine2"
                    checked={vaccines["Haemophilus"] || false}
                    onCheckedChange={() => handleVaccineChange("Haemophilus")}
                  />
                  <Label
                    htmlFor="vaccine2"
                    className="ml-2"
                    onMouseEnter={() =>
                      speak("VACCIN Haemophilus influenzae B")
                    }
                    onMouseLeave={stopSpeaking}
                  >
                    Haemophilus influenzae B
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="vaccine3"
                    checked={vaccines["Corona"] || false}
                    onCheckedChange={() => handleVaccineChange("Corona")}
                  />
                  <Label
                    htmlFor="vaccine3"
                    className="ml-2"
                    onMouseEnter={() => speak(" VACCIN CoronaVirus COVID-19")}
                    onMouseLeave={stopSpeaking}
                  >
                    CoronaVirus (COVID-19)
                  </Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  onMouseEnter={() => speak("Êtes-vous malentendant ou sourd ?")}
                  onMouseLeave={stopSpeaking}
                >
                  Êtes-vous malentendant ou sourd ?
                </Label>
                <div className="flex items-center">
                  <Checkbox
                    id="isHearingImpaired"
                    checked={isHearingImpaired}
                    onCheckedChange={(checked) => setIsHearingImpaired(checked)}
                  />
                  <Label
                    htmlFor="isHearingImpaired"
                    className="ml-2"
                    onMouseEnter={() => speak("Oui, je suis malentendant ou sourd")}
                    onMouseLeave={stopSpeaking}
                  >
                    Oui
                  </Label>
                </div>
              </div>
              <Button
                onMouseEnter={() => speak("Mettre a jour le profil")}
                onMouseLeave={stopSpeaking}
                type="submit"
                className="w-full"
              >
                Mettre à jour le profil
              </Button>
              <Button
                type="submit"
                onMouseEnter={() => speak("Importer son profil MonEspaceSanté")}
                onMouseLeave={stopSpeaking}
                className="w-full"
              >
                Importé son profil MonEspaceSanté
              </Button>
              {/* bouton retour vers le chatbot */}
              <Button
                type="submit"
                onMouseEnter={() => speak("Retour au chatbot")}
                onMouseLeave={stopSpeaking}
                onClick={() => location.href = "/healbot"}
                className="w-full"
              > Retour au chatbot
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ProfilePage;
