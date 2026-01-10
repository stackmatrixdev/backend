import React from "react";
import { ScrollRestoration, useLocation } from "react-router-dom";

const Privacy = () => {
  const location = useLocation()

  return (
    <div
      className={`bg-[#F2F4F7] py-6 ${
        location.pathname.includes("profile-dashboard") &&
        "h-[91vh] overflow-auto"
      }`}
    >
      <ScrollRestoration />

      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        </div>

        {/* Last Updated */}
        {/* <div className="mb-8">
          <p className="text-gray-600 text-sm">
            Last Updated: January 19, 2025
          </p>
        </div> */}

        {/* Privacy Policy Sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-700">
              We Collect Information You Provide Directly To Us, Such As When
              You Create An Account, Use Our Services, Or Contact Us For
              Support.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700">
              We Use The Information We Collect To Provide, Maintain, And
              Improve Our Services, Process Transactions, And Communicate With
              You.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              3. Information Sharing
            </h2>
            <p className="text-gray-700">
              We Do Not Sell, Trade, Or Otherwise Transfer Your Personal
              Information To Third Parties Without Your Consent, Except As
              Described In This Policy.
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              4. Data Security
            </h2>
            <p className="text-gray-700">
              We Implement Appropriate Security Measures To Protect Your
              Personal Information Against Unauthorized Access, Alteration,
              Disclosure, Or Destruction.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              5. Cookies And Tracking
            </h2>
            <p className="text-gray-700">
              We Use Cookies And Similar Tracking Technologies To Enhance Your
              Experience On Our Platform And Analyze Usage Patterns.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              6. Your Rights
            </h2>
            <p className="text-gray-700">
              You Have The Right To Access, Update, Or Delete Your Personal
              Information. You May Also Opt Out Of Certain Communications From
              Us.
            </p>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              7. Contact Us
            </h2>
            <p className="text-gray-700">
              If You Have Any Questions About This Privacy Policy, Please
              Contact Us At Privacy@learningpt.Com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
