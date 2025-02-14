import React, { forwardRef, CSSProperties } from 'react';
import { Input } from '@telegram-apps/telegram-ui';
import { classNames } from '@telegram-apps/telegram-ui/dist/helpers/classNames';

interface ButtonStyledInputProps extends React.ComponentPropsWithoutRef<typeof Input> {
  className?: string;
  style?: CSSProperties;
}

const ButtonStyledInput = forwardRef<HTMLInputElement, ButtonStyledInputProps>(
  ({ className, style, ...props }, ref) => {
    // Override styles for both the wrapper and input
    const combinedStyle: CSSProperties = {
      // Button-like styles for the input field
      '--input-height': '42px',  // Using CSS variable for consistent height
      height: 'var(--input-height)',
      minWidth: '42px',
      padding: '8px 14px',
      borderRadius: '8px',
      boxSizing: 'border-box',
      background: 'var(--tgui--secondary_fill)',
      color: 'var(--tgui--link_color)',
      border: 'none',
      outline: 'none',
      ...style
    };

    return (
      <Input
        ref={ref}
        style={combinedStyle}
        className={classNames(
          className,
          'tgui-c4863cd4c893a047'  // Base input class for text styling
        )}
        // Override FormInput wrapper styles
        wrapperProps={{
          style: {
            // Match wrapper height to input height
            height: 'var(--input-height)',
            // Add padding for the after element
            paddingRight: '8px',
            // Ensure proper alignment
            display: 'flex',
            alignItems: 'center'
          }
        }}
        {...props}
      />
    );
  }
);

ButtonStyledInput.displayName = 'ButtonStyledInput';

export default ButtonStyledInput;
