import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const getFilePath = () => path.join(process.cwd(), 'src', 'data', 'subscriptions.json');

export async function POST(req: Request) {
  try {
    const subscription = await req.json();
    const filePath = getFilePath();
    
    let subscriptions = [];
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      subscriptions = JSON.parse(fileContents);
    } else {
      // Crear directorio si no existe
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    // Evitar duplicados por endpoint
    const existingIndex = subscriptions.findIndex((s: { endpoint: string }) => s.endpoint === subscription.endpoint);
    if (existingIndex === -1) {
      subscriptions.push(subscription);
      fs.writeFileSync(filePath, JSON.stringify(subscriptions, null, 2), 'utf8');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Push subscription error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
