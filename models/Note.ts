import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
  },
  { timestamps: true }
);

export default mongoose.models.Note ||
  mongoose.model("Note", NoteSchema);