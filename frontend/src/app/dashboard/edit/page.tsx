import AuthGuard from "@/components/layout/AuthGuard";
import ProfileForm from "@/components/dashboard/ProfileForm";

export default function EditProfilePage() {
  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Mon profil professionnel</h1>
        <ProfileForm />
      </div>
    </AuthGuard>
  );
}
