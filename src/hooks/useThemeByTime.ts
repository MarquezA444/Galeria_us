'use client';

import { useState, useEffect } from 'react';

export function useThemeByTime() {
  // Inicializamos en true porque el tema original era nocturno, para evitar destellos blancos
  const [isNight, setIsNight] = useState(true);

  useEffect(() => {
    const checkTime = () => {
      const currentHour = new Date().getHours();
      // Noche: 18:00 (6 PM) a 05:59 (5 AM)
      setIsNight(currentHour >= 18 || currentHour < 6);
    };

    // Comprobación inicial
    checkTime();
    
    // Check cada minuto para asegurar transiciones sutiles si ella permanece en la web durante el atardecer
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return isNight;
}
