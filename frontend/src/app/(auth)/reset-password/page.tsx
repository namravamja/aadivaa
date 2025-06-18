import { Suspense } from "react";
import ResetPasswordClient from "../components/reset-password";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}
