import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthGuard } from "@/components/AuthGuard";
import { fetchAllQuestions, fetchAllModules, fetchQuizzes, createQuestion, updateQuestion, deleteQuestion } from "@/lib/api";
import type { Question, Module, Quiz } from "@/types/supabase";
import type { QuestionOption } from "@/types/supabase";
import { Plus, Pencil, Trash2, ArrowLeft, Save, X, Check } from "lucide-react";

export const Route = createFileRoute("/admin/questions")({
  component: AdminQuestionsPage,
});

function AdminQuestionsPage() {
  return (
    <AuthGuard requireAdmin>
      <QuestionsManager />
    </AuthGuard>
  );
}

type QuestionForm = {
  quiz_id: string;
  module_id: string;
  text: string;
  options: QuestionOption[];
  explanation: string;
  order_index: number;
};

const emptyOption = (): QuestionOption => ({ id: "", text: "", is_correct: false });

const emptyForm: QuestionForm = {
  quiz_id: "",
  module_id: "",
  text: "",
  options: [
    { id: "A", text: "", is_correct: false },
    { id: "B", text: "", is_correct: false },
    { id: "C", text: "", is_correct: false },
    { id: "D", text: "", is_correct: false },
  ],
  explanation: "",
  order_index: 0,
};

function QuestionsManager() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filterType, setFilterType] = useState<"all" | "module" | "quiz">("all");
  const [filterId, setFilterId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<QuestionForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [questionsData, modulesData, quizzesData] = await Promise.all([
      fetchAllQuestions(),
      fetchAllModules(),
      fetchQuizzes(),
    ]);
    if (questionsData) setQuestions(questionsData);
    if (modulesData) setModules(modulesData);
    if (quizzesData) setQuizzes(quizzesData);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const filteredQuestions = questions.filter((q) => {
    if (filterType === "all") return true;
    if (filterType === "module" && filterId) return q.module_id === filterId;
    if (filterType === "quiz" && filterId) return q.quiz_id === filterId;
    return true;
  });

  const getParentLabel = (q: Question) => {
    if (q.module_id) {
      const mod = modules.find((m) => m.id === q.module_id);
      return mod ? `Module: ${mod.title}` : "Module (unknown)";
    }
    if (q.quiz_id) {
      const quiz = quizzes.find((qz) => qz.id === q.quiz_id);
      return quiz ? `Quiz: ${quiz.title}` : "Quiz (unknown)";
    }
    return "Unlinked";
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        quiz_id: form.quiz_id || undefined,
        module_id: form.module_id || undefined,
        text: form.text,
        options: form.options,
        explanation: form.explanation,
        order_index: form.order_index,
      };

      if (editingId) {
        const updated = await updateQuestion(editingId, payload);
        if (updated) setQuestions((prev) => prev.map((q) => (q.id === editingId ? { ...q, ...updated } : q)));
      } else {
        const created = await createQuestion(payload);
        if (created) setQuestions((prev) => [...prev, created]);
      }
      handleCancel();
    } catch (err) {
      console.error("Save error:", err);
    }
    setSaving(false);
  };

  const handleEdit = (q: Question) => {
    setForm({
      quiz_id: q.quiz_id || "",
      module_id: q.module_id || "",
      text: q.text,
      options: q.options as QuestionOption[],
      explanation: q.explanation,
      order_index: q.order_index,
    });
    setEditingId(q.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    const success = await deleteQuestion(id);
    if (success) setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const updateOption = (idx: number, field: keyof QuestionOption, value: string | boolean) => {
    const newOptions = [...form.options];
    if (field === "is_correct" && value === true) {
      // Only one correct answer
      newOptions.forEach((o, i) => { o.is_correct = i === idx; });
    } else {
      (newOptions[idx] as any)[field] = value;
    }
    setForm({ ...form, options: newOptions });
  };

  const addOption = () => {
    const nextId = String.fromCharCode(65 + form.options.length); // A, B, C, D, E...
    setForm({ ...form, options: [...form.options, { id: nextId, text: "", is_correct: false }] });
  };

  const removeOption = (idx: number) => {
    if (form.options.length <= 2) return;
    setForm({ ...form, options: form.options.filter((_, i) => i !== idx) });
  };

  return (
    <main className="container-page pb-12 pt-4">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center gap-4">
          <Link to="/admin" className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-brand-ink/15 text-brand-ink/60 hover:border-brand-ink/30 hover:text-brand-ink">
            <ArrowLeft size={20} strokeWidth={3} />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-4xl font-black text-brand-ink">Manage Questions</h1>
            <p className="text-sm font-medium text-brand-ink/50">Create and edit multiple-choice questions.</p>
          </div>
          <button
            onClick={() => { setForm({ ...emptyForm, order_index: filteredQuestions.length + 1 }); setEditingId(null); setShowForm(true); }}
            className="flex items-center gap-2 rounded-2xl bg-brand-blue px-6 py-3 font-bold text-white shadow-[3px_3px_0_rgba(45,45,45,0.12)] transition-transform hover:-translate-y-0.5"
          >
            <Plus size={20} strokeWidth={3} /> Add Question
          </button>
        </div>

        {/* Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button onClick={() => { setFilterType("all"); setFilterId(""); }} className={`shrink-0 rounded-full border-2 px-4 py-2 text-sm font-bold transition ${filterType === "all" ? "border-brand-ink bg-brand-purple text-brand-ink" : "border-brand-ink/12 bg-[#fff5cc] text-brand-ink/70"}`}>
            All
          </button>
          {modules.map((m) => (
            <button key={m.id} onClick={() => { setFilterType("module"); setFilterId(m.id); }} className={`shrink-0 rounded-full border-2 px-4 py-2 text-sm font-bold transition ${filterType === "module" && filterId === m.id ? "border-brand-ink bg-brand-purple text-brand-ink" : "border-brand-ink/12 bg-[#fff5cc] text-brand-ink/70"}`}>
              📄 {m.title}
            </button>
          ))}
          {quizzes.map((qz) => (
            <button key={qz.id} onClick={() => { setFilterType("quiz"); setFilterId(qz.id); }} className={`shrink-0 rounded-full border-2 px-4 py-2 text-sm font-bold transition ${filterType === "quiz" && filterId === qz.id ? "border-brand-ink bg-brand-purple text-brand-ink" : "border-brand-ink/12 bg-[#fff5cc] text-brand-ink/70"}`}>
              📝 {qz.title}
            </button>
          ))}
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8 rounded-2xl border-2 border-brand-blue/30 bg-white/90 p-6 shadow-sticker">
            <h2 className="mb-4 font-display text-2xl font-black text-brand-ink">
              {editingId ? "Edit Question" : "New Question"}
            </h2>
            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-bold text-brand-ink/70">Assign to Module</label>
                  <select value={form.module_id} onChange={(e) => setForm({ ...form, module_id: e.target.value, quiz_id: "" })} className="h-12 w-full rounded-xl border-2 border-brand-ink/12 bg-[#fff8df] px-4 font-medium text-brand-ink outline-none focus:border-brand-purple">
                    <option value="">None</option>
                    {modules.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-brand-ink/70">Or assign to Quiz</label>
                  <select value={form.quiz_id} onChange={(e) => setForm({ ...form, quiz_id: e.target.value, module_id: "" })} className="h-12 w-full rounded-xl border-2 border-brand-ink/12 bg-[#fff8df] px-4 font-medium text-brand-ink outline-none focus:border-brand-purple">
                    <option value="">None</option>
                    {quizzes.map((qz) => <option key={qz.id} value={qz.id}>{qz.title}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-brand-ink/70">Question Text</label>
                <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} className="w-full rounded-xl border-2 border-brand-ink/12 bg-[#fff8df] p-4 font-medium text-brand-ink outline-none focus:border-brand-purple" rows={3} placeholder="Enter the question..." />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-brand-ink/70">Options (click ✓ to mark correct)</label>
                <div className="space-y-2">
                  {form.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateOption(idx, "is_correct", true)}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 font-bold transition ${opt.is_correct ? "border-brand-teal bg-brand-teal text-white" : "border-brand-ink/15 text-brand-ink/30 hover:border-brand-teal/50"}`}
                      >
                        {opt.is_correct ? <Check size={18} strokeWidth={3} /> : opt.id}
                      </button>
                      <input
                        value={opt.text}
                        onChange={(e) => updateOption(idx, "text", e.target.value)}
                        className="h-10 flex-1 rounded-xl border-2 border-brand-ink/12 bg-[#fff8df] px-3 text-sm font-medium text-brand-ink outline-none focus:border-brand-purple"
                        placeholder={`Option ${opt.id}...`}
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(idx)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-brand-ink/10 text-brand-ink/30 hover:border-brand-pink hover:text-brand-pink"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                {form.options.length < 6 && (
                  <button type="button" onClick={addOption} className="mt-2 text-sm font-bold text-brand-blue hover:underline">
                    + Add Option
                  </button>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-brand-ink/70">Explanation</label>
                <textarea value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} className="w-full rounded-xl border-2 border-brand-ink/12 bg-[#fff8df] p-4 font-medium text-brand-ink outline-none focus:border-brand-purple" rows={2} placeholder="Explain why the correct answer is correct..." />
              </div>

              <div className="w-32">
                <label className="mb-1 block text-sm font-bold text-brand-ink/70">Order</label>
                <input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })} className="h-12 w-full rounded-xl border-2 border-brand-ink/12 bg-[#fff8df] px-4 font-medium text-brand-ink outline-none focus:border-brand-purple" />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={handleSave} disabled={saving || !form.text || (!form.module_id && !form.quiz_id)} className="flex items-center gap-2 rounded-xl bg-brand-teal px-6 py-3 font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-50">
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
        ) : filteredQuestions.length === 0 ? (
          <div className="rounded-2xl bg-[#fff5cc] p-8 text-center font-bold text-brand-ink/60 shadow-soft">
            No questions found. Click "Add Question" to create one.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredQuestions.map((q) => {
              const opts = q.options as QuestionOption[];
              const correct = opts.find((o) => o.is_correct);
              return (
                <div key={q.id} className="rounded-2xl bg-white/90 p-5 shadow-sticker">
                  <div className="flex items-start gap-4">
                    <span className="shrink-0 rounded-lg bg-brand-ink/5 px-3 py-1 text-sm font-bold text-brand-ink/50">#{q.order_index}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-brand-ink">{q.text}</p>
                      <p className="mt-1 text-sm text-brand-ink/50">
                        {getParentLabel(q)} · Correct: {correct?.id || "?"} · {opts.length} options
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <button onClick={() => handleEdit(q)} className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-brand-ink/10 text-brand-ink/50 hover:border-brand-blue hover:text-brand-blue" title="Edit">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(q.id)} className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-brand-ink/10 text-brand-ink/50 hover:border-brand-pink hover:text-brand-pink" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
