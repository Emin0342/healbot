"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { auth } from "@/app/firebase";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
// import { TopNavBar } from "@/components/topnavbar"

export default function Component() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Utilisateur connecté avec succès", email);
      location.href = "/healbot";
    } catch (error) {
      console.error("Erreur lors de la connexion de l'utilisateur", error);
    }
  };

  return (
    <>
      {/* <TopNavBar></TopNavBar> */}
      <div className="bg-gray-100 dark:bg-gray-900 w-full h-full">
        <div className="flex items-center justify-center h-screen">
          <Card className="max-w-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
              <CardDescription>
                Entrez votre email et votre mot de passe pour vous connecter à
                votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
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
                    placeholder="*********"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Connexion
                </Button>
              </form>
              <Link href="/auth/register">
              <Button className="w-full pt-2" variant={"secondary"}>
                Pas de compte ? S&apos;inscrire
              </Button>
            </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
