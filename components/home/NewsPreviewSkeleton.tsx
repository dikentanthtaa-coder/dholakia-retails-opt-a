/**
 * Skeleton shown while the homepage's NewsPreview RSC streams in.
 * Server Component — pure markup, zero JS shipped.
 */
export default function NewsPreviewSkeleton() {
  return (
    <section
      data-header-theme="light"
      className="bg-white"
      style={{ paddingTop: "120px", paddingBottom: "120px" }}
      aria-busy
    >
      <div className="container-editorial">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <div className="max-w-2xl space-y-4">
            <div className="h-3 w-24 rounded-sm skeleton" />
            <div className="h-10 w-full max-w-xl rounded-sm skeleton" />
            <div className="h-10 w-3/4 max-w-md rounded-sm skeleton" />
          </div>
          <div className="h-4 w-32 rounded-sm skeleton self-start md:self-end" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col border border-black/10 bg-white">
              <div className="aspect-[16/9] skeleton" />
              <div className="p-6 space-y-3">
                <div className="h-3 w-32 rounded-sm skeleton" />
                <div className="h-5 w-full rounded-sm skeleton" />
                <div className="h-5 w-3/4 rounded-sm skeleton" />
                <div className="h-3 w-full rounded-sm skeleton mt-2" />
                <div className="h-3 w-2/3 rounded-sm skeleton" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
