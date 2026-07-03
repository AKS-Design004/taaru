import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#D4AF37]">TAARU</h1>
          <p className="mt-2 text-gray-400">Créez votre compte</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
