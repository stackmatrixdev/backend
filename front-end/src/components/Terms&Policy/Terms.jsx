import React from "react";
import { ScrollRestoration, useLocation } from "react-router-dom";

const Terms = () => {
  const location = useLocation()

  return (
    <div className={`bg-[#F2F4F7] py-6 ${location.pathname.includes('profile-dashboard')&& "h-[90vh] overflow-auto"}`}>
      <ScrollRestoration />
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Terms & Conditions
          </h1>
        </div>

        {/* Privacy Policy Sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700">
              By accessing and using LearninGPT ("the Service"), you accept and
              agree to be bound by the terms and provision of this agreement.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              2. Description of Service
            </h2>
            <p className="text-gray-700">
              LearninGPT is an AI-powered learning platform that provides
              educational content, quizzes, and personalized learning assistance
              through artificial intelligence.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              3. User Accounts
            </h2>
            <p className="text-gray-700">
              To access certain features of the Service, you must register for
              an account. You are responsible for maintaining the
              confidentiality of your account credentials and for all activities
              that occur under your account.
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              4. Acceptable Use
            </h2>
            <p className="text-gray-700">
              You agree not to use the Service for any unlawful purpose or in
              any way that could damage, disable, overburden, or impair the
              Service.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              5. Intellectual Property
            </h2>
            <p className="text-gray-700">
              The Service and its original content, features, and functionality
              are owned by LearninGPT and are protected by international
              copyright, trademark, patent, trade secret, and other intellectual
              property laws.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              6. Payment Terms
            </h2>
            <p className="text-gray-700">
              Certain features of the Service may require payment. You agree to
              pay all charges incurred by you or any users of your account and
              credit card at the prices in effect when such charges are
              incurred.
            </p>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              7. Termination
            </h2>
            <p className="text-gray-700">
              We may terminate or suspend your account and bar access to the
              Service immediately, without prior notice or liability, under our
              sole discretion, for any reason whatsoever.
            </p>
          </div>

          {/* Section 8 */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              8. Contact Information{" "}
            </h2>
            <p className="text-gray-700">
              If you have any questions about these Terms of Service, please
              contact us at legal@learningpt.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
