import React, { createContext, useContext, useState, ReactNode } from 'react';

// Form types
export type EntityType = 'Teacher' | 'Department' | 'Club' | 'Circle' | 'Active' | 'Stuff';

// Context type definition
interface AddingPageContextType {
  entityType: EntityType;
  setEntityType: (type: EntityType) => void;
  formData: { [key: string]: any };
  updateFormData: (data: { [key: string]: any }) => void;
  handleSubmit: () => void;
  isFormValid: boolean;
  setIsFormValid: (valid: boolean) => void;
}

// Create context with default values
const AddingPageContext = createContext<AddingPageContextType | undefined>(undefined);

// Provider component
export const AddingPageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [entityType, setEntityType] = useState<EntityType>('Teacher');
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Update form data
  const updateFormData = (data: { [key: string]: any }) => {
    setFormData(prevData => ({ ...prevData, ...data }));
  };

  // Handle form submission based on entity type
  const handleSubmit = () => {
    if (!isFormValid) return;

    console.log(`Submitting ${entityType} form with data:`, formData);

    // Here you would typically make an API call to save the data
    switch (entityType) {
      case 'Teacher':
        // Handle teacher submission
        console.log('Adding new teacher:', formData);
        break;
      case 'Department':
        // Handle department submission
        console.log('Adding new department:', formData);
        break;
      case 'Club':
        // Handle club submission
        console.log('Adding new club:', formData);
        break;
      case 'Circle':
        // Handle circle submission
        console.log('Adding new circle:', formData);
        break;
      case 'Active':
        // Handle active submission
        console.log('Adding new active:', formData);
        break;
      case 'Stuff':
        // Handle stuff submission
        console.log('Adding new stuff:', formData);
        break;
    }

    // Reset form after submission if needed
    // setFormData({});
  };

  // Create context value
  const contextValue: AddingPageContextType = {
    entityType,
    setEntityType,
    formData,
    updateFormData,
    handleSubmit,
    isFormValid,
    setIsFormValid,
  };

  return (
    <AddingPageContext.Provider value={contextValue}>
      {children}
    </AddingPageContext.Provider>
  );
};

// Custom hook to use the context
export const useAddingPage = () => {
  const context = useContext(AddingPageContext);
  if (context === undefined) {
    throw new Error('useAddingPage must be used within an AddingPageProvider');
  }
  return context;
};
