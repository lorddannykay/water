import { cn } from '../../lib/utils';

/** Visible map credit — required when using OpenStreetMap data (ODbL). */
export function MapAttribution({ className }: { className?: string }) {
  return (
    <p className={cn('map-attribution', className)} aria-label="Map data attribution">
      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener noreferrer"
      >
        © OpenStreetMap
      </a>
      <span aria-hidden> · </span>
      <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">
        © CARTO
      </a>
      <span aria-hidden> · </span>
      <a href="https://leafletjs.com/" target="_blank" rel="noopener noreferrer">
        Leaflet
      </a>
    </p>
  );
}
