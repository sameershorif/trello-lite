// src/pages/BoardView.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/api";
import TaskModal from "../components/TaskModal";

type Task = {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority?: number;
  dueDate?: string; // ISO string
  order?: number;
  board: string;
};

const STATUSES: Task["status"][] = ["todo", "in-progress", "done"];

export default function BoardView() {
  const { id: boardId } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [selected, setSelected] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const grouped = useMemo(
    () => ({
      "todo": tasks.filter((t) => t.status === "todo"),
      "in-progress": tasks.filter((t) => t.status === "in-progress"),
      "done": tasks.filter((t) => t.status === "done"),
    }),
    [tasks]
  );

  async function load() {
    if (!boardId) return;
    setErr("");
    setLoading(true);
    try {
      const res = await api.get(`/tasks/board/${boardId}`);
      setTasks(res.data);
    } catch (e: any) {
      setErr(e?.response?.data?.error || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [boardId]);

  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !boardId) return;
    setErr("");
    try {
      await api.post("/tasks", { board: boardId, title, status: "todo" });
      setTitle("");
      await load();
    } catch (e: any) {
      setErr(e?.response?.data?.error || "Failed to create task");
    }
  }

  async function move(taskId: string, next: Task["status"]) {
    try {
      // optimistic update
      setTasks((ts) => ts.map((t) => (t._id === taskId ? { ...t, status: next } : t)));
      await api.put(`/tasks/${taskId}`, { status: next });
    } catch (e: any) {
      setErr(e?.response?.data?.error || "Failed to move task");
      load();
    }
  }

  async function destroy(taskId: string) {
    try {
      setTasks((ts) => ts.filter((t) => t._id !== taskId));
      await api.delete(`/tasks/${taskId}`);
    } catch (e: any) {
      setErr(e?.response?.data?.error || "Failed to delete task");
      load();
    }
  }

  return (
    <div>
      <nav>
        <Link to="/boards">← Back</Link>
      </nav>

      <h1>Board</h1>

      <form onSubmit={createTask}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task title"
        />
        <button type="submit">Add</button>
      </form>

      {err && <p>{err}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div>
          {STATUSES.map((st) => (
            <section key={st}>
              <h3>{st.replace("-", " ")}</h3>
              <ul>
                {grouped[st].map((task) => (
                  <li key={task._id} onClick={() => setSelected(task)}>
                    <div>
                      <strong>{task.title}</strong>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); destroy(task._id); }}
                        aria-label="Delete task"
                      >
                        Delete
                      </button>
                    </div>
                    <div>
                      {task.status}
                      {typeof task.priority === "number" ? ` • P${task.priority}` : ""}
                      {task.dueDate ? ` • due ${task.dueDate.slice(0, 10)}` : ""}
                    </div>
                    <div>
                      {STATUSES
                        .filter((s) => s !== task.status)
                        .map((next) => (
                          <button
                            key={next}
                            type="button"
                            onClick={(e) => { e.stopPropagation(); move(task._id, next); }}
                          >
                            Move to {next.replace("-", " ")}
                          </button>
                        ))}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {selected && (
        <TaskModal
          task={selected}
          onClose={() => setSelected(null)}
          onSaved={(updated) =>
            setTasks((ts) => ts.map((t) => (t._id === updated._id ? updated : t)))
          }
          onDeleted={(id) => setTasks((ts) => ts.filter((t) => t._id !== id))}
        />
      )}
    </div>
  );
}
