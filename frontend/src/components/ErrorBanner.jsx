export default function ErrorBanner({ message, onRetry }) {
    if (!message) return null;
    return (
        <div className="card" style={{ borderColor: '#ef4444' }}>
            <strong style={{ color: '#ef4444' }}>Error:</strong> {message}
            {onRetry && (
                <div style={{ marginTop: 8 }}>
                    <button className="primary" onClick={onRetry}>Retry</button>
                </div>
            )}
        </div>
    );
}
