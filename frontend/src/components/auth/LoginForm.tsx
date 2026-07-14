"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    try {
      await login({
        email: form.get("email") as string,
        password: form.get("password") as string,
      });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-status-error-bg border border-status-error/30 text-status-error px-4 py-3 rounded-xl text-sm font-body">
          {error}
        </div>
      )}

      <Input
        label="Email"
        name="email"
        type="email"
        required
        placeholder="vous@email.com"
      />

      <Input
        label="Mot de passe"
        name="password"
        type="password"
        required
        placeholder="Votre mot de passe"
      />

      <Button type="submit" fullWidth loading={loading}>
        Se connecter
      </Button>

      <p className="text-center text-sm text-white/30 font-body">
        Pas encore de compte ?{" "}
        <Link href="/auth/register" className="text-white/60 hover:text-white transition-colors">
          S&apos;inscrire
        </Link>
      </p>
    </form>
  );
}
