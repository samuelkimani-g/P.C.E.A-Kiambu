const ErrorState = ({ title = 'Something went wrong', message = 'Please try again later.', onRetry, children }) => (
  <div className="card mx-auto max-w-lg p-8 text-center">
    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
    <p className="mt-2 text-sm text-muted">{message}</p>
    {children}
    {onRetry ? (
      <button type="button" className="btn-primary mt-6" onClick={onRetry}>
        Try again
      </button>
    ) : null}
  </div>
);

export default ErrorState;
