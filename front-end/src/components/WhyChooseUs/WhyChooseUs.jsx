import info from "../../assets/images/icon/info.png";
import tic from "../../assets/images/tic.png";
import choose1 from "../../assets/images/choose1.png";
import choose2 from "../../assets/images/choose2.png";
import choose3 from "../../assets/images/choose3.png";
import choose1w from "../../assets/images/choose1w.png";
import choose2w from "../../assets/images/choose2w.png";
import choose3w from "../../assets/images/choose3w.png";
import lines from "../../assets/images/lines.png";
const WhyChooseUs = () => {
  const features = [
    {
      title: "AI-Powered Learning Experience",
      description:
        "Get personalized quizzes and chat support based on your needs",
      position: "left",
      image: choose1,
      imagew: choose1w,
    },
    {
      title: "Learn by Doing",
      description: "Practice with smart questions and instant explanations",
      position: "center",
      image: choose2,
      long: true,
      imagew: choose2w,
    },
    {
      title: "One-Time Payment",
      description: "No subscription fee once you learn anything",
      position: "right",
      image: choose3,
      imagew: choose3w,
    },
  ];

  return (
    <section className="pb-10 md:pb-16 lg:py-28 bg-gray-50 bg-[#F9FAFB]">
      <div className="lg:w-10/12 mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-6 md:mb-12">
          <div className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-full text-sm mb-4 gap-3">
            <img src={info} alt="" />
            Reason to Choose
          </div>
          <h2 className="text-xl md:text-3xl font-bold text-gray-800">
            Why Choose Us!
          </h2>
        </div>
        <img className="mx-auto hidden md:block" src={lines} alt="" />
        {/* Timeline Container */}
        <div className="relative mx-auto">
          {/* Timeline Points and Content */}
          <div className="grid md:grid-cols-3 gap-4 lg:gap-8 relative w-full 2xl:w-9/12 mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="relative">
                {/* Content Card */}
                <div
                  className={`${
                    feature.long ? "md:mt-[4px]" : "md:-mt-[70px]"
                  } flex-grow`}
                >
                  <div className="bg-white hover:bg-primary hover:text-white flex items-center rounded-xl p-3 lg:p-6 shadow-xl relative gap-2 justify-between group">
                    <div className="flex gap-2">
                      {/* Green Dot Indicator */}
                      <img className="mt-1 w-4 h-4" src={tic} alt="" />
                      <div className="flex flex-col items-start">
                        <h3 className="font-semibold leading-6 mb-2 text-gray-800">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>

                    <div className="relative w-24 h-24 hidden md:block lg:w-24 z-10">
                      <img
                        src={feature.image}
                        className="absolute inset-0 w-16 md:w-auto h-16 md:h-auto object-contain transition-opacity duration-300 group-hover:opacity-0"
                        alt=""
                      />
                      <img
                        src={feature.imagew}
                        className="absolute inset-0 w-16 md:w-auto h-16 md:h-auto object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
