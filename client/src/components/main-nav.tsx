import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function MainNav() {
  return (
    <nav className="p-4 bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <a className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 hover:opacity-80 transition-opacity">
            Trump Tweet Analyzer
          </a>
        </Link>
        <div className="space-x-4">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-gray-700 hover:text-white">Home</Button>
          </Link>
          <Link href="/tweets">
            <Button variant="ghost" className="text-white hover:bg-gray-700 hover:text-white">Trump Tweets</Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost" className="text-white hover:bg-gray-700 hover:text-white">About</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
