import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthGuard } from "@/components/AuthGuard";
import { fetchLessons, fetchAllModules, createModule, updateModule, deleteModule } from "@/lib/api";
import type { Lesson, Module } from "@/types/supabase";
import { Plus, Pencil, Trash2, ArrowLeft, Save, X, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/admin/modules")({
  component: AdminModulesPage,
});

function AdminModulesPage() {
  return (
    <AuthGuard requireAdmin>
      <ModulesManager />
    </AuthGuard>
  );
}

type ModuleForm = {
  lesson_id: string;
  title: string;
  description: string;
  content: string;
  difficulty: "easy" | "medium" | "hard";
  estimated_minutes: number;
  order_index: number;
  is_published: boolean;
};

const emptyForm: ModuleForm = {
  lesson_id: "",
  title: "",
  description: "",
  content: "",
  difficulty: "easy",
  estimated_minutes: 15,
  order_index: 0,
  is_published: false,
};

function ModulesManager() {
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filterLesson, setFilterLesson] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ModuleForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [lessonsData, modulesData] = await Promise.all([fetchLessons(), fetchAllModules()]);
    if (lessonsData) setLessons(lessonsData);
    if (modulesData) setModules(modulesData);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const filteredModules = filterLesson === "all"
    ? modules
    : modules.filter((m) => m.lesson_id === filterLesson);

  const getLessonTitle = (lessonId: string) =>
    lessons.find((l) => l.id === lessonId)?.title || "Unknown";

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        const updated = await updateModule(editingId, form);
        if (updated) setModules((prev) => prev.map((m) => (m.id === editingId ? { ...m, ...updated } : m)));
      } else {
        const created = await createModule(form);
        if (created) setModules((prev) => [...prev, created]);
      }
      handleCancel();
    } catch (err) {
      console.error("Save error:", err);
    }
    setSaving(false);
  };

  const handleEdit = (mod: Module) => {
    setForm({
      lesson_id: mod.lesson_id,
      title: mod.title,
      description: mod.description,
      content: mod.content,
      difficulty: mod.difficulty,
      estimated_minutes: mod.estimated_minutes,
      order_index: mod.order_index,
      is_published: mod.is_published,
    });
    setEditingId(mod.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this module and all its questions?")) return;
    const success = await deleteModule(id);
    if (success) setModules((prev) => prev.filter((m) => m.id !== id));
  };

  const handleTogglePublish = async (mod: Module) => {
    const updated = await updateModule(mod.id, { is_published: !mod.is_published });
    if (updated) setModules((prev) => prev.map((m) => (m.id === mod.id ? { ...m, ...updated } : m)));
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
            <h1 className="font-display text-4xl font-black text-brand-ink">Manage Modules</h1>
            <p className="text-sm font-medium text-brand-ink/50">Create and edit learning modules with markdown content.</p>
          </div>
          <button
            onClick={() => { setForm({ ...emptyForm, order_index: filteredModules.length + 1, lesson_id: filterLesson !== "all" ? filterLesson : "" }); setEditingId(null); setShowForm(true); }}
            className="flex items-center gap-2 rounded-2xl bg-brand-blue px-6 py-3 font-bold text-white shadow-[3px_3px_0_rgba(45,45,45,0.12)] transition-transform hover:-translate-y-0.5"
          >
            <Plus size={20} strokeWidth={3} /> Add Module
          </button>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2 overflow-x-auto">
          <button onClick={() => setFilterLesson("all")} className={`shrink-0 rounded-full border-2 px-4 py-2 text-sm font-bold transition ${filterLesson === "all" ? "border-brand-ink bg-brand-purple text-brand-ink" : "border-brand-ink/12 bg-[#fff5cc] text-brand-ink/70"}`}>
            All Lessons
          </button>
          {lessons.map((l) => (
            <button key={l.id} onClick={() => setFilterLesson(l.id)} className={`shrink-0 rounded-full border-2 px-4 py-2 text-sm font-bold transition ${filterLesson === l.id ? "border-brand-ink bg-brand-purple text-brand-ink" : "border-brand-ink/12 bg-[#fff5cc] text-brand-ink/70"}`}>
              {l.title}
            </button>
          ))}
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8 rounded-2xl border-2 border-brand-blue/30 bg-white/90 p-6 shadow-sticker">
            <h2 className="mb-4 font-display text-2xl font-black text-brand-ink">
              {editingId ? "Edit Module" : "New Module"}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-bold text-brand-ink/70">Lesson</label>
                <select
                  value={form.lesson_id}
                  onChange={(e) => setForm({ ...form, lesson_id: e.target.value })}
                  className="h-12 w-full rounded-xl border-2 border-brand-ink/12 bg-[#fff8df] px-4 font-medium text-brand-ink outline-none focus:border-brand-purple"
                >
                  <option value="">Select lesson...</option>
                  {lessons.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-brand-ink/70">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-12 w-full rounded-xl border-2 border-brand-ink/12 bg-[#fff8df] px-4 font-medium text-brand-ink outline-none focus:border-brand-purple" placeholder="e.g., Grammar Basics" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-bold text-brand-ink/70">Description</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="h-12 w-full rounded-xl border-2 border-brand-ink/12 bg-[#fff8df] px-4 font-medium text-brand-ink outline-none focus:border-brand-purple" placeholder="Brief description..." />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-bold text-brand-ink/70">Content (Markdown)</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full rounded-xl border-2 border-brand-ink/12 bg-[#fff8df] p-4 font-mono text-sm text-brand-ink outline-none focus:border-brand-purple" rows={10} placeholder="# Module Title&#10;&#10;Write your module content in markdown..." />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-brand-ink/70">Difficulty</label>
                <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as "easy" | "medium" | "hard" })} className="h-12 w-full rounded-xl border-2 border-brand-ink/12 bg-[#fff8df] px-4 font-medium text-brand-ink outline-none focus:border-brand-purple">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-brand-ink/70">Est. Minutes</label>
                <input type="number" value={form.estimated_minutes} onChange={(e) => setForm({ ...form, estimated_minutes: parseInt(e.target.value) || 0 })} className="h-12 w-full rounded-xl border-2 border-brand-ink/12 bg-[#fff8df] px-4 font-medium text-brand-ink outline-none focus:border-brand-purple" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-brand-ink/70">Order</label>
                <input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })} className="h-12 w-full rounded-xl border-2 border-brand-ink/12 bg-[#fff8df] px-4 font-medium text-brand-ink outline-none focus:border-brand-purple" />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="h-5 w-5 accent-brand-teal" />
                  <span className="font-bold text-brand-ink/70">Published</span>
                </label>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={handleSave} disabled={saving || !form.title || !form.lesson_id} className="flex items-center gap-2 rounded-xl bg-brand-teal px-6 py-3 font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-50">
                <Save size={18} /> {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={handleCancel} className="flex items-center gap-2 rounded-xl border-2 border-brand-ink/15 px-6 py-3 font-bold text-brand-ink/70 hover:border-brand-ink/30">
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
        ) : filteredModules.length === 0 ? (
          <div className="rounded-2xl bg-[#fff5cc] p-8 text-center font-bold text-brand-ink/60 shadow-soft">
            No modules found. Click "Add Module" to create one.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredModules.map((mod) => (
              <div key={mod.id} className={`flex items-center gap-4 rounded-2xl bg-white/90 p-5 shadow-sticker ${!mod.is_published ? "opacity-60" : ""}`}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-brand-ink">{mod.title}</h3>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${mod.difficulty === "easy" ? "bg-brand-teal/15 text-brand-teal" : mod.difficulty === "medium" ? "bg-brand-orange/15 text-brand-orange" : "bg-brand-pink/15 text-brand-pink"}`}>
                      {mod.difficulty}
                    </span>
                    {!mod.is_published && (
                      <span className="rounded-full bg-brand-ink/10 px-2.5 py-0.5 text-xs font-bold text-brand-ink/50">Draft</span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-brand-ink/50">{getLessonTitle(mod.lesson_id)} · {mod.estimated_minutes} min · Order: {mod.order_index}</p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button onClick={() => handleTogglePublish(mod)} className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-brand-ink/10 text-brand-ink/50 hover:border-brand-teal hover:text-brand-teal" title={mod.is_published ? "Unpublish" : "Publish"}>
                    {mod.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button onClick={() => handleEdit(mod)} className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-brand-ink/10 text-brand-ink/50 hover:border-brand-blue hover:text-brand-blue" title="Edit">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(mod.id)} className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-brand-ink/10 text-brand-ink/50 hover:border-brand-pink hover:text-brand-pink" title="Delete">
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
