'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsGithub } from "react-icons/bs";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const queryClient = new QueryClient();

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <ThemeProvider defaultTheme="system">
            <QueryClientProvider client={queryClient}>
                <div className="min-h-screen flex flex-col">
                    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
                        <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between h-16">
                                <div className="flex items-center">
                                    <Link href="/" className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                                            <span className="text-primary-foreground font-bold text-xl">S</span>
                                        </div>
                                        <span className="font-semibold text-lg hidden sm:block">Study Visualizer Assignment</span>
                                    </Link>
                                </div>
                                <nav className="hidden md:flex items-center space-x-4">
                                    <Link
                                        href="/"
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === '/'
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-foreground/70 hover:text-primary'
                                            }`}
                                    >
                                        Dashboard
                                    </Link>
                                </nav>
                                <div className="flex items-center gap-4">
                                    <ThemeToggle />
                                    <Link href={'https://github.com/Kaushik1766'} target="_blank" className="flex items-center gap-2 hover:text-primary cursor-pointer">
                                        <span className="hidden sm:block">Kaushik Saha</span>
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                            <BsGithub className="w-8 h-8" />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="flex-grow">
                        {children}
                    </main>

                    <footer className="bg-card border-t border-border py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex flex-col md:flex-row justify-between items-center">
                                <div className="mb-4 md:mb-0">
                                    <p className="text-sm text-foreground/70"> Created by Kaushik Saha
                                    </p>
                                </div>
                                <div className="flex space-x-6">
                                    <a href="https://github.com/Kaushik1766" target="_blank" className="text-foreground/70 hover:text-primary">
                                        Github
                                    </a>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ThemeProvider>
    );
}