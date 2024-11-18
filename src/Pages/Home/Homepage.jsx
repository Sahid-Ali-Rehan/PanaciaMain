import React from 'react';

const Home = () => {
  return (
    <div className="relative min-h-screen">
      {/* Fullscreen Video Background */}
      <video
  className="absolute top-0 left-0 w-full h-full object-cover -z-10"
  autoPlay
  loop
  muted
>
  <source src="/Videos/Home.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>


      {/* Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-6xl font-bold text-white drop-shadow-lg">
          <span className="bg-gradient-to-r from-gold to-white bg-clip-text text-transparent">
          Urban Voyage
          </span>
        </h1>
        <p className="mt-4 text-xl text-gray-200">
          Redefining Luxury. Experience Couture Like Never Before.
        </p>
        <button className="mt-8 px-8 py-4 text-lg font-semibold text-white bg-black/70 rounded-lg hover:bg-black/90 transition">
          Explore Now
        </button>
      </div>
    </div>
  );
};

export default Home;
