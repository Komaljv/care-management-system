import Link from "next/link";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import InputField from "@/components/auth/InputField";
import AuthButton from "@/components/auth/AuthButton";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to continue managing care services."
    >
      <AuthCard>
        <form className="space-y-5">
          <InputField
            label="Email"
            type="email"
            placeholder="Enter your email"
          />

          <InputField
            label="Password"
            type="password"
            placeholder="Enter your password"
          />

          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <AuthButton text="Login" />

          <p className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-primary font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}