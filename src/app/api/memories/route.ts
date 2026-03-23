import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import webPush, { type PushSubscription } from 'web-push';

export const dynamic = 'force-dynamic';

const ensureVapidConfig = () => {
  if (process.env.VAPID_PRIVATE_KEY && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
    try {
      webPush.setVapidDetails(
        process.env.VAPID_EMAIL || 'mailto:example@example.com',
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
      );
    } catch (err) {
      console.error('VAPID initialization failed:', err);
    }
  }
};


const getFilePath = () => path.join(process.cwd(), 'src', 'data', 'memories.json');
const getSubscriptionsPath = () => path.join(process.cwd(), 'src', 'data', 'subscriptions.json');

export async function GET() {
  try {
    const filePath = getFilePath();
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(fileContents);
      return NextResponse.json(data);
    }
    return NextResponse.json({ timeline: [] });
  } catch (error) {
    console.error('API Memory GET error:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    const filePath = getFilePath();
    
    let data: { timeline: any[] } = { timeline: [] };
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      data = JSON.parse(fileContents);
    }
    
    // Inyectar en el Timeline como semilla plantada
    const newMemory = {
      id: `memoria-semilla-${Date.now()}`,
      date: new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()),
      timestamp: new Date().toISOString(),
      title: 'Un nuevo brote',
      message: "Un pensamiento mágico que acaba de florecer.",
      fullSecretMessage: rawBody.thought || '',
      gifUrl: rawBody.photoBase64 || '',
      unlockDate: rawBody.unlockDate || undefined
    };
    
    data.timeline.push(newMemory as any);
    
    // Intentar escribir solo si es posible (Serverless friendly)
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
      console.warn('Write to memories.json failed (expected on Vercel):', e);
    }

    // --- Lógica de Notificación Push ---
    ensureVapidConfig();
    const subsPath = getSubscriptionsPath();
    if (fs.existsSync(subsPath)) {
      try {
        const subscriptions = JSON.parse(fs.readFileSync(subsPath, 'utf8'));
        
        const payload = JSON.stringify({
          title: '¡Ha florecido algo nuevo! 🌸',
          body: 'Alguien acaba de plantar un recuerdo en tu jardín.',
          url: '/'
        });

        // Enviar a todos los suscriptores
        const pushPromises = subscriptions.map((sub: PushSubscription) => 
          webPush.sendNotification(sub, payload).catch(err => {
            console.error('Error sending push to subscription:', err.endpoint);
          })
        );
        
        // No bloqueamos la respuesta principal
        Promise.all(pushPromises);
      } catch (e) {
        console.error('Error reading subscriptions:', e);
      }
    }
    
    return NextResponse.json({ success: true, memory: newMemory });
  } catch (error) {
    console.error('API Memory POST error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
