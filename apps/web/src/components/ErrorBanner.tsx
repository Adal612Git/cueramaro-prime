import { copy } from '../i18n/es-MX';

type ErrorBannerProps = {
  message?: string;
  onRetry: () => void;
};

export default function ErrorBanner({ message = copy.errorBanner, onRetry }: ErrorBannerProps) {
  return (
    <div className="error-banner" role="alert">
      <span>{message}</span>
      <button type="button" onClick={onRetry} className="error-banner__retry">
        Reintentar
      </button>
    </div>
  );
}
