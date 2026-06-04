import React from 'react';

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxHeight?: string;
  trackTransparent?: boolean;
}

export function ScrollArea({
  children,
  maxHeight,
  trackTransparent = false,
  className = '',
  ...props
}: ScrollAreaProps) {
  const trackClass = trackTransparent ? 'scrollbar-track-transparent' : 'scrollbar-track-theme-bg';
  return (
    <div
      style={maxHeight ? { maxHeight } : undefined}
      className={`overflow-y-auto overflow-x-auto scrollbar-thin ${trackClass} scrollbar-thumb-theme-accent hover:scrollbar-thumb-theme-accent-hover ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
