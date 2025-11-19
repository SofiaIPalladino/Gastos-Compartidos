import { NextResponse } from 'next/server';
import { getGroupById, removeGroup } from '@/lib/json-storage';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const group = getGroupById(params.id);
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    return NextResponse.json(group);
  } catch (error) {
    console.error('Error reading group:', error);
    return NextResponse.json({ error: 'Failed to read group' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    removeGroup(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting group:', error);
    return NextResponse.json({ error: 'Failed to delete group' }, { status: 500 });
  }
}
