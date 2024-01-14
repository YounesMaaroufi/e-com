import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-center h-screen items-center">{children}</div>
  );
};

export default layout;
