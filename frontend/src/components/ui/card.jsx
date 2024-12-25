// src/components/ui/card.jsx
export const Card = ({ children, className }) => (
    <div className={`rounded-lg shadow-md p-4 ${className}`}>{children}</div>
  );
  
  export const CardHeader = ({ children, className }) => (
    <div className={`border-b pb-2 mb-4 ${className}`}>{children}</div>
  );
  
  export const CardTitle = ({ children, className }) => (
    <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>
  );
  
  export const CardContent = ({ children, className }) => (
    <div className={`text-sm ${className}`}>{children}</div>
  );
  