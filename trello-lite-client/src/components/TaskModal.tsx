import { useEffect, useState } from "react";
import api from "../lib/api";

type Task = {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority?: number;
  dueDate?: string;
  board: string;
};

export default function TaskModal({
  task,
  onClose,
  onSaved,
  onDeleted,
}: {
  task: Task;
  onClose: () => void;
  onSaved: (t: Task) => void;
  onDeleted: (id: string) => void;
}) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState<Task["status"]>(task.status);
  const [priority, setPriority] = useState<number>(task.priority ?? 0);
  const [dueDate, setDueDate] = useState<string>(task.dueDate ? task.dueDate.substring(0,10) : "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status);
    setPriority(task.priority ?? 0);
    setDueDate(task.dueDate ? task.dueDate.substring(0,10) : "");
  }, [task]);

  const save = async () => {
    try {
      setSaving(true);
      setErr("");
      const payload = { title, description, status, priority, dueDate: dueDate || null };
      const res = await api.put(`/tasks/${task._id}`, payload);
      onSaved(res.data);
      onClose();
    } catch (e: any) {
      setErr(e?.response?.data?.error || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const destroy = async () => {
    if (!confirm("Delete this task?")) return;
    await api.delete(`/tasks/${task._id}`);
    onDeleted(task._id);
    onClose();
  };

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <h2 style={{margin:0}}>Edit Task</h2>
          <button onClick={onClose} title="Close" style={styles.iconBtn}>✖</button>
        </div>

        <div style={{display:"grid", gap:8, marginTop:12}}>
          <label>
            <div>Title</div>
            <input style={styles.input} value={title} onChange={e=>setTitle(e.target.value)} />
          </label>

          <label>
            <div>Description</div>
            <textarea style={styles.textarea} rows={4} value={description} onChange={e=>setDescription(e.target.value)} />
          </label>

          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8}}>
            <label>
              <div>Status</div>
              <select style={styles.input} value={status} onChange={e=>setStatus(e.target.value as Task["status"])}>
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </label>
            <label>
              <div>Priority</div>
              <input style={styles.input} type="number" min={0} max={2} value={priority}
                     onChange={e=>setPriority(Number(e.target.value))} />
            </label>
            <label>
              <div>Due date</div>
              <input style={styles.input} type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
            </label>
          </div>

          {err && <div style={{color:"red"}}>{err}</div>}

          <div style={{display:"flex", gap:8, marginTop:8}}>
            <button onClick={save} disabled={saving} style={styles.primaryBtn}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={destroy} style={styles.dangerBtn}>Delete</button>
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position:"fixed", inset:0, background:"rgba(0,0,0,.35)",
    display:"flex", alignItems:"center", justifyContent:"center", zIndex:50
  },
  modal: {
    background:"#fff", borderRadius:10, padding:16, width:"min(600px, 92vw)",
    boxShadow:"0 10px 30px rgba(0,0,0,.2)"
  },
  input: { width:"100%", padding:"8px 10px", border:"1px solid #ddd", borderRadius:6 },
  textarea: { width:"100%", padding:"8px 10px", border:"1px solid #ddd", borderRadius:6 },
  iconBtn: { border:"none", background:"transparent", cursor:"pointer", fontSize:18 },
  primaryBtn: { background:"#111", color:"#fff", border:"none", padding:"8px 12px", borderRadius:6, cursor:"pointer" },
  dangerBtn: { background:"#d33", color:"#fff", border:"none", padding:"8px 12px", borderRadius:6, cursor:"pointer" },
};
