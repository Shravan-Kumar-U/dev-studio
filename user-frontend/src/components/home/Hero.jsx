import React from 'react';
import { ArrowRight, Diamond, Zap, ShieldCheck } from 'lucide-react';

const Hero = () => {
  const CLOUDINARY_BANNER_URL = "https://res.cloudinary.com/dopaqdvhd/image/upload/v1789195582/WhatsApp_Image_2026-09-12_at_11.51.14_AM.jpg"; 

  return (
    <div className="relative bg-[var(--bg-color)] overflow-hidden border-b border-[var(--border-color)] pb-16 pt-10 lg:pt-20">
      {/* Matched the fluid padding from Navbar */}
      <div className="w-full px-6 lg:px-16 2xl:px-32">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 xl:gap-24 items-center">
          
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-5 xl:col-span-5 lg:text-left z-10">
            <p className="text-sm font-semibold text-[var(--text-muted)] tracking-widest uppercase mb-3">
              Bring Ideas to Life
            </p>
            <h1 className="text-5xl tracking-tight font-extrabold sm:text-6xl lg:text-6xl xl:text-[5.5rem] xl:leading-[1.1] mb-5">
              <span className="block text-[var(--text-color)]">High Quality</span>
              <span className="block text-[var(--color-primary)]">3D Models</span>
            </h1>
            <p className="mt-4 text-base text-[var(--text-muted)] sm:text-lg lg:text-xl lg:mx-0 lg:pr-8">
              Explore a wide range of 3D models, from collectibles and home decor to creative designs and more. Find, preview, and buy the perfect model for your next 3D print.

            </p>
            
           

            <div className="mt-12 flex flex-wrap gap-8 sm:justify-center lg:justify-start text-sm font-medium text-[var(--text-muted)]">
              <div className="flex items-center gap-3">
                <Diamond className="text-[var(--color-primary)]" size={28} />
                <span>High Quality<br/>Models</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="text-[var(--color-primary)]" size={28} />
                <span>Instant<br/>Access</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-[var(--color-primary)]" size={28} />
                <span>Secure<br/>Payment</span>
              </div>
            </div>
          </div>

          {/* Image container scales dynamically with the column width */}
          <div className="mt-16 relative lg:mt-0 lg:col-span-7 xl:col-span-7 flex justify-end">
            <div className="relative w-full rounded-3xl shadow-2xl overflow-hidden group border border-[var(--border-color)]/20">
              <img
                className="w-full h-auto object-cover transform transition-transform duration-1000 group-hover:scale-105"
                src={CLOUDINARY_BANNER_URL}
                alt="3D Models Composite Collection"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;