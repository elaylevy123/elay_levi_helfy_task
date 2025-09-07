import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import styles from '../styles/Carousel.module.css';

export default function Carousel({ items = [], renderItem, speed = 0.35 }) {
    const trackRef = useRef(null);
    const pauseRef = useRef(false);
    const rafRef = useRef(0);
    const lastTsRef = useRef(0);
    const [hasOverflow, setHasOverflow] = useState(false);

    const baseLen = items.length;
    const viewItems = useMemo(() => {
        if (!baseLen) return [];

        return [...items, ...items, ...items];
    }, [items, baseLen]);

    const recomputeOverflow = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;
        setHasOverflow(track.scrollWidth > track.clientWidth + 4);
    }, []);

    useEffect(() => {
        const track = trackRef.current;
        if (!track || baseLen === 0) return;


        const sectionWidth = track.scrollWidth / 3;
        track.scrollLeft = sectionWidth;

        const onEnter = () => (pauseRef.current = true);
        const onLeave = () => (pauseRef.current = false);
        const onPointerDown = () => (pauseRef.current = true);
        const onPointerUp = () => (pauseRef.current = false);

        track.addEventListener('mouseenter', onEnter);
        track.addEventListener('mouseleave', onLeave);
        track.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointerup', onPointerUp);

        const loop = (ts) => {
            if (!lastTsRef.current) lastTsRef.current = ts;
            const dt = ts - lastTsRef.current;
            lastTsRef.current = ts;

            if (!pauseRef.current) {
                track.scrollLeft += speed * dt;

                if (track.scrollLeft >= sectionWidth * 2) track.scrollLeft -= sectionWidth;
                if (track.scrollLeft <= sectionWidth * 0.5) track.scrollLeft += sectionWidth;
            }
            rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);
        recomputeOverflow();

        const onResize = () => recomputeOverflow();
        window.addEventListener('resize', onResize);

        return () => {
            cancelAnimationFrame(rafRef.current);
            track.removeEventListener('mouseenter', onEnter);
            track.removeEventListener('mouseleave', onLeave);
            track.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('resize', onResize);
            lastTsRef.current = 0;
            pauseRef.current = false;
        };
    }, [baseLen, speed, recomputeOverflow]);


    const getItemStep = useCallback(() => {
        const track = trackRef.current;
        if (!track) return 260; // fallback
        const first = track.querySelector('.carousel-item');
        if (!first) return 260;
        const rect = first.getBoundingClientRect();
        const mr = parseFloat(getComputedStyle(first).marginRight || '0');
        return rect.width + mr;
    }, []);


    const scrollByStep = useCallback((dir = 1) => {
        const track = trackRef.current;
        if (!track) return;
        const step = getItemStep();
        pauseRef.current = true;
        track.scrollBy({ left: dir * step, behavior: 'smooth' });

        window.setTimeout(() => { pauseRef.current = false; }, 1200);
    }, [getItemStep]);

    if (!baseLen) return null;

    return (
        <div className={styles.wrapper}>

            <button
                type="button"
                className={`${styles.navBtn} ${styles.left} ${!hasOverflow ? styles.hidden : ''}`}
                aria-label="Previous"
                onClick={() => scrollByStep(-1)}
            >
                <span className={styles.icon}>‹</span>
            </button>

            <button
                type="button"
                className={`${styles.navBtn} ${styles.right} ${!hasOverflow ? styles.hidden : ''}`}
                aria-label="Next"
                onClick={() => scrollByStep(1)}
            >
                <span className={styles.icon}>›</span>
            </button>


            <div className="carousel-track" ref={trackRef}>
                {viewItems.map((item, idx) => (
                    <div className="carousel-item" key={idx}>
                        {renderItem ? renderItem(item) : <div className="card">{String(item)}</div>}
                    </div>
                ))}
            </div>
        </div>
    );
}
