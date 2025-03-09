import React from 'react';

type SVGProps = React.SVGProps<SVGSVGElement>;

export const Icon24University: React.FC<SVGProps> = (props) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 3L3 8.5V9.5H21V8.5L12 3Z"
        fill="currentColor"
      />
      <path
        d="M19 10.5V18.5H21V10.5H19Z"
        fill="currentColor"
      />
      <path
        d="M3 10.5V18.5H5V10.5H3Z"
        fill="currentColor"
      />
      <path
        d="M7 10.5V18.5H9V10.5H7Z"
        fill="currentColor"
      />
      <path
        d="M11 10.5V18.5H13V10.5H11Z"
        fill="currentColor"
      />
      <path
        d="M15 10.5V18.5H17V10.5H15Z"
        fill="currentColor"
      />
      <path
        d="M3 19.5V21.5H21V19.5H3Z"
        fill="currentColor"
      />
    </svg>
  );
};
