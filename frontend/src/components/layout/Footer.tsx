import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link
              href="/"
              className="font-heading italic text-white text-xl tracking-tight"
              style={{ fontStyle: "italic" }}
            >
              taaru
            </Link>
            <p className="mt-3 text-sm text-white/40 max-w-xs font-body font-light">
              Toute la mode et la beauté à portée de clic. Trouvez les
              meilleurs professionnels près de chez vous.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-body font-medium text-white/60 uppercase tracking-wider mb-4">
              Découvrir
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/providers"
                  className="text-sm text-white/40 font-body hover:text-white transition-colors"
                >
                  Tous les prestataires
                </Link>
              </li>
              <li>
                <Link
                  href="/providers?category=mode"
                  className="text-sm text-white/40 font-body hover:text-white transition-colors"
                >
                  Mode
                </Link>
              </li>
              <li>
                <Link
                  href="/providers?category=couture"
                  className="text-sm text-white/40 font-body hover:text-white transition-colors"
                >
                  Couture
                </Link>
              </li>
              <li>
                <Link
                  href="/providers?category=beaute"
                  className="text-sm text-white/40 font-body hover:text-white transition-colors"
                >
                  Beauté
                </Link>
              </li>
              <li>
                <Link
                  href="/providers?category=evenementiel"
                  className="text-sm text-white/40 font-body hover:text-white transition-colors"
                >
                  Événementiel
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-body font-medium text-white/60 uppercase tracking-wider mb-4">
              Compte
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/auth/login"
                  className="text-sm text-white/40 font-body hover:text-white transition-colors"
                >
                  Connexion
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/register"
                  className="text-sm text-white/40 font-body hover:text-white transition-colors"
                >
                  Inscription
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-white/40 font-body hover:text-white transition-colors"
                >
                  Tableau de bord
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-body font-medium text-white/60 uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="text-sm text-white/40 font-body">
                Dakar, Sénégal
              </li>
              <li>
                <a
                  href="mailto:contact@taaru.sn"
                  className="text-sm text-white/40 font-body hover:text-white transition-colors"
                >
                  contact@taaru.sn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30 font-body">
            &copy; {new Date().getFullYear()} TAARU. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/30 font-body">
            <span>Dakar, Sénégal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
