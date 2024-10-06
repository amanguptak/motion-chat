import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <div className="">
      {/* Main Container */}
      <div className="w-full max-w-5xl p-8 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg flex flex-col lg:flex-row justify-between items-center space-y-8 lg:space-y-0 lg:space-x-12">
        
        {/* About Us Section */}
        <div className="w-full lg:w-1/2 text-center lg:text-left text-white">
          <h2 className="text-5xl font-extrabold mb-6">Welcome to Motion Otaku Chat</h2>
          <p className="text-white text-lg leading-relaxed">
          Motion Otaku Chat is your ultimate hub for anime enthusiasts! Explore your favorite anime series, movies, and more, while connecting with fellow otakus. Whether you want to discuss the latest episodes or theories, our platform provides the perfect space for all anime-related conversations.
          </p>
        </div>
        
        {/* Image Section */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <Image
            src="https://herobot.app/wp-content/uploads/2022/11/11-Reasons-Why-A-Chat-Application-Is-Great-For-Business_1.jpg"
            alt="Motion Chat Illustration"
            className="rounded-lg shadow-lg"
            width={500}
            height={350}
          />
        </div>
      </div>

      {/* Get Started Button */}
      <div className="mt-9">
        <Link href="/anime-list" className="bg-yellow-400 text-white font-semibold py-3 px-16 rounded-full shadow-lg hover:bg-yellow-500 hover:scale-105 transition-all duration-300">
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
