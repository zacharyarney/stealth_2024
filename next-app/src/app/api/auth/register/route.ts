import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { createUser, getUserByUsername } from '@/db/dao';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const existingUser = await getUserByUsername(username);

  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await createUser(username, hashedPassword);

  return NextResponse.json(
    { message: 'User registered successfully', user: newUser },
    { status: 201 },
  );
}
