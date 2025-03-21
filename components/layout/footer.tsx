import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Mail,
  GraduationCap
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-blue-50/50 dark:bg-gray-900">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 dark:bg-blue-500 text-white p-1.5 rounded-full">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-300">Trajectory AI</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              Empowering your career journey with AI-driven insights and personalized guidance.
            </p>

            <div className="flex space-x-3">
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/50" asChild>
                <Link href="https://twitter.com" target="_blank" rel="noreferrer">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/50" asChild>
                <Link href="https://github.com" target="_blank" rel="noreferrer">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/50" asChild>
                <Link href="https://linkedin.com" target="_blank" rel="noreferrer">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/50" asChild>
                <Link href="https://instagram.com" target="_blank" rel="noreferrer">
                  <Instagram className="h-4 w-4" />
                  <span className="sr-only">Instagram</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/market-insights" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  Market Insights
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  Career Blog
                </Link>
              </li>
              <li>
                <Link href="/roadmaps" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  Career Roadmaps
                </Link>
              </li>
              <li>
                <Link href="/chatbot" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  AI Career Assistant
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Stay Updated</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Subscribe to our newsletter for career tips and updates.
            </p>
            <form className="flex flex-col gap-2">
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input type="email" placeholder="Email" className="border-blue-200 focus:border-blue-500 dark:border-blue-900 dark:focus:border-blue-600" />
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600">Subscribe</Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center border-t border-blue-100 dark:border-blue-900/50 mt-12 pt-8">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            &copy; {new Date().getFullYear()} Trajectory AI. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/terms" className="text-xs text-gray-500 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-xs text-gray-500 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 