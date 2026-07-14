interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Une erreur est survenue. Veuillez réessayer.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <svg
        className="w-16 h-16 text-status-error/50 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
      <h3 className="text-lg font-medium text-white">Erreur</h3>
      <p className="mt-1 text-sm text-surface-500 max-w-sm">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary mt-4">
          Réessayer
        </button>
      )}
    </div>
  );
}
