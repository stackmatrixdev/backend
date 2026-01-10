import { Award, BookOpen, Clock, Trophy, Users } from "lucide-react";
import icon from "../../assets/images/top-course.png";
import dev from "../../assets/images/dev.png";
import marketing from "../../assets/images/marketing.png";
import finance from "../../assets/images/finance.png";
import gym from "../../assets/images/gym.png";
import art from "../../assets/images/art.png";
import Button from "../Shared/Button";
import { Link } from "react-router-dom";

const OnlineQuizzes = () => {
  const quizCategories = [
    { icon: dev, title: "Development", color: "bg-white" },
    { icon: marketing, title: "Business", color: "bg-white" },
    { icon: marketing, title: "Marketing", color: "bg-white" },
    { icon: art, title: "Design", color: "bg-white" },
    { icon: gym, title: "Health & Fitness", color: "bg-white" },
    { icon: finance, title: "Productivity", color: "bg-white" },
  ];

  return (
    <section className="pt-4 md:pt-8 lg:pt-16 w-10/12 mx-auto bg-white">
      <div className=" mx-auto px-6">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-blue-100 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-primary">
            <div>
              <img src={icon} alt="badge" />
            </div>
            <span>Top Course Category</span>
          </div>
        </div>
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-xl md:text-3xl font-bold mb-4 text-gray-800 leading-relaxed">
            Explore <span className="text-primary">40000+</span> New <br />
            Online Quizzes
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mx-auto">
          {quizCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={index}
                className="relative text-center mx-auto rounded-xl hover:bg-primary/50 p-4 md:p-10 hover:text-white overflow-hidden"
              >
                {/* Gradient Light Effect */}
                <div className="absolute -top-10 -left-10 w-28 h-28 bg-gradient-to-tr from-white to-white rounded-full blur-xl z-0"></div>

                {/* Icon Circle */}
                <div
                  className={`${category.color} md:w-[90px] md:h-[90px] h-10 w-10 border mx-auto border-light flex items-center justify-center mb-3 transition-transform cursor-pointer rounded-full relative z-10`}
                >
                  <img src={category.icon} alt={category.title} className="" />
                </div>

                {/* Title */}
                <p className="font-bold text-center text-lg relative z-10">
                  {category.title}
                </p>
              </div>
            );
          })}
        </div>

        <Link to={"/topics"}>
          <div className="text-center mt-8">
            <Button rounded={"lg"} padding="px-6 py-2">
              Explore All Categories
            </Button>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default OnlineQuizzes;
