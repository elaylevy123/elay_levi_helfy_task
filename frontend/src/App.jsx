import { useEffect, useMemo, useState, useCallback } from 'react';
import './styles/index.css';

import ThemeToggle from './components/ThemeToggle';
import Loading from './components/Loading';
import ErrorBanner from './components/ErrorBanner';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Carousel from './components/Carousel';
import FiltersBar from './components/FiltersBar';

import { storage } from './services/storage';
import {
    getTasks,
    createTask as apiCreateTask,
    toggleTask as apiToggleTask,
    deleteTask as apiDeleteTask,
} from './services/api';

const DEFAULT_FILTERS = {
    q: '',
    completed: '',
    priority: '',
    sortBy: 'createdAt',
    order: 'desc',
    dueAfter: '',
    dueBefore: '',
};

export default function App() {
    const [filters, setFilters] = useState(() => storage.getFilters() || DEFAULT_FILTERS);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');

    const load = useCallback(async (activeFilters = filters) => {
        setLoading(true);
        setErr('');
        try {
            const params = {
                q: activeFilters.q || undefined,
                completed:
                    activeFilters.completed === '' ? undefined : activeFilters.completed,
                priority: activeFilters.priority || undefined,
                dueAfter: activeFilters.dueAfter || undefined,
                dueBefore: activeFilters.dueBefore || undefined,
                sortBy: activeFilters.sortBy || 'createdAt',
                order: activeFilters.order || 'desc',
            };
            const data = await getTasks(params);
            setTasks(data);
        } catch (e) {
            setErr(e.message || 'Failed to load tasks');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Load on mount + whenever filters change
    useEffect(() => {
        storage.setFilters(filters);
        load(filters);
    }, [filters, load]);

    // Actions
    const handleCreate = async (payload) => {
        try {
            setLoading(true);
            await apiCreateTask(payload);
            await load(); // refresh
        } catch (e) {
            setErr(e.message || 'Failed to create');
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (id) => {
        try {
            // Optimistic UI
            setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
            await apiToggleTask(id);
        } catch (e) {
            setErr(e.message || 'Failed to toggle');
            // fallback: reload to sync state
            load();
        }
    };

    const handleDelete = async (id) => {
        try {
            // Optimistic UI
            setTasks(prev => prev.filter(t => t.id !== id));
            await apiDeleteTask(id);
        } catch (e) {
            setErr(e.message || 'Failed to delete');
            load();
        }
    };

    const resetFilters = () => setFilters(DEFAULT_FILTERS);

    // Carousel items: take a light card with title + due
    const carouselItems = useMemo(() => tasks.slice(0, 12), [tasks]);

    return (
        <div className="container">
            <header>
                <h2 style={{ margin: 0 }}>Task Manager</h2>
                <ThemeToggle />
            </header>

            <FiltersBar
                filters={filters}
                onChange={setFilters}
                onReset={resetFilters}
            />

            <TaskForm onCreate={handleCreate} />

            {err && <ErrorBanner message={err} onRetry={() => load()} />}
            {loading ? (
                <Loading />
            ) : (
                <>
                    <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
                    {!!carouselItems.length && (
                        <div style={{ marginTop: 16 }}>
                            <h3 style={{ margin: '12px 0' }}>Highlights</h3>
                            <Carousel
                                items={carouselItems}
                                speed={0.35}
                                renderItem={(t) => (
                                    <div className="card">
                                        <div style={{ fontWeight: 600, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {t.title}
                                        </div>
                                        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6, height: 38, overflow: 'hidden' }}>
                                            {t.description || '—'}
                                        </div>
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 999, border: '1px solid var(--border)', fontSize: 12, textTransform: 'uppercase' }}>
                        {t.priority}
                      </span>
                                            {t.dueDate && (
                                                <small style={{ color: 'var(--muted)' }}>
                                                    Due: {new Date(t.dueDate).toLocaleDateString()}
                                                </small>
                                            )}
                                        </div>
                                    </div>
                                )}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
