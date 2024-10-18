import prisma from '@/lib/prisma';

export async function createUser(username: string, password: string) {
  return prisma.user.create({
    data: { username, password },
  });
}

export async function getUserWithDocsByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
    include: { documents: { include: { document: true } } },
  });
}

export async function getUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
  });
}

export async function getDocumentById(id: string) {
  return prisma.document.findUnique({
    where: { id: Number(id) },
    include: {
      users: { include: { user: { select: { username: true, id: true } } } },
    },
  });
}

export async function createDocument(
  title: string,
  content: string,
  ownerId: number,
) {
  return prisma.document.create({
    data: {
      title,
      content,
      users: {
        create: {
          user: {
            connect: { id: ownerId },
          },
        },
      },
    },
  });
}

export async function updateDocument(
  id: string,
  title: string,
  content: string,
) {
  return prisma.document.update({
    where: { id: Number(id) },
    data: { title, content },
  });
}

export async function addCollaboratorToDocument(
  documentId: number,
  username: string,
) {
  const user = await getUserByUsername(username);
  if (!user) {
    throw new Error('User not found');
  }

  return prisma.documentAccess.create({
    data: {
      userId: user.id,
      documentId,
    },
  });
}

export async function getCollaboratorsForDocument(documentId: string) {
  return prisma.documentAccess.findMany({
    where: { documentId: Number(documentId) },
    include: { user: { select: { username: true, id: true } } },
  });
}

export async function removeCollaboratorFromDocument(
  documentId: number,
  username: string,
) {
  const user = await getUserByUsername(username);
  if (!user) {
    throw new Error('User not found');
  }

  return prisma.documentAccess.deleteMany({
    where: {
      documentId,
      userId: user.id,
    },
  });
}
