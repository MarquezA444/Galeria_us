'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, CheckCircle2 } from 'lucide-react';

export default function PushSubscription() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'denied'>('idle');

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((subscription) => {
          if (subscription) {
            setIsSubscribed(true);
          } else {
            setTimeout(() => setIsVisible(true), 5000);
          }
        });
      });
    }
  }, []);

  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  const subscribeToPush = async () => {
    setStatus('loading');
    try {
      const registration = await navigator.serviceWorker.ready;
      
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) throw new Error('VAPID public key not found');

      const convertedKey = urlBase64ToUint8Array(publicKey);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey
      });

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      setIsSubscribed(true);
      setStatus('success');
      setTimeout(() => setIsVisible(false), 3000);
    } catch (error) {
      console.error('Subscription failed:', error);
      setStatus('denied');
    }
  };

  if (isSubscribed && status !== 'success') return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 right-6 md:right-12 z-[80]"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={subscribeToPush}
            disabled={status === 'loading'}
            className="flex items-center space-x-3 bg-black/40 backdrop-blur-md border border-yellow-500/30 px-5 py-3 rounded-2xl shadow-lg hover:border-yellow-400/60 transition-all group"
          >
            {status === 'loading' ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full"
              />
            ) : status === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-yellow-400" />
            ) : status === 'denied' ? (
              <BellOff className="w-5 h-5 text-red-400/70" />
            ) : (
              <Bell className="w-5 h-5 text-yellow-400 group-hover:animate-bounce" />
            )}
            
            <div className="flex flex-col items-start">
              <span className="text-yellow-100 text-xs font-semibold tracking-wider uppercase">
                {status === 'success' ? 'Suscrito' : status === 'denied' ? 'Error' : 'Recibir Polen'}
              </span>
              <span className="text-white/40 text-[10px]">
                {status === 'success' ? '¡Te avisaré!' : 'Notificar flores nuevas'}
              </span>
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
