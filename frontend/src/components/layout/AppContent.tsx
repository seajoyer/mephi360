import React from 'react';
import { useLocation } from 'react-router-dom';
import { TabBar } from '@/components/layout/TabBar';
import { AddButton } from '@/components/common/AddButton';
import { useAddingPage } from '@/contexts/AddingPageContext';

interface AppContentProps {
  children: React.ReactNode;
}

export const AppContent: React.FC<AppContentProps> = ({ children }) => {
  const location = useLocation();
  const isAddingPage = location.pathname === '/add';
  const { handleSubmit, isFormValid } = useAddingPage();

  return (
    <div className="app-container relative">
      <div className="app-content">
        {children}
      </div>

      {/* Conditionally render either TabBar or AddButton based on the current route */}
      {!isAddingPage ? (
        <TabBar />
      ) : (
        <AddButton onClick={handleSubmit} disabled={!isFormValid} />
      )}
    </div>
  );
};
