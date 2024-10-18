import { NextResponse } from 'next/server';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getCollaboratorsForDocument,
  getDocumentById,
  updateDocument,
} from '@/db/dao';

interface DocumentCollaborator {
  user: {
    id: number;
    username: string;
  };
  userId: number;
  documentId: number;
}

async function getAuthorizedDocument(id: string, session: Session | null) {
  if (!session || !session.id) {
    return { status: 401, message: 'Unauthorized' };
  }

  const document = await getDocumentById(id);
  const users: DocumentCollaborator[] = await getCollaboratorsForDocument(id);

  if (!document) {
    return { status: 404, message: 'Document not found' };
  }

  if (!users.some((collaborator) => collaborator.user.id === session.id)) {
    return { status: 403, message: 'Forbidden' };
  }

  return { status: 200, document };
}

export async function GET(
  req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  const { status, message, document } = await getAuthorizedDocument(
    params.id, session);
  if (status !== 200) {
    return NextResponse.json({ message }, { status });
  }

  return NextResponse.json(document, { status: 200 });
}

export async function PUT(
  req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  const { status, message } = await getAuthorizedDocument(
    params.id, session);
  if (status !== 200) {
    return NextResponse.json({ message }, { status });
  }

  try {
    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { message: 'Title and content fields required' }, { status: 400 });
    }

    const updatedDocument = await updateDocument(params.id, title, content);
    return NextResponse.json(updatedDocument, { status: 200 });
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' }, { status: 500 });
  }
}
