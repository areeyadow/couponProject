"use client";
import { LiffProvider, useLiff } from "./LiffProvider";

// The LIFF wrapper component
function LiffInitializer({ children }: { children: React.ReactNode }) {
  const { liffError, isLoading } = useLiff();

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-4 text-xl font-bold">Loading Page...</div>
          <div className="animate-pulse bg-blue-500 h-2 w-24 rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  if (liffError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-4 text-xl font-bold text-red-500">
            Error loading LIFF
          </div>
          <p className="text-gray-600">{liffError}</p>
          <p className="mt-4">
            Please make sure you are accessing this page through the LINE app or
            that you have set up LIFF correctly.
          </p>
        </div>
      </div>
    );
  }

  // LIFF is initialized successfully
  return <>{children}</>;
}

// The layout component that provides the LIFF context
export default function LiffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LiffProvider>
      <LiffInitializer>{children}</LiffInitializer>
    </LiffProvider>
  );
}
