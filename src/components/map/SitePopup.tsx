import { useState } from 'react';
import type { WaterSite } from './siteData';

export function SitePopupContent({ site }: { site: WaterSite }) {
  const [photoHidden, setPhotoHidden] = useState(false);

  return (
    <div className="min-w-[180px] max-w-[260px]">
      {site.photoUrl && !photoHidden && (
        <img
          src={site.photoUrl}
          alt={site.name}
          loading="lazy"
          className="mb-3 max-h-36 w-full rounded-lg object-cover"
          onError={() => setPhotoHidden(true)}
        />
      )}
      <p className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase">{site.type}</p>
      <p className="mt-1 font-serif text-lg text-ink">{site.name}</p>
      {site.story && (
        <p className="mt-2 font-body text-sm leading-relaxed text-dim">{site.story}</p>
      )}
    </div>
  );
}
