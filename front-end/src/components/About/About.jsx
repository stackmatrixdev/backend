import team1 from "../../assets/images/team1.png";
import team2 from "../../assets/images/team2.png";
import team3 from "../../assets/images/team3.png";
import inno from "../../assets/images/logo/inno.png";
import access from "../../assets/images/logo/access.png";
import personal from "../../assets/images/logo/personal.png";
import excellence from "../../assets/images/logo/excellence.png";
import about from "../../assets/images/aboutPage.png";
import Button from "../Shared/Button";
export default function About() {
  const teamMembers = [
    {
      name: "Name",
      role: "CEO & Co-founder",
      description:
        "Former educator with 15 years of experience in curriculum design",
      img: team1,
    },
    {
      name: "Name",
      role: "CTO & Co-founder",
      description:
        "A researcher specializing in natural language processing and machine learning",
      img: team2,
    },
    {
      name: "Name",
      role: "Head of Product",
      description:
        "UX designer passionate about creating intuitive learning experiences",
      img: team3,
    },
  ];
  return (
    <div className="min-h-screen bg-[#F2F4F7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About LearninGPT
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We're revolutionizing education by combining artificial intelligence
            with personalized learning to help students achieve their full
            potential.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left side - Empty image placeholder */}
          <div className="bg-gray-200 rounded-lg flex items-center justify-center">
            <img src={about} alt="" />
          </div>

          {/* Right side - Mission content */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-gray-600 mb-4">
              Our mission is to make quality higher education personalized,
              scalable, and accessible to everyone. We believe that learning
              should be tailored to each individual's pace and learning style,
              empowering students to achieve excellence.
            </p>
            <p className="text-gray-600 mb-6">
              We're committed to creating personalized learning experiences that
              are accessible to all learners worldwide, regardless of their
              background or starting point.
            </p>
            <div>
              <Button rounded="md" padding="py-2 px-4">
                Join Our Mission
              </Button>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Our Values
          </h2>
          <p className="text-gray-600 text-center mb-12">
            The principles that guide everything we do
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Innovation */}
            <div className="bg-[#F3F3F3] border border-gray/50 p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src={inno} alt="" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Innovation
              </h3>
              <p className="text-gray-600 text-sm">
                We embrace cutting-edge AI technology to create groundbreaking
                educational experiences.
              </p>
            </div>

            {/* Accessibility */}
            <div className="bg-[#F3F3F3] border border-gray/50 p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src={access} alt="" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Accessibility
              </h3>
              <p className="text-gray-600 text-sm">
                Quality education should be available to everyone, regardless of
                background or circumstances.
              </p>
            </div>

            {/* Personalization */}
            <div className="bg-[#F3F3F3] border border-gray/50 p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src={personal} alt="" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Personalization
              </h3>
              <p className="text-gray-600 text-sm">
                Every learner is unique, and their educational experience should
                be too.
              </p>
            </div>

            {/* Excellence */}
            <div className="bg-[#F3F3F3] border border-gray/50 p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src={excellence} alt="" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Excellence
              </h3>
              <p className="text-gray-600 text-sm">
                We strive for the highest standards in everything we do, from
                content to user experience.
              </p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="mb-10 rounded-lg py-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Our Story
          </h2>
          <div className="max-w-7xl mx-auto space-y-6 text-gray-600">
            <p>
              LearninGPT was born from a simple observation: traditional
              education methods weren't keeping pace with how people actually
              learn in the digital age. Our founders, who had backgrounds in
              both education and technology, recognized that artificial
              intelligence could bridge this gap.
            </p>
            <p>
              In 2023, we set out to create a platform that would combine the
              best of human expertise with the power of AI to deliver fully
              personalized learning experiences. We started with a simple
              question: "What if every student had access to a personal tutor
              that understood their unique way of learning style?"
            </p>
            <p>
              Today, LearninGPT serves thousands of students worldwide, helping
              them master new skills through interactive, personalized lessons.
              Our AI adapts to each learner's pace and style, creating truly
              customized learning paths. But we're just getting started.
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our Team
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The passionate individuals behind LearninGPT
          </p>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray/50 p-8 text-center hover:shadow-md transition-shadow duration-300"
            >
              {/* Profile Image Placeholder */}
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                <img src={member.img} alt="" />
              </div>

              {/* Member Info */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {member.name}
              </h3>
              <p className="text-primary font-medium mb-4">{member.role}</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
