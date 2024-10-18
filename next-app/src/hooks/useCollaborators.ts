import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface DocumentUser {
  userId: number;
  user: {
    username: string;
  };
}

const fetchCollaborators = async (documentId: string) => {
  const response = await fetch(`/api/documents/${documentId}/collaborators`);
  if (!response.ok) {
    throw new Error('Error fetching collaborators');
  }
  return response.json();
};

const addCollaborator = async ({ documentId, username }: {
  documentId: string;
  username: string
}) => {
  const response = await fetch(`/api/documents/${documentId}/collaborators`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message);
  }

  return response.json();
};

const removeCollaborator = async ({ documentId, username }: {
  documentId: string;
  username: string
}) => {
  const response = await fetch(`/api/documents/${documentId}/collaborators`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message);
  }

  return response.json();
};

export const useCollaborators = (documentId: string) => {
  const queryClient = useQueryClient();

  const {
    data: collaborators,
    error,
    isLoading,
  } = useQuery<DocumentUser[]>({
    queryKey: ['collaborators', documentId],
    queryFn: () => fetchCollaborators(documentId),
  });

  const addMutation = useMutation({
    mutationFn: addCollaborator,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeCollaborator,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  return {
    collaborators,
    error,
    isLoading,
    addCollaborator: addMutation.mutate,
    removeCollaborator: removeMutation.mutate,
  };
};
