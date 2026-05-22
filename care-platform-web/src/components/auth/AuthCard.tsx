import { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
}

export default function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="border rounded-2xl p-6 shadow-sm bg-card">
      {children}
    </div>
  );
}