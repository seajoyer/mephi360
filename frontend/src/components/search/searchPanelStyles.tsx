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

    /* Filter button styling */
    .filter-button {
      width: 100%;
      max-width: 100%;
      overflow: hidden;
    }

    /* Force buttons to fill their containers in static layout */
    .static-container .filter-button,
    .static-item > .filter-button {
      width: 100% !important;
      min-width: 0 !important;
    }

    /* Fix for grid layout in static mode */
    .static-container {
      width: 100% !important;
      display: grid !important;
    }

    /* ENHANCED SCROLLING SUPPORT */
    /* Remove scrollbars but maintain scrollability */
    .scrollable-container::-webkit-scrollbar,
    [data-searchpanel] *::-webkit-scrollbar {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
    }

    /* Ensure proper scrolling behavior */
    .scrollable-container,
    [data-searchpanel] .scrollable-container {
      -ms-overflow-style: none !important;
      scrollbar-width: none !important;
      -webkit-overflow-scrolling: touch !important;
      overflow-x: auto !important;
      overflow-y: hidden !important;
      scroll-behavior: smooth !important;
      touch-action: pan-x !important;
      width: 100% !important;
      max-width: 100vw !important;

      /* Force horizontal scrolling */
      overflow-wrap: normal !important;
      flex-wrap: nowrap !important;
      white-space: nowrap !important;

      /* Add overscroll to ensure scrolling to the end */
      padding-right: 20px !important;
      margin-right: -20px !important;
    }

    /* Make sure scrollable items don't shrink */
    .scrollable-item {
      flex: 0 0 auto !important;
      display: inline-block !important;
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
    .flex-1,
    .filter-container {
      transition: width 0.2s ease-in-out, max-width 0.2s ease-in-out,
                 flex 0.2s ease-in-out, opacity 0.2s ease-in-out,
                 margin 0.2s ease-in-out;
    }

    /* Ensure container flex grows properly during transitions */
    [data-searchpanel] .flex {
      width: 100%;
      align-items: center;
      justify-content: flex-start;
    }

    /* Fix for iOS/Safari scrolling issues */
    @supports (-webkit-touch-callout: none) {
      .scrollable-container {
        -webkit-padding-before: 1px;
        -webkit-padding-after: 1px;
        -webkit-overflow-scrolling: touch !important;
      }
    }
  `}</style>
);
