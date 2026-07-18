'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { Button } from '@/components/ui/Button';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    // Vérifier si le consentement a déjà été donné ou refusé
    const consent = localStorage.getItem('cookie-consent');
    if (consent === 'true') {
      setConsentGiven(true);
    } else if (consent === null) {
      // Si aucun choix n'a été fait, on affiche la bannière
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setConsentGiven(true);
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'false');
    setShowBanner(false);
  };

  return (
    <>
      {/* Si le consentement est donné, on charge le script Google Analytics */}
      {consentGiven && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=G-KM57804JDG`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-KM57804JDG', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* Affichage de la bannière si aucun choix n'a été fait */}
      {showBanner && (
        <div className="fixed bottom-6 right-6 z-50 w-[calc(100%-3rem)] md:w-full max-w-[420px] bg-[#18181b] border border-gray-800 shadow-2xl rounded-xl p-5 flex flex-col gap-3 font-urbanist">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Nous respectons votre vie privée.</h3>
            <p className="text-sm text-gray-400 leading-snug">
              Nous utilisons des cookies pour améliorer votre expérience de navigation, diffuser des contenus personnalisés et analyser notre trafic. En cliquant sur « Tout accepter », vous consentez à notre utilisation des cookies.
            </p>
          </div>
          <div className="flex flex-wrap md:flex-nowrap gap-2 mt-1">
            <button 
              onClick={handleDecline} 
              className="flex-1 min-w-[100px] py-2.5 px-3 text-xs font-medium text-white border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
            >
              Personnaliser
            </button>
            <button 
              onClick={handleDecline} 
              className="flex-1 min-w-[100px] py-2.5 px-3 text-xs font-medium text-white border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
            >
              Tout rejeter
            </button>
            <button 
              onClick={handleAccept} 
              className="flex-1 min-w-[100px] py-2.5 px-3 text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
            >
              Accepter tout
            </button>
          </div>
        </div>
      )}
    </>
  );
}
