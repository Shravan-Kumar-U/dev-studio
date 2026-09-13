import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Home,
  ChevronRight,
  ChevronLeft,
  Download,
  ShoppingCart,
  Diamond,
  Box,
  Award,
  ArrowRight,
  X,
  FileText,
  Maximize,
  Layers,
  MessageCircle,
  Send,
} from "lucide-react";
import api from "../services/api";
import PageLoader from "../components/ui/PageLoader";
import { SocketContext } from "../context/SocketContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");

  // Gallery Modal States
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // WhatsApp Checkout Modal States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Socket Integration
  const { socket, isConnected } = useContext(SocketContext);
  const wasDisconnected = useRef(false);

  const fetchProductData = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      const productData = res.data.data;
      setProduct(productData);
      // Only set main image initially to prevent overriding user selection on live updates
      if (!mainImage)
        setMainImage(productData.images[0]?.url || "/placeholder.png");

      const allRes = await api.get("/products");
      const filtered = allRes.data.data.filter((p) => p._id !== id).slice(0, 4);
      setRelatedProducts(filtered);
    } catch (err) {
      console.error("Failed to fetch product:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setLoading(true);
    setMainImage("");
    fetchProductData();
  }, [id]);

  // Re-sync on Reconnection
  useEffect(() => {
    if (!isConnected) {
      wasDisconnected.current = true;
    } else if (isConnected && wasDisconnected.current) {
      fetchProductData();
      wasDisconnected.current = false;
    }
  }, [isConnected]);

  // Live Update Listeners
  useEffect(() => {
    if (!socket) return;

    const onProductUpdated = (updatedProduct) => {
      // Update main product if it's the one being viewed
      if (updatedProduct._id === id) {
        setProduct(updatedProduct);
      }
      // Instantly update related products array if modified
      setRelatedProducts((prev) =>
        prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)),
      );
    };

    const onProductDeleted = (deletedId) => {
      // Evict user if the product they are looking at gets deleted
      if (deletedId === id) {
        navigate("/models", { replace: true });
      }
      setRelatedProducts((prev) => prev.filter((p) => p._id !== deletedId));
    };

    socket.on("product-updated", onProductUpdated);
    socket.on("product-deleted", onProductDeleted);

    return () => {
      socket.off("product-updated", onProductUpdated);
      socket.off("product-deleted", onProductDeleted);
    };
  }, [socket, id, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    const fetchProductData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        const productData = res.data.data;
        setProduct(productData);
        setMainImage(productData.images[0]?.url || "/placeholder.png");

        const allRes = await api.get("/products");
        const filtered = allRes.data.data
          .filter((p) => p._id !== id)
          .slice(0, 4);
        setRelatedProducts(filtered);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const actualImages = product?.images || [];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isGalleryOpen) return;
      if (e.key === "ArrowRight")
        setGalleryIndex((prev) =>
          prev === actualImages.length - 1 ? 0 : prev + 1,
        );
      else if (e.key === "ArrowLeft")
        setGalleryIndex((prev) =>
          prev === 0 ? actualImages.length - 1 : prev - 1,
        );
      else if (e.key === "Escape") setIsGalleryOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGalleryOpen, actualImages.length]);

  const handleDownload = async () => {
    try {
      const response = await fetch(mainImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const safeName = product.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      link.download = `${safeName}_model.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed, opening in new tab instead:", error);
      window.open(mainImage, "_blank");
    }
  };

  // Handle WhatsApp Order Submission
  const handleWhatsAppOrder = (e) => {
    e.preventDefault();

    const adminWhatsAppNumber = import.meta.env.VITE_WHATSAPP_NUMBER;

    if (!adminWhatsAppNumber) {
      console.error(
        "VITE_WHATSAPP_NUMBER is missing in the environment configuration.",
      );
      alert(
        "Store contact configuration is currently missing. Please try again later.",
      );
      return;
    }

    const totalPrice = product.price * quantity;
    const productUrl = window.location.href; // Dynamically grabs the current URL

    const message =
      `*New 3D Print Order - Dev Studio* 🚀\n\n` +
      `*Product:* ${product.name}\n` +
      `*Product Link:* ${productUrl}\n` +
      `*Price:* ₹${product.price} x ${quantity} = *₹${totalPrice}*\n` +
      `*Image:* ${mainImage}\n\n` +
      `*Customer Details:*\n` +
      `Name: ${customerName}\n` +
      `Email: ${customerEmail}\n` +
      `Phone: ${customerPhone}\n` +
      `Address: ${customerAddress}\n`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
    setIsCheckoutOpen(false);
  };

  if (loading) {
    return <PageLoader onComplete={() => {}} />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)]">
        <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
        <button
          onClick={() => navigate("/")}
          className="text-[var(--color-primary)] hover:underline"
        >
          Return Home
        </button>
      </div>
    );
  }

  const displayLimit = 3;
  const extraImagesCount = actualImages.length - displayLimit;

  const nextImage = () =>
    setGalleryIndex((prev) =>
      prev === actualImages.length - 1 ? 0 : prev + 1,
    );
  const prevImage = () =>
    setGalleryIndex((prev) =>
      prev === 0 ? actualImages.length - 1 : prev - 1,
    );

  return (
    <div className="min-h-screen bg-[var(--bg-color)] pb-28 md:pb-20 relative">
      {/* --- WhatsApp Checkout Modal --- */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-6 right-6 p-2 text-[var(--text-muted)] hover:text-[var(--text-color)] rounded-full transition-colors"
            >
              <X size={22} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <MessageCircle size={26} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--text-color)]">
                  Order via WhatsApp
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Complete your details to send order directly to store.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-[var(--bg-color)] rounded-2xl border border-[var(--border-color)] mb-6">
              <img
                src={mainImage}
                alt={product.name}
                className="w-16 h-16 object-contain rounded-xl bg-surface p-1 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-[var(--text-color)] truncate">
                  {product.name}
                </h4>
                <p className="text-xs text-[var(--color-primary)] font-semibold">
                  ₹{product.price} per unit
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-muted)]">Qty:</span>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-12 text-center bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg text-sm font-bold text-[var(--text-color)] py-1 outline-none"
                />
              </div>
            </div>

            <form onSubmit={handleWhatsAppOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-color)] outline-none focus:border-[var(--color-primary)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. hello@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-color)] outline-none focus:border-[var(--color-primary)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Enter 10-digit mobile number"
                  value={customerPhone}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                    setCustomerPhone(value);
                  }}
                  pattern="[6-9][0-9]{9}"
                  minLength={10}
                  maxLength={10}
                  inputMode="numeric"
                  className="w-full px-4 py-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-color)] outline-none focus:border-[var(--color-primary)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1.5">
                  Delivery Address
                </label>
                <textarea
                  required
                  rows="2"
                  placeholder="Enter full shipping address..."
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-color)] outline-none focus:border-[var(--color-primary)] transition-colors resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[var(--border-color)] mt-4">
                <div>
                  <span className="text-xs text-[var(--text-muted)]">
                    Total Amount:
                  </span>
                  <div className="text-lg font-extrabold text-[var(--text-color)]">
                    ₹{product.price * quantity}
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg transition-colors"
                >
                  <Send size={18} />
                  Send to WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center">
          <button
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
          >
            <X size={28} />
          </button>
          <div className="relative w-full max-w-6xl flex items-center justify-between px-4">
            <button
              onClick={prevImage}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
            >
              <ChevronLeft size={32} />
            </button>
            <div className="w-full h-[60vh] md:h-[70vh] flex items-center justify-center px-4">
              <img
                src={actualImages[galleryIndex]?.url}
                alt={`${product.name} - View ${galleryIndex + 1}`}
                className="max-w-full max-h-full object-contain drop-shadow-2xl"
              />
            </div>
            <button
              onClick={nextImage}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
            >
              <ChevronRight size={32} />
            </button>
          </div>
          <div className="absolute bottom-6 flex gap-3 overflow-x-auto max-w-[90vw] px-4 py-2">
            {actualImages.map((img, idx) => (
              <button
                key={img._id || idx}
                onClick={() => setGalleryIndex(idx)}
                className={`w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all duration-300 ${galleryIndex === idx ? "border-[var(--color-primary)] opacity-100 scale-110" : "border-transparent opacity-50 hover:opacity-100"}`}
              >
                <img
                  src={img.url}
                  alt={`Thumb ${idx}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="hidden lg:flex w-full px-6 lg:px-16 2xl:px-32 py-6 items-center gap-2 text-sm text-[var(--text-muted)] font-medium">
        <Link
          to="/"
          className="flex items-center gap-1 hover:text-[var(--color-primary)] transition-colors"
        >
          <Home size={16} />
        </Link>
        <ChevronRight size={16} />
        <Link
          to="/"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
            setTimeout(
              () => document.getElementById("models")?.scrollIntoView(),
              100,
            );
          }}
          className="hover:text-[var(--color-primary)] transition-colors"
        >
          Models
        </Link>
        <ChevronRight size={16} />
        <span className="text-[var(--text-color)]">{product.name}</span>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-16 2xl:px-32 lg:pt-0 pt-4">
        <div className="lg:grid lg:grid-cols-12 lg:gap-10 xl:gap-12 items-start">
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 mb-2 lg:mb-0">
            <div className="hidden lg:flex lg:flex-col gap-3 lg:w-24 xl:w-28 shrink-0">
              {actualImages.slice(0, displayLimit).map((img, idx) => (
                <button
                  key={img._id || idx}
                  onClick={() => setMainImage(img.url)}
                  className={`relative lg:w-full lg:h-24 xl:h-28 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-300 bg-[var(--surface-color)] ${mainImage === img.url ? "border-[var(--color-primary)] opacity-100" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <img
                    src={img.url}
                    alt={`Thumbnail ${idx}`}
                    className="w-full h-full object-contain p-1"
                  />
                </button>
              ))}
              {extraImagesCount > 0 && (
                <div
                  onClick={() => {
                    setGalleryIndex(displayLimit);
                    setIsGalleryOpen(true);
                  }}
                  className="relative lg:w-full lg:h-24 xl:h-28 rounded-xl overflow-hidden shrink-0 bg-[var(--surface-color)] border border-[var(--border-color)] flex flex-col items-center justify-center cursor-pointer hover:border-[var(--color-primary)] transition-all group"
                >
                  <span className="text-[var(--text-color)] font-bold text-lg group-hover:text-[var(--color-primary)]">
                    +{extraImagesCount}
                  </span>
                  <span className="text-[var(--text-muted)] text-[10px] uppercase tracking-wider text-center group-hover:text-[var(--text-color)]">
                    More Views
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col w-full">
              <div
                onClick={() => {
                  const idx = actualImages.findIndex(
                    (img) => img.url === mainImage,
                  );
                  setGalleryIndex(idx !== -1 ? idx : 0);
                  setIsGalleryOpen(true);
                }}
                className="relative w-full bg-[var(--surface-color)] rounded-2xl lg:rounded-3xl overflow-hidden border border-[var(--border-color)]/20 shadow-lg lg:shadow-2xl aspect-[4/3] lg:aspect-auto lg:h-[600px] xl:h-[700px] cursor-zoom-in group"
              >
                <img
                  src={mainImage}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-contain object-center p-3 md:p-8 transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-color)]/20 via-transparent to-transparent pointer-events-none" />
              </div>

              <div className="flex justify-center gap-2 mt-4 lg:hidden">
                {actualImages.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img.url)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${mainImage === img.url ? "w-6 bg-[var(--color-primary)]" : "w-3 bg-[var(--border-color)]"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
            <div className="lg:bg-[var(--surface-color)] lg:border lg:border-[var(--border-color)] lg:rounded-3xl lg:p-8 xl:p-10 lg:shadow-lg pt-4 lg:pt-0">
              <div className="hidden lg:block w-10 h-1 bg-[var(--color-primary)] mb-4 rounded-full"></div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-color)] mb-2 leading-tight">
                {product.name}
              </h1>

              <p className="text-sm md:text-base text-[var(--text-muted)] leading-relaxed mb-6 lg:mb-8">
                {product.description} A beautifully crafted model with intricate
                architectural details, perfect for collectors, home decor, and
                3D printing enthusiasts. Designed with precision to bring
                elegance and realism to your prints.
              </p>

              <div className="grid grid-cols-3 lg:grid-cols-2 gap-2 lg:gap-6 mb-6 lg:mb-8">
                <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-1.5 lg:gap-4 bg-[var(--surface-color)] lg:bg-transparent border lg:border-none border-[var(--border-color)] rounded-xl p-3 lg:p-0">
                  <Diamond className="text-[var(--color-primary)] w-6 h-6 lg:w-7 lg:h-7 shrink-0" />
                  <div>
                    <h4 className="text-[var(--text-color)] font-bold text-[11px] lg:text-sm mb-0.5">
                      High Detail
                    </h4>
                    <p className="text-[var(--text-muted)] text-[9px] lg:text-[11px] leading-tight">
                      Intricate design
                    </p>
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-1.5 lg:gap-4 bg-[var(--surface-color)] lg:bg-transparent border lg:border-none border-[var(--border-color)] rounded-xl p-3 lg:p-0">
                  <Box className="text-[var(--color-primary)] w-6 h-6 lg:w-7 lg:h-7 shrink-0" />
                  <div>
                    <h4 className="text-[var(--text-color)] font-bold text-[11px] lg:text-sm mb-0.5">
                      3D Print Ready
                    </h4>
                    <p className="text-[var(--text-muted)] text-[9px] lg:text-[11px] leading-tight">
                      Optimized file
                    </p>
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-1.5 lg:gap-4 bg-[var(--surface-color)] lg:bg-transparent border lg:border-none border-[var(--border-color)] rounded-xl p-3 lg:p-0">
                  <Award className="text-[var(--color-primary)] w-6 h-6 lg:w-7 lg:h-7 shrink-0" />
                  <div>
                    <h4 className="text-[var(--text-color)] font-bold text-[11px] lg:text-sm mb-0.5">
                      Quality Design
                    </h4>
                    <p className="text-[var(--text-muted)] text-[9px] lg:text-[11px] leading-tight">
                      Clean & accurate
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-2 lg:gap-0 lg:flex lg:flex-col lg:space-y-4 bg-transparent lg:bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl p-4 lg:p-8 lg:shadow-lg mb-6 lg:mb-8">
                <div className="flex items-start lg:items-center gap-2 lg:justify-between lg:border-b border-[var(--border-color)] lg:pb-3">
                  <FileText className="text-[var(--text-muted)] w-4 h-4 lg:hidden mt-0.5 shrink-0" />
                  <div className="flex flex-col lg:flex-row lg:w-full lg:justify-between min-w-0">
                    <span className="text-[var(--text-color)] lg:text-[var(--text-muted)] text-[11px] lg:text-sm font-bold lg:font-normal">
                      File Format
                    </span>
                    <span className="text-[var(--text-muted)] lg:text-[var(--text-color)] text-[10px] lg:text-sm lg:font-semibold">
                      STL, OBJ, FBX
                    </span>
                  </div>
                </div>
                <div className="flex items-start lg:items-center gap-2 lg:justify-between lg:border-b border-[var(--border-color)] lg:pb-3">
                  <Box className="text-[var(--text-muted)] w-4 h-4 lg:hidden mt-0.5 shrink-0" />
                  <div className="flex flex-col lg:flex-row lg:w-full lg:justify-between min-w-0">
                    <span className="text-[var(--text-color)] lg:text-[var(--text-muted)] text-[11px] lg:text-sm font-bold lg:font-normal">
                      Polygons
                    </span>
                    <span className="text-[var(--text-muted)] lg:text-[var(--text-color)] text-[10px] lg:text-sm lg:font-semibold">
                      1,250,000
                    </span>
                  </div>
                </div>
                <div className="flex items-start lg:items-center gap-2 lg:justify-between lg:border-b border-[var(--border-color)] lg:pb-3">
                  <Maximize className="text-[var(--text-muted)] w-4 h-4 lg:hidden mt-0.5 shrink-0" />
                  <div className="flex flex-col lg:flex-row lg:w-full lg:justify-between min-w-0">
                    <span className="text-[var(--text-color)] lg:text-[var(--text-muted)] text-[11px] lg:text-sm font-bold lg:font-normal">
                      Dimensions
                    </span>
                    <span className="text-[var(--text-muted)] lg:text-[var(--text-color)] text-[10px] lg:text-sm lg:font-semibold">
                      120 x 80 x 150 mm
                    </span>
                  </div>
                </div>
                <div className="flex items-start lg:items-center gap-2 lg:justify-between">
                  <Layers className="text-[var(--text-muted)] w-4 h-4 lg:hidden mt-0.5 shrink-0" />
                  <div className="flex flex-col lg:flex-row lg:w-full lg:justify-between min-w-0">
                    <span className="text-[var(--text-color)] lg:text-[var(--text-muted)] text-[11px] lg:text-sm font-bold lg:font-normal">
                      License
                    </span>
                    <span className="text-[var(--text-muted)] lg:text-[var(--text-color)] text-[10px] lg:text-sm lg:font-semibold">
                      Personal Use
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 mt-2 lg:mt-0">
                <button
                  onClick={handleDownload}
                  className="w-full lg:flex-1 flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-slate-900 font-bold py-3.5 lg:py-4 rounded-full transition-colors"
                >
                  <Download size={18} /> Download Model
                </button>
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  // Hover behavior fixed to ensure dark text consistently across both desktop and mobile
                  className="w-full lg:flex-1 flex items-center justify-center gap-2 bg-transparent border-2 border-[var(--color-primary)] lg:border-[var(--border-color)] text-[var(--color-primary)] lg:text-[var(--text-color)] hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] hover:text-slate-900 lg:hover:text-slate-900 font-bold py-3.5 lg:py-4 rounded-full transition-all"
                >
                  <ShoppingCart size={18} /> Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="w-full pl-4 pr-0 sm:px-6 lg:px-16 2xl:px-32 mt-12 lg:mt-24">
          <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-8 lg:pt-12 mb-6 pr-4 lg:pr-0">
            <h2 className="text-xl md:text-3xl font-extrabold text-[var(--text-color)]">
              You Might Also Like
            </h2>
            <Link
              to="/models"
              className="flex items-center gap-1 text-xs md:text-sm text-[var(--text-muted)] hover:text-[var(--color-primary)] font-semibold transition-colors"
            >
              View More <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-4 pb-10 pt-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {relatedProducts.map((relProduct) => (
              <div
                key={relProduct._id}
                onClick={() => navigate(`/models/${relProduct._id}`)}
                className="group flex flex-col lg:flex-row bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl p-3 lg:p-4 w-[150px] lg:w-auto shrink-0 snap-center cursor-pointer gap-2 lg:gap-4 relative transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:border-[var(--color-primary)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_20px_40px_-10px_rgba(255,193,7,0.15)]"
              >
                <div className="w-full aspect-square lg:w-24 lg:h-24 rounded-xl overflow-hidden bg-[var(--bg-color)] shrink-0 relative p-1">
                  <img
                    src={relProduct.images[0]?.url || "/placeholder.png"}
                    alt={relProduct.name}
                    className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-color)]/50 to-transparent pointer-events-none"></div>
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0 pb-1 lg:pb-0">
                  <div>
                    <h4 className="text-[var(--text-color)] font-bold text-[13px] lg:text-base mb-0.5 truncate group-hover:text-[var(--color-primary)] transition-colors">
                      {relProduct.name}
                    </h4>
                    <p className="text-[var(--text-muted)] text-[10px] lg:text-xs line-clamp-1 lg:line-clamp-2 leading-snug">
                      {relProduct.description}
                    </p>
                  </div>
                  <div className="absolute bottom-3 right-3 lg:static lg:w-8 lg:h-8 lg:rounded-full lg:bg-[var(--bg-color)] lg:border border-[var(--border-color)] flex items-center justify-center shrink-0 lg:group-hover:bg-[var(--color-primary)] lg:group-hover:border-[var(--color-primary)] text-[var(--color-primary)] lg:text-[var(--text-muted)] lg:group-hover:text-slate-900 transition-all p-1 lg:p-0">
                    <ArrowRight
                      size={14}
                      className="transform group-hover:translate-x-0.5 transition-transform"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
