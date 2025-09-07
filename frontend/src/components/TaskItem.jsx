import styles from '../styles/TaskItem.module.css';

export default function TaskItem({ task, onToggle, onDelete }) {
    const createdLabel = new Date(task.createdAt).toLocaleString();
    const dueLabel = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : null;

    return (
        <div className={`card ${styles.item}`}>
            <input
                className={styles.check}
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggle(task.id)}
                title="Toggle completed"
            />
            <div>
                <div className={styles.header}>
                    <strong
                        className={`${styles.title} ${task.completed ? styles.titleCompleted : ''}`}
                        title={task.title}
                    >
                        {task.title}
                    </strong>
                </div>

                {task.description && (
                    <div className={styles.description}>{task.description}</div>
                )}

                <div className={styles.badges}>
                    <span className={styles.tag}>{task.priority}</span>
                    {dueLabel && <small className={styles.createdAt}>Due: {dueLabel}</small>}
                </div>
            </div>

            <div className={styles.meta}>
                <span className={styles.createdAt}>{createdLabel}</span>
                <button className={styles.btnDelete} onClick={() => onDelete(task.id)}>Delete</button>
            </div>
        </div>
    );
}
