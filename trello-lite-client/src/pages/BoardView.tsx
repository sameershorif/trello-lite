import { useParams } from "react-router-dom";

export default function BoardView() {
  const { id } = useParams();
  return (
    <div style={{padding:16}}>
      <a href="/boards">← Back</a>
      <h1>Board {id}</h1>
      <p>Board details & tasks will appear here.</p>
    </div>
  );
}
