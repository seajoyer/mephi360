import React, { useEffect } from 'react';
import { List, Cell, Section } from '@telegram-apps/telegram-ui';
import { useNavigate, useLocation } from 'react-router-dom';

interface ModalOverlayProps {
  title: string;
  options: { id: string; name: string }[];
  selectedOption: string | null;
  onSelect: (option: string | null) => void;
  onClose: () => void;
  isVisible: boolean;
}

export const ModalOverlay: React.FC<ModalOverlayProps> = ({
  title,
  options,
  selectedOption,
  onSelect,
  onClose,
  isVisible
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Create a unique modal location when the overlay becomes visible
  useEffect(() => {
    if (isVisible) {
      // Push a dummy state to history that we can pop when closing the modal
      navigate(`${location.pathname}?modal=filter`, {
        replace: false, // Important: don't replace current history
        state: { isModal: true } // Mark this as a modal state
      });
    }
  }, [isVisible, navigate, location.pathname]);

  // Listen for navigation events that would close the modal
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // If our modal is open and navigation happens, close it
      if (isVisible && !event.state?.isModal) {
        onClose();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isVisible, onClose]);

  // Handle selection and close modal
  const handleSelect = (option: string | null) => {
    onSelect(option);
    onClose();

    // Navigate back to remove our modal URL
    navigate(-1);
  };

  // Don't render anything if not visible
  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        background: 'var(--tgui--bg_color)',
        overflow: 'auto'
      }}
    >
      <div style={{
        padding: '16px',
        borderBottom: '1px solid var(--tgui--divider)',
        fontWeight: 'bold',
        fontSize: '18px'
      }}>
        {title}
      </div>
      <List>
        <Section>
          {/* "All" option */}
          <Cell
            onClick={() => handleSelect(null)}
            after={selectedOption === null ? (
              <span style={{ color: 'var(--tgui--link_color)' }}>✓</span>
            ) : undefined}
          >
            Все
          </Cell>

          {options.map(option => (
            <Cell
              key={option.id}
              onClick={() => handleSelect(option.id)}
              after={selectedOption === option.id ? (
                <span style={{ color: 'var(--tgui--link_color)' }}>✓</span>
              ) : undefined}
            >
              {option.name}
            </Cell>
          ))}
        </Section>
      </List>
    </div>
  );
};
