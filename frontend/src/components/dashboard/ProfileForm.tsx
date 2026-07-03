"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import {
  ProviderDetail,
  ProviderFormData,
  getMyProviderProfile,
  createProvider,
  updateProvider,
} from "@/lib/providers";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [existing, setExisting] = useState<ProviderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!existing;

  useEffect(() => {
    if (user?.role === "PROFESSIONAL") {
      getMyProviderProfile()
        .then(setExisting)
        .catch(() => setExisting(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const form = new FormData(e.currentTarget);
    const data: ProviderFormData = {
      businessName: form.get("businessName") as string,
      categorySlug: form.get("category") as string,
      subcategory: (form.get("subcategory") as string) || undefined,
      description: (form.get("description") as string) || undefined,
      city: form.get("city") as string,
      district: (form.get("district") as string) || undefined,
      address: (form.get("address") as string) || undefined,
      phone: (form.get("phone") as string) || undefined,
      whatsapp: (form.get("whatsapp") as string) || undefined,
      website: (form.get("website") as string) || undefined,
      logoUrl: (form.get("logoUrl") as string) || undefined,
    };

    try {
      if (isEdit) {
        await updateProvider(data);
      } else {
        await createProvider(data);
      }
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de l'enregistrement"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nom commercial"
          name="businessName"
          required
          defaultValue={existing?.businessName}
          placeholder="Salon de coiffure XYZ"
        />
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-300">
            Catégorie
          </label>
          <select
            name="category"
            required
            defaultValue={existing?.category?.toLowerCase() || ""}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="">Sélectionnez</option>
            <option value="mode">Mode</option>
            <option value="couture">Couture</option>
            <option value="beaute">Beauté</option>
            <option value="evenementiel">Événementiel</option>
          </select>
        </div>
      </div>

      <Input
        label="Sous-catégorie"
        name="subcategory"
        defaultValue={existing?.subcategory || ""}
        placeholder="Ex: Coiffure, Maquillage, Robe de mariée..."
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-300">
          Description
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={existing?.description || ""}
          placeholder="Présentez votre activité..."
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Ville"
          name="city"
          required
          defaultValue={existing?.city}
          placeholder="Dakar"
        />
        <Input
          label="Quartier"
          name="district"
          defaultValue={existing?.district || ""}
          placeholder="Mermoz"
        />
        <Input
          label="Adresse"
          name="address"
          defaultValue={existing?.address || ""}
          placeholder="123 rue..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Téléphone"
          name="phone"
          type="tel"
          defaultValue={existing?.phone || ""}
          placeholder="+221 77 123 45 67"
        />
        <Input
          label="WhatsApp"
          name="whatsapp"
          type="tel"
          defaultValue={existing?.whatsapp || ""}
          placeholder="+221 77 123 45 67"
        />
        <Input
          label="Site web"
          name="website"
          type="url"
          defaultValue={existing?.website || ""}
          placeholder="https://..."
        />
      </div>

      <Input
        label="URL du logo"
        name="logoUrl"
        type="url"
        defaultValue={existing?.logoUrl || ""}
        placeholder="https://..."
      />

      <Button type="submit" loading={saving}>
        {isEdit ? "Mettre à jour" : "Créer mon profil"}
      </Button>
    </form>
  );
}
