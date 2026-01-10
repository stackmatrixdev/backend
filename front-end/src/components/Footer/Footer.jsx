import { Mail, Phone } from "lucide-react";
import logo from "../../assets/images/logo.png";
import facebook from "../../assets/images/icon/facebook.png";
import twitter from "../../assets/images/icon/twitter.png";
import instagram from "../../assets/images/icon/instagram.png";
import call from "../../assets/images/icon/call.png";
import linkedin from "../../assets/images/icon/linkedin.png";
import gmail from "../../assets/images/icon/gmail.png";
import Button from "../Shared/Button";
import { Link } from "react-router-dom";

// import { Phone, Mail, Linkedin, Instagram, Twitter, LinkedinIcon } from 'lucide-react';

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#CEE8FB] to-[#A0D4FB] py-12 text-[#726D6D] z-20 relative">
      <div className="w-10/12 mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6 place-items-start">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img src={logo} className="w-16" alt="" />
              <p className="text-[#011F47] font-bold text-3xl">
                Learnin<span className="text-primary">GPT</span>
              </p>
            </div>

            <p className="text-[#726D6D] text-center text-sm leading-relaxed">
              AI - powered learning platform for <br /> the modern world.
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center text-gray-700 text-sm">
                <img src={call} alt="" />
                <span>(406) 555-0120</span>
              </div>

              <div className="flex items-center text-gray-700 text-sm">
                <img src={gmail} alt="" />
                <span>Georgia.Young@example.com</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-3">
              <a href="#">
                <img src={facebook} alt="" />
              </a>
              <a href="#">
                <img src={linkedin} alt="" />
              </a>
              <a href="#">
                <img src={instagram} alt="" />
              </a>
              <a href="#">
                <img src={twitter} alt="" />
              </a>
            </div>
          </div>
          <div className="col-span-3">
            <div className="flex flex-col items-center justify-center pb-6 space-y-4">
              <h2 className="text-[#011F47] font-semibold text-xl">
                Start learning smarter today.
              </h2>
              <Link to={'/topics'}>
                <div>
                  <Button rounded="lg">Join Now</Button>
                </div>
              </Link>
            </div>
            <div className="flex justify-evenly">
              {/* Platform Section */}
              <div className="flex flex-col items-center justify-start">
                <h3 className="font-semibold text-gray-800 mb-4">Platform</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to={"/topics"}
                      className="text-gray-700 text-sm hover:text-primary transition-colors"
                    >
                      Topics
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/quiz"}
                      className="text-gray-700 text-sm hover:text-primary transition-colors"
                    >
                      Exams
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/dashboard"}
                      className="text-gray-700 text-sm hover:text-primary transition-colors"
                    >
                      AI Assistant
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/pricing"}
                      className="text-gray-700 text-sm hover:text-primary transition-colors"
                    >
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company Section */}
              <div className="flex flex-col items-center justify-start">
                <h3 className="font-semibold text-gray-800 mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to={"/about"}
                      className="text-gray-700 text-sm hover:text-primary transition-colors"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/contact"}
                      className="text-gray-700 text-sm hover:text-primary transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/features"}
                      className="text-gray-700 text-sm hover:text-primary transition-colors"
                    >
                      Features
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal Section & CTA */}
              <div className="flex flex-col items-center justify-start">
                <h3 className="font-semibold text-gray-800 mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to={"/privacy"}
                      className="text-gray-700 text-sm hover:text-primary transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/terms"}
                      className="text-gray-700 text-sm hover:text-primary transition-colors"
                    >
                      Terms Of Service
                    </Link>
                  </li>
                 
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-blue-300 mt-8 pt-6 text-center" >
          <p className="text-gray-600">© All rights reserved LearninGPT 2024</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
