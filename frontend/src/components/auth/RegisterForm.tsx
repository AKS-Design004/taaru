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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
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

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-300">
          Vous êtes
        </label>
        <select
          name="role"
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
          defaultValue="CLIENT"
        >
          <option value="CLIENT">Particulier</option>
          <option value="PROFESSIONAL">Professionnel</option>
        </select>
      </div>

      <Button type="submit" fullWidth loading={loading}>
        Créer mon compte
      </Button>

      <p className="text-center text-sm text-gray-500">
        Déjà inscrit ?{" "}
        <Link href="/auth/login" className="text-[#D4AF37] hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
