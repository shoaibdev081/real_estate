import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiArrowUp } from "react-icons/fi";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); 
  }, [pathname]);

  // Show/hide scroll button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTopManual = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTopManual}
          className="fixed bottom-22 right-6 sm:bottom-25 sm:right-8 bg-amber-600 hover:bg-amber-700 text-white rounded-full p-2.5 sm:p-3 shadow-xl transition-all duration-300 z-40 flex items-center justify-center hover:scale-110 active:scale-95"
          aria-label="Scroll to top"
        >
          <FiArrowUp size={20} />
        </button>
      )}
    </>
  );
}
