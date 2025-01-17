import { Link } from "react-router-dom";
import { Facebook, Twitter, Rss, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t-2 border-purple-900 bg-gradient-to-r from-black via-purple-900 to-black py-12">
      <div className="max-w-6xl mx-auto sm:px-6">
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-5 gap-24 mb-8">
          <div className="md:col-span-1">
            <Link to="/home" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                MindStream
              </span>
            </Link>
            <p className="mt-2 text-sm text-white">Unleash Your Thoughts</p>
          </div>
          <div>
            <h3 className="text-md font-semibold mb-4 text-white">Explore</h3>
            <ul className="space-y-2 text-sm text-white">
              <li>
                <Link
                  to="/blogs"
                  className="hover:text-purple-400 transition-colors"
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  to="/authors"
                  className="hover:text-purple-400 transition-colors"
                >
                  Authors
                </Link>
              </li>
              <li>
                <Link
                  to="/blogs"
                  className="hover:text-purple-400 transition-colors"
                >
                  Categories
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-md font-semibold mb-4 text-white">Terms & Conditions</h3>
            <ul className="space-y-2 text-sm text-white">
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-purple-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-services"
                  className="hover:text-purple-400 transition-colors"
                >
                  Terms of Services
                </Link>
              </li>
              <li>
                <Link
                  to="/content-policy"
                  className="hover:text-purple-400 transition-colors"
                >
                  Content Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-md font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-2 text-sm text-white ">
              <li>
                <Link
                  to="/under-development"
                  className="hover:text-purple-400 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/under-development"
                  className="hover:text-purple-400 transition-colors"
                >
                  Live Support
                </Link>
              </li>
              <li>
                <Link
                  to="/under-development"
                  className="hover:text-purple-400 transition-colors"
                >
                  Submit a Ticket
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-md font-semibold mb-4 text-white">About Us</h3>
            <ul className="space-y-2 text-sm text-white">
              <li>
                <Link
                  to="/our-story"
                  className="hover:text-purple-400 transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  to="/authors"
                  className="hover:text-purple-400 transition-colors"
                >
                  Team
                </Link>
              </li>
              <li>
                <Link
                  to="/under-development"
                  className="hover:text-purple-400 transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a
              to="#"
              className="text-white hover:text-purple-400 transition-colors"
            >
              <Facebook size={20} />
            </a>
            <a
              to="#"
              className="text-white hover:text-purple-400 transition-colors"
            >
              <Twitter size={20} />
            </a>
            <a
              to="#"
              className="text-white hover:text-purple-400 transition-colors"
            >
              <Rss size={20} />
            </a>
            <a
              to="#"
              className="text-white hover:text-purple-400 transition-colors"
            >
              <Instagram size={20} />
            </a>
            <a
              to="#"
              className="text-white hover:text-purple-400 transition-colors"
            >
              <Linkedin size={20} />
            </a>
          </div>
          <p className="text-sm text-white">
            &copy; {new Date().getFullYear()} MindStream. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
