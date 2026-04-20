import { connectDB } from "@/lib/mongodb";
import Note from "@/models/Note";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const notes = await Note.find().sort({ createdAt: -1 });

  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  const note = await Note.create(body);

  return NextResponse.json(note);
}
