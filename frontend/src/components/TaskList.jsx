import TaskItem from './TaskItem';

export default function TaskList({ tasks, onToggle, onDelete }) {
    if (!tasks.length) return <div className="card">No tasks yet.</div>;
    return (
        <div className="grid">
            {tasks.map(t => (
                <TaskItem key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} />
            ))}
        </div>
    );
}
