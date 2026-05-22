import Link from "next/link";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import InputField from "@/components/auth/InputField";
import AuthButton from "@/components/auth/AuthButton";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Register to access the care management platform."
    >
      <AuthCard>
        <form className="space-y-5">
          <InputField
            label="Full Name"
            placeholder="Enter your full name"
          />

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

          <InputField
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>

            <select className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-primary">
              <option>Carer</option>
              <option>Family</option>
            </select>
          </div>

          <AuthButton text="Create Account" />

          <p className="text-center text-sm">
            Already have an account?{" "}
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