import { Download } from "lucide-react";
import certificate from "../../assets/images/certificate.png";
const CourseCompletionCertificate = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-7xl w-full bg-white rounded-lg shadow-lg p-12">
        {/* Main Content */}
        <div className="text-center mb-12">
         
          <h2 className="text-2xl font-bold text-[#505050] mb-8">
                Well done! You've successfully completed the <br /> Immigration & Language Preparation Course!
          </h2>

        </div>
          <div className="flex justify-start mb-4">
            <span className="text-2xl text-[#676767] font-semibold">🎉 You Did It! 🎉</span>
          </div>

        <div className="grid md:grid-cols-2 gap-4 items-center">
          {/* Left side - Text content */}
          <div className="space-y-4 text-[#676767] text-justify">
            <p>
              We are thrilled to congratulate you on successfully completing the
              Immigration & Language Preparation Course. This accomplishment is
              a significant step toward achieving your international goals,
              whether you're planning to study, work, or settle abroad.
            </p>
            <p>
              Through this course, you've gained the knowledge and skills needed
              to navigate the complexities of immigration and enhanced your
              language proficiency. You've learned how to prepare for visa
              applications, master language proficiency tests, and integrate
              into your new environment with confidence.
            </p>
          </div>

          {/* Right side - Certificate */}
          <div className="flex justify-center">
            <img className="w-96" src={certificate} alt="" />
          </div>
          {/* <div className="flex justify-center">
            <div className="bg-white border-2 border-orange-200 rounded-lg p-6 shadow-md max-w-sm w-full">
              <div className="text-center">
                <div className="mb-4">
                  <div className="text-orange-600 font-bold text-sm mb-2">
                    LEARNINGPT
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    CERTIFICATE
                  </h3>
                  <div className="text-xs text-gray-600 mb-4">
                    OF ACHIEVEMENT
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-gray-600 mb-2">
                    THIS CERTIFICATE IS AWARDED TO
                  </div>
                  <div className="text-xl font-bold text-gray-900 mb-4">
                    John Doe
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-gray-600 mb-2">
                    FOR SUCCESSFULLY COMPLETING
                  </div>
                  <div className="text-sm font-semibold text-gray-800 leading-tight">
                    IMMIGRATION & LANGUAGE PREPARATION
                  </div>
                </div>

                <div className="flex justify-between items-end mt-6 pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    <div>Date:</div>
                    <div>---</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    <div>Signature</div>
                    <div>---</div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>

        {/* Download section */}
        <div className="text-center mt-12">
          <p className="text-[#676767] text-2xl font-semibold mb-6">
            Your certificate is now available for download.
          </p>

          <button className="bg-primary text-white font-medium px-8 py-3 rounded-lg transition-colors flex items-center mx-auto">
            <Download className="w-4 h-4 mr-2" />
            Download Certificate
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCompletionCertificate;
