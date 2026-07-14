"use client";

import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="liquid-glass rounded-[1.5rem] p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <span
                className="font-heading italic text-white text-3xl tracking-tight"
                style={{ fontStyle: "italic" }}
              >
                taaru
              </span>
            </Link>
            <p className="mt-2 text-white/40 text-sm font-body">
              Connectez-vous à votre compte
            </p>
          </div>
          <LoginForm />
        </div>
      </motion.div>
    </div>
  );
}
