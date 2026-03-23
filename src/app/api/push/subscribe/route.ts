import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const getFilePath = () => path.join(process.cwd(), 'src', 'data', 'subscriptions.json');

export async function POST(req: Request) {
  try {
    const subscription = await req.json();
    const filePath = getFilePath();
    
    let subscriptions: any[] = [];
    if (fs.existsSync(filePath)) {
      try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        subscriptions = JSON.parse(fileContents);
      } catch (e) {
        console.error('Error reading subscriptions file:', e);
      }
    } else {
      // Intentar crear directorio solo si es necesario (puede fallar en Vercel)
      try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      } catch (e) {
        console.warn('Dir creation skipped (normal on Vercel)');
      }
    }

    // Evitar duplicados por endpoint
    const existingIndex = subscriptions.findIndex((s: { endpoint: string }) => s.endpoint === subscription.endpoint);
    if (existingIndex === -1) {
      subscriptions.push(subscription);
      try {
        fs.writeFileSync(filePath, JSON.stringify(subscriptions, null, 2), 'utf8');
      } catch (e) {
        console.warn('Write to subscriptions.json skipped (expected on Vercel)');
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Push subscription error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
