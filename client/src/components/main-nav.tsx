import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function MainNav() {
  return (
    <nav className="w-full border-b border-border bg-background text-foreground shadow-sm sticky top-0 z-[100]">
      <div className="container mx-auto flex justify-between items-center h-20 px-6">
        <Link href="/">
          <a className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-800 hover:opacity-80 transition-opacity dark:from-blue-300 dark:to-indigo-400">
            TRUMP SIGNAL AI
          </a>
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/" asChild>
            <Button variant="ghost" className="text-lg font-medium text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400 px-4 py-2">Home</Button>
          </Link>
          <Link href="/tweets" asChild>
            <Button variant="ghost" className="text-lg font-medium text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400 px-4 py-2">분석 트윗 모음</Button>
          </Link>
          <Link href="/about" asChild>
            <Button variant="ghost" className="text-lg font-medium text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400 px-4 py-2">About</Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
