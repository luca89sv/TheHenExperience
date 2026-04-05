export default function NotFound() {
  return (
    <section className="relative overflow-hidden flex items-center justify-center" style={{ minHeight: "calc(100vh - 100px)", paddingTop: "100px" }}>
      <div className="text-center px-4">
        <div
          className="font-[family-name:var(--font-display)] font-bold"
          style={{
            fontSize: "clamp(6rem, 15vw, 12rem)",
            lineHeight: 1,
            background: "linear-gradient(135deg, #f472b6, #db2777)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            opacity: 0.3,
          }}
        >
          404
        </div>
        <h1
          className="font-[family-name:var(--font-display)] font-semibold"
          style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", marginTop: "1.5rem", marginBottom: "1rem" }}
        >
          Strona nie <em>istnieje</em>
        </h1>
        <p className="text-white/45 max-w-md mx-auto mb-8" style={{ fontSize: "0.95rem", lineHeight: 1.7 }}>
          Przepraszamy, ale strona kt&oacute;rej szukasz nie zosta&#322;a znaleziona. Mo&#380;e zosta&#322;a przeniesiona lub usuni&#281;ta.
        </p>
        <a
          href="/"
          className="btn-primary btn-lg group"
        >
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Wr&oacute;&#263; na stron&#281; g&#322;&oacute;wn&#261;
        </a>
      </div>
    </section>
  );
}
