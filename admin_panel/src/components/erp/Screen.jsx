export default function Screen({ title, kicker = "Workspace", layout = "page", children }) {
  const sectionClass = layout === "form"
    ? "custom-screen-section custom-screen-section--form"
    : "custom-screen-section custom-screen-section--table";

  return (
    <div className="custom-screen-page-stack">
      <div className="page-header">
        <div className="page-header__title-wrap">
          <h2 className="page-header__title">{title}</h2>
        </div>
      </div>
      <section className={sectionClass}>{children}</section>
    </div>
  );
}
