'use client';

import { useState, useEffect } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
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
        <GoogleAnalytics gaId="G-KM57804JDG" />
      )}

      {/* Affichage de la bannière si aucun choix n'a été fait */}
      {showBanner && (
        <div
          role="alertdialog"
          aria-live="polite"
          aria-modal="false"
          aria-labelledby="cookie-heading"
          aria-describedby="cookie-desc"
          className="fixed bottom-6 right-6 z-50 flex w-[calc(100%-3rem)] max-w-[420px] flex-col gap-3 rounded-card border border-on-surface-brand/10 bg-surface-brand p-5 text-on-surface-brand shadow-elev-4 md:w-full"
        >
          <div>
            <h2 id="cookie-heading" className="mb-1 text-title-md">Nous respectons votre vie privée.</h2>
            <p id="cookie-desc" className="text-body-sm opacity-90">
              Nous utilisons des cookies pour améliorer votre expérience de navigation, diffuser des contenus personnalisés et analyser notre trafic. En cliquant sur « Tout accepter », vous consentez à notre utilisation des cookies.
            </p>
          </div>
          <div className="mt-1 flex flex-wrap gap-2 md:flex-nowrap">
            <Button type="button" variant="ghost-dark" size="sm" onClick={handleDecline} className="min-w-[100px] flex-1 px-3">
              Personnaliser
            </Button>
            <Button type="button" variant="ghost-dark" size="sm" onClick={handleDecline} className="min-w-[100px] flex-1 px-3">
              Tout rejeter
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={handleAccept} className="min-w-[100px] flex-1 px-3">
              Accepter tout
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
