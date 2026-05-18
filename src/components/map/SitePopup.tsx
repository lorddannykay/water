import type { WaterSite } from './siteData';

export function SitePopupContent({ site }: { site: WaterSite }) {
  return (
    <div className="min-w-[180px]">
      <p className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase">{site.type}</p>
      <p className="mt-1 font-serif text-lg text-ink">{site.name}</p>
      {site.story && (
        <p className="mt-2 font-body text-sm leading-relaxed text-dim">{site.story}</p>
      )}
    </div>
  );
}
