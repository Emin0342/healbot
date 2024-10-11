"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut, getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { HeartPulse } from "lucide-react";

const auth = getAuth();

export function TopNavBarBot() {
    const router = useRouter();

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                router.push("/");
            })
            .catch((error) => {
                console.error("Erreur lors de la déconnexion:", error);
            });
    };

    return (
        <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-gray-950/90 h-16">
            <div className="w-full mx-auto px-4">
                <div className="flex justify-between h-16 items-center">
                    <Link className="flex items-center justify-center" href="./">
                        <HeartPulse className="h-6 w-6 text-primary" />
                        <span className="ml-2 text-xl font-bold text-primary">HealBot</span>
                    </Link>
                    <div className="flex space-x-4">
                        <Link href="/profile" passHref>
                            <Button variant="outline" className="text-sm font-medium">
                                Profile
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            className="text-sm font-medium"
                            onClick={handleSignOut}
                        >
                            Déconnexion
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default TopNavBarBot;
