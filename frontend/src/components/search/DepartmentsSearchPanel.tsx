import React, { useRef } from 'react';
import { Input } from '@telegram-apps/telegram-ui';
import { Icon24Search } from '@/icons/24/search';
import { Icon24Close } from '@/icons/24/close';
import { SearchPanelStyles } from './SearchPanelComponents';

interface DepartmentsSearchPanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const DepartmentsSearchPanel: React.FC<DepartmentsSearchPanelProps> = ({
  searchQuery,
  onSearchChange
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleSearchCollapse = () => {
    onSearchChange('');
  };

  return (
    <div
      ref={panelRef}
      className={`search-panel`}
      data-searchpanel="departments"
    >
      <SearchPanelStyles />

      <div className="flex-1">
        <Input
          ref={inputRef}
          placeholder="Грибоведение..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search"
          before={
            <Icon24Search
              style={{
                color: 'var(--tgui--hint_color)'
              }}
            />
          }
          after={
            searchQuery ? (
              <div
                style={{
                  display: 'flex',
                  position: 'relative',
                  zIndex: 20,
                  cursor: 'pointer'
                }}
                onClick={handleSearchCollapse}
                aria-label="Clear search"
              >
                <Icon24Close style={{ color: 'var(--tgui--section_fg_color)' }} />
              </div>
            ) : null
          }
        />
      </div>
    </div>
  );
};
