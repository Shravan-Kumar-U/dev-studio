import React from 'react';
import { Diamond, Lightbulb, Clock, Coins } from 'lucide-react';

const AboutSection = () => {
  const CLOUDINARY_ABOUT_URL = "https://res.cloudinary.com/dopaqdvhd/image/upload/v1789292944/6ee1c4d1-e264-4e88-a175-486565634894.png";

  return (
    <div id="about" className="bg-[var(--bg-color)] py-16 lg:py-24 border-b border-[var(--border-color)] overflow-hidden">
      <div className="w-full px-6 lg:px-16 2xl:px-32 mx-auto">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 xl:gap-24 items-center">
          <div className="mb-12 lg:mb-0">
            <p className="text-sm font-bold text-[var(--color-primary)] tracking-widest uppercase mb-3">About</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--text-color)] mb-6 leading-tight">About <span className="text-[var(--color-primary)]">DEV STUDIO</span></h2>
            <p className="text-lg md:text-xl text-[var(--text-muted)] font-medium mb-4">Turning ideas into reality with high-quality 3D models.</p>
            <p className="text-base md:text-lg text-[var(--text-muted)] mb-10 leading-relaxed">At DEV STUDIO, we create detailed and meaningful 3D models that bring your ideas, faith and creativity to life. From Christian items to collectibles, home decor and custom designs, our goal is to make 3D printing simple and inspiring for everyone.</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-10">
              <div className="flex flex-col"><Diamond size={32} className="text-[var(--color-primary)] mb-3" /><h4 className="text-[var(--text-color)] font-bold text-lg mb-1">Premium Quality</h4><p className="text-[var(--text-muted)] text-sm">Clean, detailed and durable prints.</p></div>
              <div className="flex flex-col"><Lightbulb size={32} className="text-[var(--color-primary)] mb-3" /><h4 className="text-[var(--text-color)] font-bold text-lg mb-1">Creative Designs</h4><p className="text-[var(--text-muted)] text-sm">Your ideas, our expertise.</p></div>
              <div className="flex flex-col"><Clock size={32} className="text-[var(--color-primary)] mb-3" /><h4 className="text-[var(--text-color)] font-bold text-lg mb-1">Fast Turnaround</h4><p className="text-[var(--text-muted)] text-sm">On-time delivery, always.</p></div>
              <div className="flex flex-col"><Coins size={32} className="text-[var(--color-primary)] mb-3" /><h4 className="text-[var(--text-color)] font-bold text-lg mb-1">Affordable Pricing</h4><p className="text-[var(--text-muted)] text-sm">Great quality, at fair prices.</p></div>
            </div>
          </div>
          <div className="relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl group border border-[var(--border-color)]/20">
            <img src={CLOUDINARY_ABOUT_URL} alt="Dev Studio Vision" className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end lg:justify-center">
              <div className="max-w-sm">
                <p className="text-[var(--color-primary)] font-bold tracking-widest text-sm uppercase mb-2">Our Vision</p>
                <h3 className="text-white text-3xl md:text-4xl font-extrabold mb-4 leading-tight">More Than <br/> Just Models</h3>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">We create 3D models that inspire, connect and bring imagination to life.</p>
              </div>
            </div>
            <div className="absolute top-12 right-12 md:top-20 md:right-16 text-white font-serif italic text-2xl md:text-3xl rotate-12 drop-shadow-lg opacity-90 text-right leading-tight hidden sm:block">"Ideas<br/>Design<br/>Print<br/>Inspire"</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;