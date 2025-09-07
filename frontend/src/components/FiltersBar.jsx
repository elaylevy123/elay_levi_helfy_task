import { useCallback } from 'react';
import styles from '../styles/FiltersBar.module.css';

const DEFAULTS = {
    q: '',
    completed: '',
    priority: '',
    sortBy: 'createdAt',
    order: 'desc',
    dueAfter: '',
    dueBefore: '',
};

export default function FiltersBar({ filters, onChange, onReset }) {
    const set = useCallback((key, val) => {
        onChange({ ...filters, [key]: val });
    }, [filters, onChange]);

    return (
        <div className={`card ${styles.filtersBar}`}>
            <div className={styles.container}>
                <div className={styles.row}>
                    <input
                        className={styles.input}
                        placeholder="Search (title/description)"
                        value={filters.q ?? DEFAULTS.q}
                        onChange={e => set('q', e.target.value)}
                    />
                    <select
                        className={styles.select}
                        value={filters.completed ?? DEFAULTS.completed}
                        onChange={e => set('completed', e.target.value)}
                    >
                        <option value="">Completed: any</option>
                        <option value="true">Completed</option>
                        <option value="false">Not completed</option>
                    </select>
                </div>

                <div className={styles.row}>
                    <select
                        className={styles.select}
                        value={filters.priority ?? DEFAULTS.priority}
                        onChange={e => set('priority', e.target.value)}
                    >
                        <option value="">Priority: any</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>

                    <div className={styles.dateRow}>
                        <div className={styles.field}>
                            <label className={styles.label}>Due after</label>
                            <input
                                className={styles.input}
                                type="date"
                                value={filters.dueAfter ?? DEFAULTS.dueAfter}
                                onChange={e => set('dueAfter', e.target.value)}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Due before</label>
                            <input
                                className={styles.input}
                                type="date"
                                value={filters.dueBefore ?? DEFAULTS.dueBefore}
                                onChange={e => set('dueBefore', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.row}>
                    <select
                        className={styles.select}
                        value={filters.sortBy ?? DEFAULTS.sortBy}
                        onChange={e => set('sortBy', e.target.value)}
                    >
                        <option value="createdAt">Sort by: Created date</option>
                        <option value="title">Title</option>
                        <option value="priority">Priority</option>
                        <option value="dueDate">Due date</option>
                    </select>
                    <select
                        className={styles.select}
                        value={filters.order ?? DEFAULTS.order}
                        onChange={e => set('order', e.target.value)}
                    >
                        <option value="desc">Order: Descending</option>
                        <option value="asc">Order: Ascending</option>
                    </select>
                </div>

                <div className={styles.actions}>
                    <button className={styles.resetButton} onClick={onReset}>
                        Reset Filters
                    </button>
                </div>
            </div>
        </div>
    );
}