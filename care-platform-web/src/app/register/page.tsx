"use client";

import { useState } from "react";
import Link from "next/link";

import CenteredLayout from "@/components/CenteredLayout";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Select from "@/components/Select";
import { validateRegisterForm, RegisterFormErrors } from "@/lib/validation";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const formErrors = validateRegisterForm(
      fullName,
      email,
      password,
      confirmPassword,
      role,
    );
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});
    setIsLoading(true);

    try {
      // TODO: Add API call to register
      console.log("Register attempt:", { fullName, email, password, role });
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Register error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CenteredLayout
      title="Create Account"
      subtitle="Register to access the care management platform."
    >
      <Card>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />

          <Select
            label="Role"
            options={[
              { value: "", label: "Select a role" },
              { value: "carer", label: "Carer" },
              { value: "family", label: "Family" },
            ]}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            error={errors.role}
          />

          <Button
            text={isLoading ? "Creating Account..." : "Create Account"}
            disabled={isLoading}
          />

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </Card>
    </CenteredLayout>
  );
}
