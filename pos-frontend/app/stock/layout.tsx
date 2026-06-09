import React from 'react';

interface StockLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function StockLayout({ children, modal }: Readonly<StockLayoutProps>) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
