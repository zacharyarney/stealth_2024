'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useDocument } from '@/hooks/useDocument';
import 'react-quill/dist/quill.snow.css';
import CollaboratorForm from '@/components/collaboratorForm';
import Header from '@/components/header';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface DocumentEditPageProps {
  params: { id: string };
}

export default function DocumentEditPage({ params }: DocumentEditPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    document,
    isLoading,
    error,
    updateDocument,
    isUpdating,
  } = useDocument({ id: params.id });

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setContent(document.content);
    }
  }, [document]);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (document && session) {
      const sessionUserId = String(session.id);
      const isCollaborator = document.users.some(
        (collaborator) => String(collaborator.userId) === sessionUserId,
      );

      if (!isCollaborator) {
        router.push('/login');
      }
    }
  }, [status, session, document, router]);

  const handleSave = () => {
    if (document) {
      updateDocument({
        ...document,
        title,
        content,
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <Header />
      <h1>Edit Document</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Document Title"
      />
      <ReactQuill value={content} onChange={setContent} />
      <button onClick={handleSave} disabled={isUpdating}>
        {isUpdating ? 'Saving...' : 'Save'}
      </button>

      {/* Pass users as a prop to CollaboratorForm */}
      {document && <CollaboratorForm documentId={document.id} />}
    </div>
  );
}
