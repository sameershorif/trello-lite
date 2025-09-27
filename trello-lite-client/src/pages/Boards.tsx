import { useEffect, useState } from "react";
import api from "../lib/api";

type Board = { _id: string; title: string };

export default function Boards() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [title, setTitle] = useState("");

  const load = async () => {
    const res = await api.get("/boards");
    setBoards(res.data);
  };

  const createBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await api.post("/boards", { title });
    setTitle("");
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div style={{ maxWidth: 640, margin: "40px auto", padding: 16 }}>
      <h1>Your Boards</h1>
      <form onSubmit={createBoard} style={{ display: "flex", gap: 8 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New board title"
          style={{ flex: 1 }}
        />
        <button>Create</button>
      </form>
      <ul>
        {boards.map((b) => (
          <li key={b._id}>{b.title}</li>
        ))}
      </ul>
    </div>
  );
}
