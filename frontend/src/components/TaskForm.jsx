import { useState } from 'react';
import styles from '../styles/TaskForm.module.css';

export default function TaskForm({ onCreate }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState('');

    const disabled = !title.trim();

    async function handleSubmit(e) {
        e.preventDefault();
        await onCreate({
            title: title.trim(),
            description: description.trim(),
            priority,

            dueDate: dueDate ? dueDate : null,
        });
        // ניקוי הטופס
        setTitle('');
        setDescription('');
        setPriority('medium');
        setDueDate('');
    }

    return (
        <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
            <div className={styles.container}>
                <input
                    className={styles.input}
                    placeholder="Title *"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <textarea
                    className={styles.textarea}
                    placeholder="Description"
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
                <div className={styles.row}>
                    <div className={styles.field}>
                        <label className={styles.label}>Priority</label>
                        <select
                            className={styles.select}
                            value={priority}
                            onChange={e => setPriority(e.target.value)}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Due date</label>
                        <input
                            className={styles.input}
                            type="date"
                            value={dueDate}
                            onChange={e => setDueDate(e.target.value)}
                        />
                    </div>
                </div>
                <button className={`${styles.submitButton} primary`} disabled={disabled}>
                    Create Task
                </button>
            </div>
        </form>
    );
}