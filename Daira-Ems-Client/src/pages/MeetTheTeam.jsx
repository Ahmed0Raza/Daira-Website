import React from 'react';
import ahmed_raza from '../images/something.jpeg';
import umer from '../images/umer.jpeg';
import bilal from '../images/bilal_tariq.jpg';
import mughees from '../images/mughees_ismail.png';

const MeetTheTeam = () => {
  const teamMembers = [
    {
      name: 'Ahmed Raza',
      role: 'Software Engineer',
      image: ahmed_raza,
      github: 'https://github.com/Ahmed0Raza',
      website: 'https://portfolioo-one-nu.vercel.app/'
    },
    {
      name: 'Umer Waseem',
      role: 'Software Engineer',
      image: umer,
      github: 'https://github.com/umerwaseem4',
      website: 'https://umer-waseem.vercel.app',
    },
    {
      name: 'Bilal Tariq',
      role: 'Software Engineer',
      image: bilal,
      website: 'https://ibilaltariq.netlify.app/',
      github: 'https://github.com/bilaltariq360',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-purple-900 to-neutral-900 py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto mt-8 sm:mt-12 md:mt-20 relative">
        {/* Animated background elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        
        <div className="text-center mb-12 sm:mb-16 md:mb-20 relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-3 sm:mb-4 tracking-tight">
            The Monochrome Minds
          </h1>
          <div className="h-1 w-24 md:w-32 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-4 rounded-full"></div>
          <p className="text-neutral-300 text-base sm:text-lg max-w-2xl mx-auto px-2">
            Developing Feelings and Legacy since DAIRA'2024
          </p>
        </div>

        {/* Mentor Section */}
        <div className="flex justify-center mb-16 sm:mb-20 md:mb-32">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
            <div className="bg-gradient-to-br from-neutral-800/70 to-purple-900/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105 border border-purple-500/20">
              <div className="flex justify-center -mt-10 sm:-mt-16">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-70"></div>
                  <img
                    src={mughees}
                    className="w-52 h-52 mt-20 rounded-full object-cover shadow-xl relative z-10 border-4 border-purple-800"
                    alt="Mentor"
                  />
                </div>
              </div>
              <div className="p-6 sm:p-8 text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-1 sm:mb-2">
                  Mr. Mughees Ismail
                </h3>
                <div className="h-0.5 w-12 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto my-3"></div>
                <p className="text-neutral-300 text-xs sm:text-sm uppercase tracking-widest">
                  Mentor
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {teamMembers.map((member, index) => (
            <div key={index} className="group">
              <div className="relative bg-gradient-to-br from-neutral-800/70 to-purple-900/70 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 h-full flex flex-col border border-purple-500/20 shadow-lg hover:shadow-purple-500/20">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                
                {/* Original aspect ratio image */}
                <div className="aspect-w-4 aspect-h-3 flex-shrink-0 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10"></div>
                  <img
                    src={member.image}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={member.name}
                    style={{ objectPosition: 'center center' }}
                  />
                </div>
                
                <div className="p-5 sm:p-6 relative z-10 flex-grow flex flex-col">
                  <h3 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-1 sm:mb-2">
                    {member.name}
                  </h3>
                  <div className="h-0.5 w-10 bg-gradient-to-r from-purple-500 to-pink-500 my-2"></div>
                  <p className="text-neutral-300 text-xs sm:text-sm uppercase tracking-widest mb-4">
                    {member.role}
                  </p>
                  <div className="flex gap-4 mt-auto">
                    <a
                      href={member.github}
                      className="text-neutral-400 hover:text-purple-400 transition-all duration-300 transform hover:scale-110"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name}'s GitHub`}
                    >
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                    {member.website && (
                      <a
                        href={member.website}
                        className="text-neutral-400 hover:text-purple-400 transition-all duration-300 transform hover:scale-110"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name}'s Website`}
                      >
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 16.057v-3.057h2.994c-.059 1.143-.212 2.24-.456 3.279-.823-.12-1.674-.188-2.538-.222zm1.957 2.162c-.499 1.33-1.159 2.497-1.957 3.456v-3.62c.666.028 1.319.081 1.957.164zm-1.957-7.219v-3.015c.868-.034 1.721-.103 2.548-.224.238 1.027.389 2.111.446 3.239h-2.994zm0-5.014v-3.661c.806.969 1.471 2.138 1.971 3.469-.642.084-1.3.137-1.971.192zm2.703-3.267c1.237.496 2.354 1.228 3.29 2.146-.642.234-1.311.442-1.989.614-.188-.981-.456-1.905-.783-2.782l-.518.022zm-7.241 13.56c-.244-1.039-.396-2.136-.453-3.279h2.994v3.057c-.865.034-1.714.102-2.541.222zm2.541-5.123h-2.994c.059-1.128.21-2.212.453-3.239.825.12 1.674.189 2.541.224v2.015zm-2.994-5.239c.238-1.027.389-2.111.446-3.239h2.994v3.015c-.868.034-1.721.103-2.548.224zm3.435-3.456c-.5-1.328-1.16-2.498-1.958-3.456v3.62c.638-.084 1.29-.137 1.958-.164zm-1.958 12.162v3.661c-.808-.969-1.471-2.138-1.971-3.469.642-.084 1.3-.137 1.971-.192zm-2.703 3.268c-1.237-.496-2.354-1.228-3.29-2.146.642-.234 1.311-.442 1.989-.614.188.981.456 1.905.783 2.782l.518-.022z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Add this style for the animated background blobs */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: scale(1) translate(0px, 0px); }
          33% { transform: scale(1.1) translate(30px, -20px); }
          66% { transform: scale(0.9) translate(-20px, 20px); }
          100% { transform: scale(1) translate(0px, 0px); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default MeetTheTeam;