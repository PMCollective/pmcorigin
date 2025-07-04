import React from "react";
import { Calendar, Clock, Globe, Users, Star, CheckCircle, Award, BookOpen, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
const courses = [
  {
    title: "AI Product Management Mastery",
    price: "₹19,999",
    originalPrice: "₹29,999",
    description: "Learn AI Product management by building and launching your own AI Product with no-code tools and AI processes.",
    duration: "6 Weeks",
    frequency: "8-10 hrs/week",
    startDate: "June 7, 2025",
    format: "Online",
    enroll: true,
    link: "https://razorpay.me/@pmcollective",
    highlight: true,
    features: [
      "Duration: 6 weeks",
      "Live Weekly Bootcamp & Mentor",
      "Build Your Own AI Product",
      "PM Coalition for AI Solutions",
      "Build PM Framework Tools",
      "AI Product Launch & Deployment"
    ]
  },
  {
    title: "Advanced AI Product Leadership",
    price: "₹29,999",
    originalPrice: "₹39,999",
    description: "Advanced course focused on product leadership and strategy development with real-world applications.",
    duration: "8 Weeks",
    frequency: "10-12 hrs/week",
    startDate: "Coming Soon",
    format: "Online",
    enroll: false,
    link: "#",
    highlight: false,
    features: [
      "Duration: 8 weeks",
      "Advanced AI Analytics",
      "Strategy Development",
      "AI Ethics & Governance",
      "Team Leadership"
    ]
  },
];

const curriculum = [
  {
    title: "Foundations & Idea Clarity",
    topics: [
      "From Idea, choose AI-no-code tools",
      "AI Tool Assessment",
      "User Research & Analysis",
      "Types of PM Roles"
    ]
  },
  {
    title: "Discovery Mastery",
    topics: [
      "Solve your real-time User Story",
      "User Research & UXD",
      "Problem Statement",
      "AI User & Interface Layer",
      "Discovery Sprint Design"
    ]
  },
  {
    title: "Metrics → Strategy",
    topics: [
      "MVP hypothesis review",
      "North Star & Super Star Metrics",
      "Product Strategy Framework",
      "1 Year → OKRs | KPIs",
      "Strategy → Product roadmap"
    ]
  },
  {
    title: "Tech Fluency",
    topics: [
      "Prompt Engineering for PMs",
      "APIs, DBs, prompts",
      "ML & No-code/low",
      "Vector Range, Diagrams for PMs"
    ]
  },
  {
    title: "Brand & Resume Power",
    topics: [
      "PM Portfolio development",
      "Career transitions",
      "Resume & LinkedIn techniques",
      "Job & Interviews as a PM"
    ]
  },
  {
    title: "Interview Bootcamp & Demo Day",
    topics: [
      "Mock interviews",
      "Product design, metrics, optimization",
      "Strategy & behavioral prep",
      "Build demo interviews"
    ]
  }

  
];

export  function Courses() {
  return (
    <div className="min-h-screen bg-slate-50">
      
      <div className="flex items-center mb-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          </div>
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center text-white border rounded-lg">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded-full inline-block mb-4 sm:mb-6 text-xs sm:text-sm font-semibold">
            Course by MAANG
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
            AI Product Management<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>Course
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-yellow-400">
            Build Real AI Products
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto px-4">
            Learn AI Product management by building and launching your own AI experience with no-code tools and AI processes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-10 px-4">
            <a 
  href="https://razorpay.me/@pmcollective"
  target="_blank"
  rel="noopener noreferrer"
  className="w-full sm:w-auto bg-yellow-400 text-slate-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg shadow-yellow-400/30 hover:shadow-xl transition-all duration-300"
>
  Start Now
</a>
            <span className="text-sm sm:text-base opacity-80 text-center">
              ⏱️ Next batch starting June 7
            </span>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-6 sm:mt-10 max-w-4xl mx-auto px-4">
            {[
              { icon: <Calendar size={16} className="sm:w-5 sm:h-5" />, label: "6 Weeks", value: "Duration" },
              { icon: <Clock size={16} className="sm:w-5 sm:h-5" />, label: "8-10 hrs/week", value: "Time Commitment" },
              { icon: <Calendar size={16} className="sm:w-5 sm:h-5" />, label: "June 7, 2025", value: "Start Date" },
              { icon: <Globe size={16} className="sm:w-5 sm:h-5" />, label: "Online", value: "Format" }
            ].map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 lg:p-6 rounded-xl text-center">
                <div className="mb-2 flex justify-center">{stat.icon}</div>
                <div className="font-bold text-sm sm:text-base lg:text-lg">{stat.label}</div>
                <div className="text-xs sm:text-sm opacity-80">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
            Why Choose The PM Collective?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto px-4">
            Build Real AI Products While Learning Product Management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 lg:mb-20">
          {[
            {
              icon: <BookOpen className="w-8 h-8 sm:w-10 sm:h-10" />,
              title: "Build Your Own AI Product",
              description: "Create and launch your own AI product from ideation to deployment using cutting-edge no-code tools."
            },
            {
              icon: <Users className="w-8 h-8 sm:w-10 sm:h-10" />,
              title: "Learn from AI Product Leaders",
              description: "Get mentored by experienced AI product managers from top tech companies and startups."
            },
            {
              icon: <Target className="w-8 h-8 sm:w-10 sm:h-10" />,
              title: "Practical AI PM Skills",
              description: "Master essential skills including prompt engineering, AI ethics, and product strategy."
            },
            {
              icon: <Award className="w-8 h-8 sm:w-10 sm:h-10" />,
              title: "No-Code AI Development",
              description: "Learn to build AI products without coding using cutting-edge tools and platforms."
            },
            {
              icon: <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10" />,
              title: "Small Cohort Size",
              description: "Limited to 10 students for personalized attention and better learning outcomes."
            },
            {
              icon: <Star className="w-8 h-8 sm:w-10 sm:h-10" />,
              title: "Launch Your AI Product",
              description: "Actually ship a working AI product to market with ongoing support and guidance."
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="text-indigo-600 mb-4 sm:mb-5 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Courses Section */}
      <div className="bg-gradient-to-br from-slate-100 to-slate-200 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
              AI Product Management Courses by MAANG Mentors
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 px-4">
              Choose the right program to accelerate your AI product management career
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto">
            {courses.map((course, index) => (
              <div key={index} className={`
                ${course.highlight 
                  ? "bg-gradient-to-br from-blue-600 to-purple-700 text-white" 
                  : "bg-white text-slate-900"}
                rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl relative border
                ${course.highlight ? "border-transparent shadow-indigo-500/25" : "border-slate-200"}
              `}>
                {course.highlight && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-slate-900 px-4 sm:px-6 py-1 sm:py-2 rounded-full font-bold text-xs sm:text-sm">
                    🔥 Most Popular
                  </div>
                )}

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 leading-tight">
                  {course.title}
                </h3>

                <div className="mb-4 sm:mb-5">
                  <span className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${course.highlight ? "text-yellow-400" : "text-indigo-600"}`}>
                    {course.price}
                  </span>
                  {course.originalPrice && (
                    <span className="text-base sm:text-lg lg:text-xl line-through opacity-60 ml-2 sm:ml-3">
                      {course.originalPrice}
                    </span>
                  )}
                </div>

                <p className="text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed opacity-90">
                  {course.description}
                </p>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className={`${course.highlight ? "bg-white/10" : "bg-slate-50"} p-3 sm:p-4 rounded-xl text-center`}>
                    <div className="font-bold text-sm sm:text-base">{course.duration}</div>
                    <div className="text-xs sm:text-sm opacity-80">Duration</div>
                  </div>
                  <div className={`${course.highlight ? "bg-white/10" : "bg-slate-50"} p-3 sm:p-4 rounded-xl text-center`}>
                    <div className="font-bold text-sm sm:text-base">{course.frequency}</div>
                    <div className="text-xs sm:text-sm opacity-80">Per Week</div>
                  </div>
                </div>

                <div className="mb-6 sm:mb-8 space-y-2 sm:space-y-3">
                  {course.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle 
                        size={16} 
                        className={`${course.highlight ? "text-yellow-400" : "text-emerald-500"} mt-0.5 flex-shrink-0 sm:w-5 sm:h-5`} 
                      />
                      <span className="text-sm sm:text-base leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>

                {course.enroll ? (
                  <a
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      block text-center px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105
                      ${course.highlight 
                        ? "bg-yellow-400 text-slate-900 shadow-yellow-400/25" 
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/25"}
                    `}
                  >
                    Enroll Now
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full bg-slate-300 text-slate-500 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Curriculum Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
            Course Curriculum
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 px-4">
            A comprehensive journey to master AI product management through hands-on learning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {curriculum.map((module, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-5 pb-3 border-b-2 border-indigo-600">
                {module.title}
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {module.topics.map((topic, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-700">
                    <span className="text-indigo-600 mt-1 text-lg leading-none">•</span>
                    <span className="leading-relaxed">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <Award className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-400 mx-auto mb-4 sm:mb-6" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            Verifiable Certificate of Accomplishment
          </h2>
          <p className="text-base sm:text-lg lg:text-xl opacity-90 mb-6 sm:mb-10 max-w-3xl mx-auto px-4">
            Upon completing the AI Product Management Fellowship, you'll receive a verifiable digital certificate that enhances your profile and credibility in the industry.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-6 sm:mt-10">
            <div className="text-center">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400 mx-auto mb-3 sm:mb-4" />
              <h4 className="font-bold mb-2 text-base sm:text-lg">Easily Verifiable</h4>
              <p className="opacity-80 text-sm sm:text-base px-2">
                Each certificate comes with a unique verification code
              </p>
            </div>
            <div className="text-center">
              <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mx-auto mb-3 sm:mb-4" />
              <h4 className="font-bold mb-2 text-base sm:text-lg">Industry Expertise</h4>
              <p className="opacity-80 text-sm sm:text-base px-2">
                Recognized by leading companies and industry professionals
              </p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mx-auto mb-3 sm:mb-4" />
              <h4 className="font-bold mb-2 text-base sm:text-lg">Career Advancement</h4>
              <p className="opacity-80 text-sm sm:text-base px-2">
                Add credibility to your resume and LinkedIn profile
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}