import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@telegram-apps/telegram-ui';
import { Icon24Iyafit } from '@/icons/24/iyafit';
import { Icon24Laplas } from '@/icons/24/laplas';
import { Icon24Ifib } from '@/icons/24/ifib';
import { Icon24Intel } from '@/icons/24/intel';
import { Icon24Iiks } from '@/icons/24/iiks';
import { Icon24Iftis } from '@/icons/24/iftis';
import { Icon24Ifteb } from '@/icons/24/ifteb';
import { Icon24Imo } from '@/icons/24/imo';
import { Icon24Fbiuks } from '@/icons/24/fbiuks';

// Define the institutes data with their icons and IDs
const INSTITUTES = [
    { id: 'ИЯФИТ', Icon: Icon24Iyafit },
    { id: 'ЛаПлаз', Icon: Icon24Laplas },
    { id: 'ИФИБ', Icon: Icon24Ifib },
    { id: 'ИНТЭЛ', Icon: Icon24Intel },
    { id: 'ИИКС', Icon: Icon24Iiks },
    { id: 'ИФТИС', Icon: Icon24Iftis },
    { id: 'ИФТЭБ', Icon: Icon24Ifteb },
    { id: 'ИМО', Icon: Icon24Imo },
    { id: 'ФБИУКС', Icon: Icon24Fbiuks },
];

interface InstitutesPanelProps {
    activeInstitute: string | null;
    onInstituteChange: (institute: string | null) => void;
}

export const InstitutesPanel: React.FC<InstitutesPanelProps> = ({
    activeInstitute,
    onInstituteChange
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isScrollable, setIsScrollable] = useState(false);

    // Check if panel is scrollable
    useEffect(() => {
        const checkScrollable = () => {
            if (!containerRef.current || !contentRef.current) return;

            const containerWidth = containerRef.current.clientWidth;
            const contentWidth = contentRef.current.scrollWidth;
            setIsScrollable(contentWidth > containerWidth);
        };

        checkScrollable();

        // Set up resize observer
        if (typeof ResizeObserver !== 'undefined' && containerRef.current && contentRef.current) {
            const resizeObserver = new ResizeObserver(checkScrollable);
            resizeObserver.observe(containerRef.current);
            resizeObserver.observe(contentRef.current);
            return () => resizeObserver.disconnect();
        } else {
            // Fallback
            window.addEventListener('resize', checkScrollable);
            return () => window.removeEventListener('resize', checkScrollable);
        }
    }, []);

    return (
        <div
            className="sticky top-0 z-10 pt-1 pb-1"
            style={{ backgroundColor: 'var(--tgui--secondary_bg_color)' }}
        >
            {/* Hide scrollbar CSS */}
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            <div
                ref={containerRef}
                className="no-scrollbar overflow-x-auto"
                style={{
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                <div
                    ref={contentRef}
                    className="flex gap-2"
                    style={{
                        width: isScrollable ? 'max-content' : '100%'
                    }}
                >
                    {INSTITUTES.map((institute) => {
                        const isActive = activeInstitute === institute.id;
                        return (
                            <Button
                                key={institute.id}
                                mode={isActive ? 'bezeled' : 'gray'}
                                size="m"
                                style={{
                                    flex: isScrollable ? '0 0 auto' : '1 1 0',
                                    justifyContent: 'center',
                                    padding: '8px',
                                }}
                                onClick={() => {
                                    if (isActive) {
                                        onInstituteChange(null);
                                    } else {
                                        onInstituteChange(institute.id);
                                    }
                                }}
                            >
                                <institute.Icon />
                            </Button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
