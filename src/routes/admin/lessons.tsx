import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthGuard } from "@/components/AuthGuard";
import { fetchLessons, createLesson, updateLesson, deleteLesson } from "@/lib/api";
import type { Lesson } from "@/types/supabase";
import { Plus, Pencil, Trash2, ArrowLeft, ArrowUp, ArrowDown, Save, X } from "lucide-react";

export const Route = createFileRoute("/admin/lessons")({
  component: AdminLessonsPage,
});

function AdminLessonsPage() {
  return (
    <AuthGuard requireAdmin>
      <LessonsManager />
    </AuthGuard>
  );
}

type LessonForm = {
  title: string;
  description: string;
  icon: string;
  bg_color: string;
  order_index: number;
};

const emptyForm: LessonForm = {
  title: "",
  description: "",
  icon: "",
  bg_color: "bg-brand-blue",
  order_index: 0,
};

const bgColorOptions = [
  { value: "bg-brand-blue", label: "Blue" },
  { value: "bg-brand-pink", label: "Pink" },
  { value: "bg-brand-orange", label: "Orange" },
  { value: "bg-brand-yellow", label: "Yellow" },
  { value: "bg-brand-teal", label: "Teal" },
  { value: "bg-[#ff3f77]", label: "Red" },
];

function LessonsManager() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<LessonForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadLessons = async () => {
    setLoading(true);
    const data = await fetchLessons();
    if (data) setLessons(data);
    setLoading(false);
  };

  useEffect(() => {
    loadLessons();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        const updated = await updateLesson(editingId, form);
        if (updated) {
          setLessons((prev) => prev.map((l) => (l.id === editingId ? { ...l, ...updated } : l)));
        }
      } else {
        const created = await createLesson(form);
        if (created) {
          setLessons((prev) => [...prev, created]);
        }
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (err) {
      console.error("Save error:", err);
    }
    setSaving(false);
  };

  const handleEdit = (lesson: Lesson) => {
    setForm({
      title: lesson.title,
      description: lesson.description,
      icon: lesson.icon,
      bg_color: lesson.bg_color,
      order_index: lesson.order_index,
    });
    setEditingId(lesson.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lesson? All associated modules and questions will also be deleted.")) return;
    const success = await deleteLesson(id);
    if (success) {
      setLessons((prev) => prev.filter((l) => l.id !== id));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <main className="container-page pb-12 pt-4">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center gap-4">
          <Link to="/admin" className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-brand-ink/15 text-brand-ink/60 hover:border-brand-ink/30 hover:text-brand-ink">
            <ArrowLeft size={20} strokeWidth={3} />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-4xl font-black text-brand-ink">Manage Lessons</h1>
            <p className="text-sm font-medium text-brand-ink/50">Create, edit, reorder, and delete lesson categories.</p>
          </div>
          <button
            onClick={() => { setForm({ ...emptyForm, order_index: lessons.length + 1 }); setEditingId(null); setShowForm(true); }}
            className="flex items-center gap-2 rounded-2xl bg-brand-blue px-6 py-3 font-bold text-white shadow-[3px_3px_0_rgba(45,45,45,0.12)] transition-transform hover:-translate-y-0.5"
          >
            <Plus size={20} strokeWidth={3} /> Add Lesson
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8 rounded-2xl border-2 border-brand-blue/30 bg-white/90 p-6 shadow-sticker">
            <h2 className="mb-4 font-display text-2xl font-black text-brand-ink">
              {editingId ? "Edit Lesson" : "New Lesson"}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-bold text-brand-ink/70">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="h-12 w-full rounded-xl border-2 border-brand-ink/12 bg-[#fff8df] px-4 font-medium text-brand-ink outline-none focus:border-brand-purple"
                  placeholder="e.g., English"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-brand-ink/70">Icon (2 chars)</label>
                <input
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value.slice(0, 3) })}
                  className="h-12 w-full rounded-xl border-2 border-brand-ink/12 bg-[#fff8df] px-4 font-medium text-brand-ink outline-none focus:border-brand-purple"
                  placeholder="e.g., En"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-bold text-brand-ink/70">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-xl border-2 border-brand-ink/12 bg-[#fff8df] p-4 font-medium text-brand-ink outline-none focus:border-brand-purple"
                  rows={2}
                  placeholder="Brief description of this lesson category..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-brand-ink/70">Background Color</label>
                <div className="flex flex-wrap gap-2">
                  {bgColorOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm({ ...form, bg_color: opt.value })}
                      className={`${opt.value} rounded-xl px-4 py-2 text-sm font-bold text-white transition-transform ${
                        form.bg_color === opt.value ? "scale-110 ring-2 ring-brand-ink ring-offset-2" : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-brand-ink/70">Order Index</label>
                <input
                  type="number"
                  value={form.order_index}
                  onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })}
                  className="h-12 w-full rounded-xl border-2 border-brand-ink/12 bg-[#fff8df] px-4 font-medium text-brand-ink outline-none focus:border-brand-purple"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving || !form.title}
                className="flex items-center gap-2 rounded-xl bg-brand-teal px-6 py-3 font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                <Save size={18} /> {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 rounded-xl border-2 border-brand-ink/15 px-6 py-3 font-bold text-brand-ink/70 hover:border-brand-ink/30"
              >
                <X size={18} /> Cancel
              </button>
            </div>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-ink/20 border-t-brand-blue" />
          </div>
        ) : lessons.length === 0 ? (
          <div className="rounded-2xl bg-[#fff5cc] p-8 text-center font-bold text-brand-ink/60 shadow-soft">
            No lessons yet. Click "Add Lesson" to create your first one.
          </div>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson, idx) => (
              <div
                key={lesson.id}
                className="flex items-center gap-4 rounded-2xl bg-white/90 p-5 shadow-sticker"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${lesson.bg_color} font-black text-white shadow-[2px_2px_0_rgba(45,45,45,0.1)]`}>
                  {lesson.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-bold text-brand-ink">{lesson.title}</h3>
                  <p className="truncate text-sm font-medium text-brand-ink/50">{lesson.description}</p>
                </div>
                <span className="shrink-0 text-sm font-bold text-brand-ink/40">#{lesson.order_index}</span>
                <div className="flex shrink-0 gap-1.5">
                  <button
                    onClick={() => handleEdit(lesson)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-brand-ink/10 text-brand-ink/50 hover:border-brand-blue hover:text-brand-blue"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(lesson.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-brand-ink/10 text-brand-ink/50 hover:border-brand-pink hover:text-brand-pink"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
