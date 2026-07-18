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
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 font-urbanist">Respect de votre vie privée</h3>
            <p className="text-sm text-gray-600">
              Nous utilisons des cookies (Google Analytics) pour analyser le trafic de notre site et améliorer votre expérience. Vous pouvez accepter ou refuser ces cookies de suivi. Pour en savoir plus, consultez notre <a href="/confidentialite" className="text-[#3b82f6] hover:underline">politique de confidentialité</a>.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button onClick={handleDecline} variant="outline" className="text-sm px-4 py-2">
              Refuser
            </Button>
            <Button onClick={handleAccept} variant="primary" className="text-sm px-4 py-2">
              Accepter
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
