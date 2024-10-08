import Link from "next/link"
import { MessageCircle, Brain, HeartPulse, ThumbsUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function PageAccueil() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <HeartPulse className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold text-primary">HealBot</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-xs sm:text-sm">S'inscrire / Se connecter</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href="/register">S'inscrire</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/auth/login">Se connecter</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className=" px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Découvrez HealBot
                </h1>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-primary">
                  Votre Assistant Santé Personnel
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Obtenez des réponses instantanées à vos questions de santé, y compris quoi faire en cas de douleur.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="w-full sm:w-auto">Essayez HealBot maintenant</Button>
                <Button variant="outline" className="w-full sm:w-auto">En savoir plus</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className=" px-4 md:px-6">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl text-center mb-8 md:mb-12">Fonctionnalités</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <MessageCircle className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg sm:text-xl">Disponible 24/7</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm sm:text-base">Obtenez des réponses à vos questions de santé à tout moment. HealBot est toujours là pour vous.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Brain className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg sm:text-xl">Conseils basés sur l'IA</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm sm:text-base">Bénéficiez d'une technologie d'IA avancée qui fournit des conseils de santé précis et personnalisés.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <ThumbsUp className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg sm:text-xl">Facile à utiliser</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm sm:text-base">Interface conversationnelle simple. Posez votre question et obtenez des réponses utiles instantanément.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className=" px-4 md:px-6">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl text-center mb-8 md:mb-12">Ce que disent nos utilisateurs</h2>
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Une expérience incroyable !</CardTitle>
                <CardDescription>Sarah K. - Utilisatrice de HealBot</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base">
                  "J'avais un terrible mal de dos et je ne savais pas quoi faire. HealBot m'a immédiatement conseillé
                  des étirements et m'a indiqué quand consulter un médecin. C'est comme avoir un professionnel de santé dans ma poche !"
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2023 HealBot. Tous droits réservés.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Conditions d'utilisation
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Confidentialité
          </Link>
        </nav>
      </footer>
    </div>
  )
}