'use client';

import { useState } from 'react';
import { useCollaborators } from '@/hooks/useCollaborators';
import { useQueryClient } from '@tanstack/react-query';

interface CollaboratorFormProps {
  documentId: string;
}

function CollaboratorForm({ documentId }: CollaboratorFormProps) {
  const [newCollaboratorUsername, setNewCollaboratorUsername] = useState('');
  const {
    collaborators,
    error,
    isLoading,
    addCollaborator,
    removeCollaborator,
  } = useCollaborators(documentId);
  const queryClient = useQueryClient();

  const handleAddCollaborator = () => {
    addCollaborator({ documentId, username: newCollaboratorUsername });
    setNewCollaboratorUsername('');
  };

  const handleRemoveCollaborator = (username: string) => {
    removeCollaborator({ documentId, username });
    queryClient.invalidateQueries({ queryKey: ['collaborators', documentId] });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Collaborators</h2>
      <ul>
        {collaborators && collaborators.map((collaborator) => (
          <li key={collaborator.userId}>
            {collaborator.user.username}
            <button onClick={() => handleRemoveCollaborator(collaborator.user.username)}>Remove</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newCollaboratorUsername}
        onChange={(e) => setNewCollaboratorUsername(e.target.value)}
        placeholder="Add collaborator by username"
      />
      <button onClick={handleAddCollaborator}>Add Collaborator</button>
    </div>
  );
}

export default CollaboratorForm;
