"use client";

import { useState } from "react";
import Link from "next/link";

import CenteredLayout from "@/components/CenteredLayout";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { validateResetPasswordForm, ResetPasswordFormErrors } from "@/lib/validation";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<ResetPasswordFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const formErrors = validateResetPasswordForm(newPassword, confirmPassword);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});
    setIsLoading(true);

    try {
      // TODO: Add API call to reset password
      console.log("Reset password attempt:", { newPassword });
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch (error) {
      console.error("Reset password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <CenteredLayout
        title="Password Reset"
        subtitle="Your password has been successfully reset."
      >
        <Card>
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              You can now login with your new password.
            </p>
            <Link
              href="/login"
              className="block rounded-xl py-3 font-medium transition-all bg-primary text-primary-foreground hover:opacity-90"
            >
              Go to Login
            </Link>
          </div>
        </Card>
      </CenteredLayout>
    );
  }

  return (
    <CenteredLayout
      title="Reset Password"
      subtitle="Create a new secure password."
    >
      <Card>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />

          <Button text={isLoading ? "Updating..." : "Update Password"} disabled={isLoading} />

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
