import Link from 'next/link';
import { getUserWithDocsByUsername } from '@/db/dao';
import Header from '@/components/header';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

interface UserWithDocs {
  id: number;
  username: string;
  documents: UserDocument[];
}
interface UserDocument {
  userId: number;
  documentId: number;
  document: { title: string }
}
interface UserPageProps {
  params: { username: string };
}

async function UserPage({ params }: UserPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || session.username !== params.username) {
    redirect('/login');
  }
  const user: UserWithDocs | null = await getUserWithDocsByUsername(params.username);

  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <div>
      <Header />
      <h1>{user.username}&#39;s Dashboard</h1>

      <h2>Your Documents</h2>
      {user.documents.length > 0 ? (
        <ul>
          {user.documents.map((doc) => (
            <li key={doc.documentId}>
              <Link href={`/document/${doc.documentId}`}>{doc.document.title}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No documents found. Start by creating one!</p>
      )}

      <Link href={`/${user.username}/create-document`}>
        <button>Create New Document</button>
      </Link>
    </div>
  );
}

export default UserPage;
