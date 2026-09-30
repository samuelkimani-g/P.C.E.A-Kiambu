import { clsx } from 'clsx';

const LoadingScreen = ({ label = 'Loading...', fullscreen = false }) => (
  <div
    className={clsx(
      'flex flex-col items-center justify-center gap-4 text-primary-700',
      fullscreen ? 'min-h-screen bg-surface' : 'py-24',
    )}
  >
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
    <p className="text-sm font-medium text-muted">{label}</p>
  </div>
);

export default LoadingScreen;
