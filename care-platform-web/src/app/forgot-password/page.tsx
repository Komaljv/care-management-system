"use client";

import { useState } from "react";
import Link from "next/link";

import CenteredLayout from "@/components/CenteredLayout";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { validateForgotPasswordForm, ForgotPasswordFormErrors } from "@/lib/validation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ForgotPasswordFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const formErrors = validateForgotPasswordForm(email);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});
    setIsLoading(true);

    try {
      // TODO: Add API call to send reset link
      console.log("Forgot password attempt:", { email });
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch (error) {
      console.error("Forgot password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <CenteredLayout
        title="Check Your Email"
        subtitle="We've sent a password reset link to your email address."
      >
        <Card>
          <div className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              If an account exists for <strong>{email}</strong>, you will receive an email with instructions to reset your password.
            </p>
            <p className="text-center text-sm text-muted-foreground">
              If you don&apos;t see the email, please check your spam folder.
            </p>
            <Link
              href="/login"
              className="block text-center rounded-xl py-3 font-medium transition-all bg-primary text-primary-foreground hover:opacity-90"
            >
              Back to Login
            </Link>
          </div>
        </Card>
      </CenteredLayout>
    );
  }

  return (
    <CenteredLayout
      title="Forgot Password"
      subtitle="Enter your email to receive a reset link."
    >
      <Card>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <Button text={isLoading ? "Sending..." : "Send Reset Link"} disabled={isLoading} />

          <p className="text-center text-sm">
            Back to{" "}
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
