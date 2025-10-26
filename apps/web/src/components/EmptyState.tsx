type EmptyStateProps = {
  icon: string;
  message: string;
};

export default function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <div className="empty-state__icon" aria-hidden="true">
        {icon}
      </div>
      <p>{message}</p>
    </div>
  );
}
