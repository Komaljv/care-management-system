import Link from "next/link";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import InputField from "@/components/auth/InputField";
import AuthButton from "@/components/auth/AuthButton";

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Create a new secure password."
    >
      <AuthCard>
        <form className="space-y-5">
          <InputField
            label="New Password"
            type="password"
            placeholder="Enter new password"
          />

          <InputField
            label="Confirm Password"
            type="password"
            placeholder="Confirm new password"
          />

          <AuthButton text="Update Password" />

          <p className="text-center text-sm">
            Back to{" "}
            <Link
              href="/auth/login"
              className="text-primary font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}