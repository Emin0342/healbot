"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function TopNavBar() {

    const returnLoginPage = () => {
        window.location.href = "/auth/login";
    }

    const returnRegisterPage = () => {
        window.location.href = "/auth/register";
    }

    return (
        <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-gray-950/90 h-16">
            <div className="w-full max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16 items-center">
                    <Link href="#" className="flex items-center" prefetch={false}>
                        <span className="sr-only">Acme Inc</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Button size="sm" variant={"outline"} onClick={returnLoginPage}>Connexion</Button>
                        <Button size="sm" onClick={returnRegisterPage}>Inscription</Button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default TopNavBar;
