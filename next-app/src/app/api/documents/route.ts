import { NextResponse } from 'next/server';
import { createDocument } from '@/db/dao';

export async function POST(request: Request) {
  const { title, content, ownerId } = await request.json();

  try {
    const newDocument = await createDocument(title, content, ownerId);

    return NextResponse.json(newDocument);
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 },
    );
  }
}
