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

    /* Input field transition styling */
    .tgui-0f5050defacbf813 {
      transition: padding 0.2s ease-in-out;
    }

    /* Apply specific padding only when input is collapsed (max-width: 42px) */
    .search-input-collapsed .tgui-0f5050defacbf813 {
      padding: var(--input-padding, 10px);
    }

    /* Filter button styling */
    .filter-button {
      width: 100%;
      max-width: 100%;
      overflow: hidden;
      transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
    }

    /* Filter container transition */
    .filter-container {
      transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out, max-height 0.2s ease-in-out, visibility 0.2s ease-in-out !important;
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
    }

    .institute-button-animate-first {
      animation: 0.2s ease-in-out forwards;
    }

    /* Institute container transition */
    .institute-container {
      transition: all 0.2s ease-in-out !important;
    }

    @keyframes fadeSlideIn {
      0% {
        opacity: 0;
        transform: translateX(-4px);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `}</style>
);
