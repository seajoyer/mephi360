import React from 'react';

/**
 * Common styles for all search panels with clean implementation
 */
export const SearchPanelGlobalStyles = () => (
  <style jsx global>{`
    /* Core sticky panel styles */
    .search-panel {
      position: sticky;
      top: 0;
      z-index: 200;
      padding: 12px 0;
      background-color: var(--tgui--secondary_bg_color);
      transition: box-shadow 0.2s ease-in-out;
      width: 100%;
    }

    /* Shadow when scrolled */
    .search-panel.has-shadow {
      box-shadow: 0 1px 0 var(--tgui--divider);
    }

    /* Filter button styling */
    .filter-button {
      width: 100%;
      max-width: 100%;
      overflow: hidden;
    }

    /* Force buttons to fill containers in static layout */
    .static-container .filter-button,
    .static-item > .filter-button {
      width: 100% !important;
      min-width: 0 !important;
    }

    /* Fix for grid layout in static mode */
    .static-container {
      width: 100%;
      display: grid;
    }

    /* No scrollbar but maintain scrollability */
    .scrollable-container::-webkit-scrollbar,
    .no-scrollbar::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }

    .scrollable-container,
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
      overflow-x: auto;
      overflow-y: hidden;
      scroll-behavior: smooth;
      touch-action: pan-x;
      width: 100%;
      white-space: nowrap;
    }

    /* Make sure scrollable items don't shrink */
    .scrollable-item {
      flex: 0 0 auto;
      display: inline-block;
    }

    /* Center icon when in collapsed state */
    .translate-x-\\[calc\\(50\\%-12px\\)\\] {
      transform: translateX(calc(50% - 12px));
      transition: transform 0.2s ease-in-out;
    }

    /* Search icon color transition */
    .search-icon-transition {
      transition: color 0.2s ease-in-out;
    }

/* Institute button animation */
    .institute-button-animate {
      animation: fadeSlideIn 0.2s ease-in-out forwards;
      opacity: 0;
      transform: translateY(5px);
    }

    .institute-button-animate-first {
      animation: fadeSlideIn 0.2s ease-in-out forwards;
      opacity: 0;
      transform: translateY(5px);
    }

    /* Institute container transition */
    .institute-container {
      transition: all 0.2s ease-in-out !important;
    }

    /* Add custom class for filter scroll container */
    .filter-scroll-container {
      overflow-x: auto !important;
      overflow-y: hidden !important;
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
      -webkit-overflow-scrolling: touch !important;
    }

    .filter-scroll-container::-webkit-scrollbar {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
    }

    /* Ensure buttons in scrollable filter container don't shrink */
    .filter-scroll-container > div {
      flex-shrink: 0 !important;
    }

    @keyframes fadeSlideIn {
      0% {
        opacity: 0;
        transform: translateY(5px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `}</style>
);
