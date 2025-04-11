import React, { useRef } from 'react';
import { Input } from '@telegram-apps/telegram-ui';
import { Icon24Search } from '@/icons/24/search';
import { Icon24Close } from '@/icons/24/close';
import { SearchPanelStyles } from './SearchPanelComponents';
import { SearchPanelBase } from './SearchPanelBase';

interface ActiveSearchPanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  shadowReferenceElement?: React.RefObject<HTMLElement>;
}

export const ActiveSearchPanel: React.FC<ActiveSearchPanelProps> = ({
  searchQuery,
  onSearchChange,
  shadowReferenceElement
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchClear = () => {
    onSearchChange('');
    inputRef.current?.focus();
  };

  return (
    <SearchPanelBase
      dataAttr="active"
      shadowReferenceElement={shadowReferenceElement}
    >
      <SearchPanelStyles />

      <div className="flex-1 px-3">
        <Input
          ref={inputRef}
          placeholder="Поиск сообществ..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search"
          before={
            <Icon24Search
              className="search-icon-transition"
              style={{
                color: 'var(--tgui--hint_color)'
              }}
            />
          }
          after={searchQuery && (
            <div
              style={{
                display: 'flex',
                position: 'relative',
                zIndex: 20,
                cursor: 'pointer'
              }}
              onClick={handleSearchClear}
              aria-label="Clear search"
            >
              <Icon24Close style={{ color: 'var(--tgui--section_fg_color)' }} />
            </div>
          )}
        />
      </div>
    </SearchPanelBase>
  );
};
