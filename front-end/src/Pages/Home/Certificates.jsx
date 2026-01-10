import certificateImg from "../../assets/images/certificate.png"

export default function Certificates() {
  const certificates = [
    {
      id: 1,
      title: "Immigration & Language Preparation",
      status: "Your certificate is now available for download.",
    },
    {
      id: 2,
      title: "Immigration & Language Preparation",
      status: "Your certificate is now available for download.",
    },
    {
      id: 3,
      title: "Immigration & Language Preparation",
      status: "Your certificate is now available for download.",
    },
  ]

  return (
    <div className="h-[91vh] overflow-auto bg-[#F4F8FD] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your complete course and certificate</h1>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <div key={certificate.id} className="bg-white rounded-lg shadow-sm border border-gray/50 p-6">
              {/* Certificate Image Placeholder */}
              <div className="w-full bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <img src={certificateImg} alt="" />
              </div>

              {/* Certificate Details */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{certificate.title}</h3>
                <p className="text-gray text-sm mb-4">{certificate.status}</p>

                {/* Download Button */}
                <button className="w-2/3 bg-primary text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                  Download Certificate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
