import { useMutation, useQuery } from '@tanstack/react-query';
import { User } from '@prisma/client';

export interface Document {
  id: string;
  title: string;
  content: string;
  deltaState: Uint8Array;
  users: DocumentUser[];
}

export interface DocumentUser {
  userId: string;
  documentId: string;
  user: User;
}

interface UseDocumentOptions {
  id: string;
}

async function fetchDocument(id: string): Promise<Document> {
  const response = await fetch(`/api/documents/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch document');
  }
  return response.json();
}

async function updateDocument(doc: Document): Promise<Document> {
  const response = await fetch(`/api/documents/${doc.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: doc.title,
      deltaState: Array.from(doc.deltaState), // Store Uint8Array as JSON array
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to update document');
  }
  return response.json();
}

export function useDocument({ id }: UseDocumentOptions) {
  const { data: document, error, isLoading } = useQuery<Document, Error>({
    queryKey: ['document', id],
    queryFn: () => fetchDocument(id),
    enabled: !!id, // Only fetch if there's an ID
  });

  const updateDocumentMutation = useMutation<Document, Error, Document>({
    mutationFn: updateDocument,
  });

  return {
    document,
    error,
    isLoading,
    updateDocument: updateDocumentMutation.mutate,
    isUpdating: updateDocumentMutation.isPending,
  };
}
