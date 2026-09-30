const PageHeader = ({ title, description, actions }) => (
  <div className="flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
    </div>
    {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
  </div>
);

export default PageHeader;
