/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [notes, setNotes] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState("");

  async function fetchNotes() {
    setLoading(true);

    try {
      const res = await fetch("/api/notes");
      const data = await res.json();
      setNotes(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadNotes() {
      setLoading(true);

      try {
        const res = await fetch("/api/notes");
        const data = await res.json();
        setNotes(data);
      } finally {
        setLoading(false);
      }
    }

    loadNotes();
  }, []);

  async function handleSubmit() {
    if (!title || !description) return;

    setLoading(true);

    try {
      if (editId) {
        await fetch(`/api/notes/${editId}`, {
          method: "PUT",
          body: JSON.stringify({
            title,
            description,
          }),
        });

        setEditId("");
      } else {
        await fetch("/api/notes", {
          method: "POST",
          body: JSON.stringify({
            title,
            description,
          }),
        });
      }

      setTitle("");
      setDescription("");

      await fetchNotes();
    } finally {
      setLoading(false);
    }
  }

  async function deleteNote(id: string) {
    setLoading(true);

    try {
      await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      await fetchNotes();
    } finally {
      setLoading(false);
    }
  }

  const filtered = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-cyan-400 font-medium tracking-widest uppercase text-sm mb-2">
            Productivity App
          </p>

          <h1 className="text-5xl font-bold mb-3 bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Mini Notes App
          </h1>

          <p className="text-slate-400">
            Save ideas, manage tasks, organize thoughts.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl mb-8">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              className="w-full bg-slate-900/70 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 transition"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <input
              className="w-full bg-slate-900/70 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 transition"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <textarea
            rows={4}
            className="w-full bg-slate-900/70 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 transition resize-none mb-4"
            placeholder="Write your description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 rounded-xl font-semibold bg-linear-to-r cursor-pointer from-cyan-500 to-blue-600 hover:scale-105 transition duration-200 shadow-lg disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : editId
                  ? "Update Note"
                  : "Create Note"}
            </button>

            {editId && (
              <button
                onClick={() => {
                  setEditId("");
                  setTitle("");
                  setDescription("");
                }}
                className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 transition cursor-pointer"
              >
                Cancel Edit
              </button>
            )}

            <span className="text-slate-400 text-sm">
              {notes.length} total notes
            </span>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mb-6 text-center text-cyan-400 animate-pulse">
            Loading notes...
          </div>
        )}

        {/* Notes Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-700 rounded-3xl text-slate-400">
            No notes found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {filtered.map((note) => (
              <div
                key={note._id}
                className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-cyan-400/40 hover:-translate-y-1 transition duration-300 shadow-xl"
              >
                <div className="flex justify-between items-start gap-3 mb-3">
                  <h2 className="text-2xl font-bold wrap-break-word">
                    {note.title}
                  </h2>

                  <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-300">
                    Note
                  </span>
                </div>

                <p className="text-slate-300 leading-relaxed mb-4 whitespace-pre-line">
                  {note.description}
                </p>

                <p className="text-xs text-slate-500 mb-5">
                  {new Date(note.createdAt).toLocaleString()}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setTitle(note.title);
                      setDescription(note.description);
                      setEditId(note._id);
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}
                    className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 cursor-pointer text-black font-semibold transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteNote(note._id)}
                    className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 font-semibold transition cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}