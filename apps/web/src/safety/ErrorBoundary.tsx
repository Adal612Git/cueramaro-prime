import React from 'react';
type Props = { children: React.ReactNode; fallback?: React.ReactNode };
type State = { hasError: boolean; message?: string };
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(err: unknown) {
    return { hasError: true, message: (err as any)?.message || String(err) };
  }
  componentDidCatch(err: unknown, info: any) {
    console.error('ðŸ›‘ UI Crash:', err, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div style={{ padding: '2rem' }}>
            <h2>Algo saliÃ³ mal</h2>
            <p style={{ color: '#6b7280' }}>{this.state.message}</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              style={{
                padding: '.5rem 1rem',
                borderRadius: 6,
                background: '#1e40af',
                color: '#fff',
                border: 0,
              }}
            >
              Reintentar
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
