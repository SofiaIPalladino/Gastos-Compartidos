import { NextResponse } from 'next/server';
import { getAllGroups, saveGroup } from '@/lib/json-storage';

export async function GET() {
  try {
    const groups = getAllGroups();
    return NextResponse.json(groups);
  } catch (error) {
    console.error('Error reading groups:', error);
    return NextResponse.json({ error: 'Failed to read groups' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const group = await request.json();
    saveGroup(group);
    return NextResponse.json(group);
  } catch (error) {
    console.error('Error saving group:', error);
    return NextResponse.json({ error: 'Failed to save group' }, { status: 500 });
  }
}
