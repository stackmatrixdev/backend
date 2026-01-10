import ai1 from "../../assets/images/ai1.png";
import ai2 from "../../assets/images/ai2.png";
import ai3 from "../../assets/images/ai3.png";
const StatsSection = () => {
  const stats = [
    {
      number: ai1,
      label: "Learn smarter with AI-powered coaching",
    },
    {
      number: ai2,
      label: "Build real skills through quizzes and smart feedback",
    },
    { number: ai3, label: "Your personal AI tutor for exam success" },
  ];

  return (
    <section className="py-16 mt-10 md:mt-16 xl:mt-28 bg-[#0074C4] relative">
      <div
        aria-hidden="true"
        className="
            pointer-events-none absolute
            top-0 sm:top-10 lg:-top-28
            left-0 sm:left-0 lg:left-0
            w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] lg:w-[320px] lg:h-[320px]
            rounded-full border-[10px] sm:border-[12px] lg:border-[36px]
            border-circle -z-10
          
          "
      />
      <div className="w-10/12 mx-auto px-3 lg:px-6">
        <div className="grid lg:grid-cols-3 gap-8 text-center text-white ">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-4 ">
              <img
                src={stat.number}
                alt={stat.label}
                className="mx-auto mb-4"
              />
              <p className="text-white font-bold lg:text-xl">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
