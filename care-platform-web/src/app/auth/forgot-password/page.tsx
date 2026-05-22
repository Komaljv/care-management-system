import Link from "next/link";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import InputField from "@/components/auth/InputField";
import AuthButton from "@/components/auth/AuthButton";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email to receive a reset link."
    >
      <AuthCard>
        <form className="space-y-5">
          <InputField
            label="Email"
            type="email"
            placeholder="Enter your email"
          />

          <AuthButton text="Send Reset Link" />

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