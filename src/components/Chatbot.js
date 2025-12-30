import { useState, useEffect } from 'react';

const ChatbotButton = () => {
  const [tawkLoaded, setTawkLoaded] = useState(false);

  useEffect(() => {
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/68d2e18a689fd0192638819f/1j5tg9vn5";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    script.onload = () => {
      setTawkLoaded(true);

      // Hide Tawk default button & loader
      window.Tawk_API.onLoad = function () {
        window.Tawk_API.hideWidget();
      };
    };

    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode.insertBefore(script, firstScript);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const openTawk = () => {
    if (window.Tawk_API?.maximize) {
      window.Tawk_API.maximize();
    } else if (window.Tawk_API?.toggle) {
      window.Tawk_API.toggle();
    }
  };

  return (
    <button
      onClick={openTawk}
      className="fixed bottom-6 right-6 z-50 bg-white p-3 rounded-full shadow-lg
        border border-gray-200 hover:shadow-xl transition-all"
    >
      💬
    </button>
  );
};

export default ChatbotButton;
