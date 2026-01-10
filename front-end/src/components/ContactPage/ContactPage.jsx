import { useState } from "react";
import Button from "../Shared/Button";
import one from "../../assets/images/oneC.png";
import two from "../../assets/images/twoC.png";
import three from "../../assets/images/threeC.png";
import four from "../../assets/images/fourC.png";
const faqs = [
  {
    question: "How does the AI assistant work?",
    answer:
      "Our AI assistant uses advanced natural language processing to understand your questions and provide personalized explanations and guidance based on your learning progress.",
  },
  {
    question: "How does the AI's three a free trial available?",
    answer:
      "Yes! We offer a 7-day free trial that gives you full access to all features, systems, and AI features. No credit card required to get started.",
  },
  {
    question: "Can I use learninGPT on mobile?",
    answer:
      "Our platform is fully responsive and works great on all devices. We're also working on dedicated mobile apps coming soon.",
  },
  {
    question: "What Subject do you cover",
    answer:
      "We currently offer courses in programming, data science, business, and more. We're constantly adding new subjects based on user demand.",
  },
];
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] py-6 lg:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center lg:mb-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Have questions about LearnerGPT? We'd love to hear from you. Send us
            a <br /> message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-2">
          {/* Contact Form */}
          <div className=" rounded-lg p-4 lg:p-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2 lg:mb-6">
              Send us a message
            </h2>
            <p className="text-gray-600 mb-6">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-6 ">
              <div className="grid md:grid-cols-2 gap-3 lg:gap-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded border border-gray/50"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email *"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded border border-gray/50"
                  />
                </div>
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Your phone number *"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded border border-gray/50"
                />
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder="Your message here"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full resize-none px-4 py-2 rounded border border-gray/50"
                />
              </div>

              <Button type="submit" rounded="md" padding="px-4 py-2 w-full">
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="rounded-lg p-4 lg:p-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 lg:mb-6">
              Contact Information
            </h2>
            <p className="text-gray-600 mb-4">
              Reach out to us through any of these channels. We're here to help!
            </p>

            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center p-2 border border-gray/50 rounded space-x-4 bg-white px-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <img src={one} alt="" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="mb-1">support@learninggpt.com</p>
                  <p className="text-sm text-[#6C6868]">
                    We'll respond within 24 hours
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center p-2 border border-gray/50 rounded space-x-4 bg-white px-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <img src={two} alt="" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                  <p className="mb-1">+1 (555) 123-4567</p>
                  <p className="text-sm text-[#6C6868]">Mon-Fri, 9AM-5PM EST</p>
                </div>
              </div>

              {/* Office */}
              <div className="flex items-center p-2 border border-gray/50 rounded space-x-4 bg-white px-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <img src={three} alt="" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Office</h3>
                  <p className="text-gray-700 mb-1">
                    6391 Elgin St. Celina, Delaware 10299
                  </p>
                  <p className="text-sm text-[#6C6868]">
                    Visit by appointment only
                  </p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-center p-2 border border-gray/50 rounded space-x-4 bg-white px-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <img src={four} alt="" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Business Hours
                  </h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-12">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 my-2 md:my-4">
            Frequently Asked Questions
          </h1>
          <p className="text-[#939393] font-medium lg:text-lg mt-2 lg:mt-6">
            Quick answers to common questions about LearninGPT
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid md:grid-cols-2 gap-2 md:gap-3 lg:gap-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 lg:p-6 border border-gray/50 hover:shadow-md transition-shadow duration-200"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {faq.question}
              </h3>
              <p className="text-[#939393] leading-relaxed text-sm lg:text-base">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
