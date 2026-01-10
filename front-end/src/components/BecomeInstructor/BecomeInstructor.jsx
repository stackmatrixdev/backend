import icon from "../../assets/images/thunder.png";
import become from "../../assets/images/become.png";
import Button from "../Shared/Button";
import { Link } from "react-router-dom";
const BecomeInstructor = () => {
  return (
    <section className="py-8 md:py-16 z-50 relative">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 justify-center items-center max-w-6xl mx-auto">
          {/* Image */}
          <div className="h-full w-full">
            <img src={become} className="ml-auto h-full w-full" alt="" />
          </div>

          {/* Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Header Badge */}
            {/* Badge */}
            <div className="flex justify-start mb-6">
              <div className="inline-flex items-center space-x-2 bg-primary/10 border border-blue-100 backdrop-blur-sm rounded-full pl-1 pr-3 py-1 text-sm font-medium text-black">
                <div>
                  <img src={icon} alt="badge" />
                </div>
                <span>Let’s Join With Us</span>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 leading-tight">
              Become an Instructor and <br /> Join With Us
            </h2>

            <p className="text-gray leading-relaxed text-sm md:text-base">
              This includes offering personalized feedback, fostering a sense of
              community through discussion forums and group projects, and
              providing continuous support to address challenges and improve.
            </p>
            <Link to={"/form"}>
              <div className="mt-8">
                <Button rounded="lg" padding="px-4 py-2">
                  Start Teaching Today
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeInstructor;
