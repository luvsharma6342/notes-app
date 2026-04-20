import { connectDB } from "@/lib/mongodb";
import Note from "@/models/Note";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const { id } = await context.params;
  const body = await req.json();

  const updatedNote = await Note.findByIdAndUpdate(
    id,
    {
      title: body.title,
      description: body.description,
    },
    { new: true },
  );

  return NextResponse.json(updatedNote);
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const { id } = await context.params;

  await Note.findByIdAndDelete(id);

  return NextResponse.json({
    success: true,
  });
}
