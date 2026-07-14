import AuthGuard from "@/components/layout/AuthGuard";
import ProfileForm from "@/components/dashboard/ProfileForm";

export default function EditProfilePage() {
  return (
    <AuthGuard>
      <div className="page-container animate-fade-in">
        <h1 className="section-title text-left">Mon profil professionnel</h1>
        <ProfileForm />
      </div>
    </AuthGuard>
  );
}
