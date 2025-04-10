import React from 'react';

/**
 * Common styles for all search panels - applied globally to ensure consistent behavior
 */
export const SearchPanelGlobalStyles = () => (
  <style jsx global>{`
    /* Panel container */
    .search-panel {
      position: sticky;
      top: 0;
      z-index: 50;
      padding-top: 12px;
      padding-bottom: 12px;
      background-color: var(--tgui--secondary_bg_color);
      transition: box-shadow 0.2s ease-in-out;
      width: 100%;
      box-sizing: border-box;
      overflow-x: hidden;
    }

    .search-panel.sticky {
      box-shadow: 0 1px 0 var(--tgui--quartenary_bg_color);
    }

    /* Remove scrollbars while keeping scrollability */
    .no-scrollbar::-webkit-scrollbar,
    [data-searchpanel] *::-webkit-scrollbar {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
    }

    .no-scrollbar,
    [data-searchpanel] .scroll-container {
      -ms-overflow-style: none !important;
      scrollbar-width: none !important;
    }

    /* Enable touch-based scrolling on mobile */
    [data-searchpanel] .scroll-container {
      -webkit-overflow-scrolling: touch;
      cursor: grab;
      overflow-x: auto;
      scroll-behavior: smooth;
    }

    /* Search field transition styles */
    .tgui-8f04eff653cfa5e5, /* Input container */
    .tgui-0f5050defacbf813 { /* Input wrapper */
      transition: all 0.2s ease-in-out !important;
    }

    /* Center icon when in collapsed state */
    .translate-x-\\[calc\\(50\\%-12px\\)\\] {
      transform: translateX(calc(50% - 12px));
      transition: transform 0.2s ease-in-out;
    }

    /* Smooth width transitions */
    .flex-shrink-0,
    .flex-1 {
      transition: width 0.2s ease-in-out, flex 0.2s ease-in-out;
    }
  `}</style>
);
