import {
  addCollaboratorToDocument,
  getCollaboratorsForDocument,
  removeCollaboratorFromDocument,
} from '@/db/dao';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    const collaborators = await getCollaboratorsForDocument(id);
    return NextResponse.json(collaborators);
  } catch (error) {
    console.error('Error fetching collaborators:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    const { username }: { username: string } = await req.json();
    const newCollaborator = await addCollaboratorToDocument(
      Number(id),
      username,
    );
    return NextResponse.json(newCollaborator, { status: 201 });
  } catch (error) {
    console.error('Error adding collaborator:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    const { username }: { username: string } = await req.json();
    await removeCollaboratorFromDocument(Number(id), username);
    return NextResponse.json({ status: 204 });
  } catch (error) {
    console.error('Error removing collaborator:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
