import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function MainNav() {
  return (
    <nav className="p-4 bg-gray-100 text-gray-900 shadow-md sticky top-0 z-50 dark:bg-gray-900 dark:text-gray-100">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <a className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-800 hover:opacity-80 transition-opacity dark:from-blue-300 dark:to-indigo-400">
            트럼프 트윗 분석 Intelligence
          </a>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/" asChild>
            <Button variant="link" className="text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400">Home</Button>
          </Link>
          <Link href="/tweets" asChild>
            <Button variant="link" className="text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400">Trump Tweets</Button>
          </Link>
          <Link href="/about" asChild>
            <Button variant="link" className="text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400">About</Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
