"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const password = form.get("password") as string;
    const confirmPassword = form.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      await register({
        email: form.get("email") as string,
        password,
        firstName: form.get("firstName") as string,
        lastName: form.get("lastName") as string,
        role: (form.get("role") as "CLIENT" | "PROFESSIONAL") || "CLIENT",
      });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur d'inscription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-status-error-bg border border-status-error/30 text-status-error px-4 py-3 rounded-xl text-sm font-body">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Input label="Prénom" name="firstName" required placeholder="Jean" />
        <Input label="Nom" name="lastName" required placeholder="Dupont" />
      </div>

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
        placeholder="Min. 8 car., 1 majuscule, 1 chiffre"
      />

      <Input
        label="Confirmer le mot de passe"
        name="confirmPassword"
        type="password"
        required
        placeholder="Répétez le mot de passe"
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-white/60 font-body tracking-wide">
          Vous êtes
        </label>
        <div className="liquid-glass rounded-xl overflow-hidden">
          <select
            name="role"
            className="w-full bg-transparent text-white text-sm font-body px-4 py-3 outline-none appearance-none cursor-pointer"
            defaultValue="CLIENT"
          >
            <option value="CLIENT" className="bg-black">Particulier</option>
            <option value="PROFESSIONAL" className="bg-black">Professionnel</option>
          </select>
        </div>
      </div>

      <Button type="submit" fullWidth loading={loading}>
        Créer mon compte
      </Button>

      <p className="text-center text-sm text-white/30 font-body">
        Déjà inscrit ?{" "}
        <Link href="/auth/login" className="text-white/60 hover:text-white transition-colors">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
