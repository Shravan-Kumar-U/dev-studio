import React, { useContext, useState } from "react";
import {
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Variable,
  X,
  Send,
  ImagePlus,
  CheckCircle2,
  WandSparkles
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const YoutubeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

const Footer = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    projectName: "",
    size: "",
    description: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();

    // Format the WhatsApp Message
    const message =
      `*🚀 New Custom 3D Model Quote Request!*\n\n` +
      `*👤 Name:* ${formData.customerName}\n` +
      `*💡 Project Name:* ${formData.projectName}\n` +
      `*📏 Approx. Size:* ${formData.size || "Not specified"}\n\n` +
      `*📝 Description:*\n${formData.description}\n\n` +
      `_(I will attach my reference images here)_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber =
      import.meta.env.VITE_WHATSAPP_NUMBER || "919876543210"; // Fallback if env is missing
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
    setIsModalOpen(false);
    setFormData({
      customerName: "",
      projectName: "",
      size: "",
      description: "",
    });
  };

  return (
    <>
      <footer
        id="contact"
        className="bg-[var(--surface-color)] border-t border-[var(--border-color)] relative"
      >
        {/* Call To Action Banner */}
        <div className="border-b border-[var(--border-color)] bg-[var(--bg-color)]/50">
          <div className="w-full px-4 sm:px-6 lg:px-16 2xl:px-32 py-8 md:py-12 mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-5 md:gap-6">
              <div className="flex items-center gap-4 md:gap-6 text-center md:text-left">
                <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <WandSparkles size={32} />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-[var(--text-color)]">
                    Have a custom idea in mind?
                  </h3>
                  <p className="text-[var(--text-muted)] text-sm md:text-base mt-1">
                    Get a personalized 3D model designed just for you.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex-shrink-0 flex items-center justify-center px-6 py-3.5 md:px-8 md:py-4 text-sm md:text-base font-bold rounded-full text-slate-900 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-all shadow-lg hover:shadow-[0_0_20px_var(--color-primary)] cursor-pointer transition-colors gap-2 w-full md:w-auto"
              >
                Get a Custom Quote{" "}
                <ArrowRight size={18} className="md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="w-full px-6 lg:px-16 2xl:px-32 pt-10 md:pt-16 pb-8 md:pb-12 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 lg:gap-8 mb-10 md:mb-16 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <img
                src="/logo.png"
                alt="Dev Studio Logo"
                className="h-12 md:h-16 w-auto mb-4 md:mb-6"
                style={{ filter: isDarkMode ? "none" : "brightness(0)" }}
              />
              <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-xs">
                Turning ideas into reality with high-quality 3D models.
              </p>
            </div>

            <div className="hidden md:block">
              <h4 className="text-[var(--text-color)] font-bold mb-6">
                Quick Links
              </h4>
              <ul className="space-y-4 text-sm text-[var(--text-muted)]">
                <li>
                  <button
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="hover:text-[var(--color-primary)] transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      document
                        .getElementById("models")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="hover:text-[var(--color-primary)] transition-colors"
                  >
                    Models
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      document
                        .getElementById("about")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="hover:text-[var(--color-primary)] transition-colors"
                  >
                    About
                  </button>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <h4 className="text-[var(--text-color)] font-bold mb-4 md:mb-6">
                Contact Us
              </h4>
              <ul className="space-y-3 md:space-y-4 text-sm text-[var(--text-muted)] flex flex-col items-center md:items-start">
                <li className="flex items-center gap-2 md:gap-3">
                  <Phone
                    size={16}
                    className="text-[var(--text-muted)] md:w-[18px] md:h-[18px]"
                  />
                  +91 94006 92521
                </li>
                <li className="flex items-center gap-2 md:gap-3">
                  <Mail
                    size={16}
                    className="text-[var(--text-muted)] md:w-[18px] md:h-[18px]"
                  />
                  helpdesignstudio3@gmail.com
                </li>
                <li className="flex items-center gap-2 md:gap-3">
                  <MapPin
                    size={16}
                    className="text-[var(--text-muted)] md:w-[18px] md:h-[18px]"
                  />
                  India
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <h4 className="text-[var(--text-color)] font-bold mb-4 md:mb-6">
                Follow Us
              </h4>

              <div className="flex items-center gap-4">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/devstudio3d?stkn=MXBsZjl3bmJ4cWtubg=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[var(--border-color)] flex items-center justify-center text-[var(--text-color)] hover:bg-[var(--color-primary)] hover:text-slate-900 transition-all cursor-pointer"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/your_page"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[var(--border-color)] flex items-center justify-center text-[var(--text-color)] hover:bg-[var(--color-primary)] hover:text-slate-900 transition-all cursor-pointer"
                  aria-label="Facebook"
                >
                  <FacebookIcon />
                </a>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@your_channel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[var(--border-color)] flex items-center justify-center text-[var(--text-color)] hover:bg-[var(--color-primary)] hover:text-slate-900 transition-all cursor-pointer"
                  aria-label="YouTube"
                >
                  <YoutubeIcon />
                </a>
              </div>

              <div className="hidden md:block mt-8 text-[var(--color-primary)] font-serif italic text-2xl md:text-3xl rotate-[-5deg] drop-shadow-md">
                Let's Create
                <br />
                Something Amazing!
              </div>
            </div>
          </div>

          <div className="pt-6 md:pt-8 border-t border-[var(--border-color)] flex flex-col items-center justify-center text-xs md:text-sm text-[var(--text-muted)]">
            <p>© 2026 Dev Studio 3D Printing. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* --- CUSTOM QUOTE MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-[var(--bg-color)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-full">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--surface-color)] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                  <WandSparkles size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-color)]">
                    Request Custom Quote
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Bring your 3D printing ideas to life.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-[var(--bg-color)] border border-[var(--border-color)] hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] hover:text-slate-900 text-[var(--text-muted)] rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <form
              onSubmit={handleWhatsAppSubmit}
              className="p-6 overflow-y-auto flex-grow flex flex-col gap-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[var(--text-color)]">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Enter Product name"
                    className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-color)] focus:border-[var(--color-primary)] outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[var(--text-color)]">
                    Project / Item Name *
                  </label>
                  <input
                    type="text"
                    name="projectName"
                    required
                    value={formData.projectName}
                    onChange={handleInputChange}
                    placeholder="e.g., Custom Batman Figurine"
                    className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-color)] focus:border-[var(--color-primary)] outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[var(--text-color)] flex items-center justify-between">
                  Project Description *
                </label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Describe your idea in detail. What are the key features? What is the purpose of the print?"
                  className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-color)] focus:border-[var(--color-primary)] outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[var(--text-color)]">
                  Approximate Dimensions (Optional)
                </label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="e.g., 15cm height, or 5 x 5 x 10 inches"
                  className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-color)] focus:border-[var(--color-primary)] outline-none transition-colors"
                />
              </div>

              {/* Image Attachment Helper UI (Visual only) */}
              <div className="bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-xl p-4 flex items-start gap-4 mt-2">
                <div className="p-3 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-xl shrink-0">
                  <ImagePlus size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-color)] mb-1 flex items-center gap-2">
                    Reference Images{" "}
                    <CheckCircle2
                      size={14}
                      className="text-[var(--color-primary)]"
                    />
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    To ensure the highest quality quote, please attach any
                    sketches, reference photos, or existing 3D files{" "}
                    <strong>directly in the WhatsApp chat</strong> after you
                    click send below.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-2 flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-slate-900 font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-[0_0_20px_var(--color-primary)]"
              >
                <Send size={18} /> Send Request via WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
