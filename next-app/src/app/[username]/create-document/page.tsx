'use client';

import { FormEvent, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import 'react-quill/dist/quill.snow.css';
import Header from '@/components/header';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function CreateNewDocument() {
  const { data: session } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!session) return;

    try {
      await fetch(`/api/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          ownerId: session.id,
        }),
      });

      router.push(`/${session.username}`);
      router.refresh();
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  return (
    <div>
      <Header />
      <h1>Create New Document</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <ReactQuill value={content} onChange={setContent} />
        </div>
        <button type="submit">Create Document</button>
      </form>
    </div>
  );
}
