import catalog from "./dmciProperties.json";

export type DmciCatalogEntry = {
  name: string;
  slug: string;
  location: string;
  status: string;
  price_min: number;
  price_max: number;
  /** Comma-separated unit tokens, e.g. "STUDIO, 1BR, 2BR". */
  beds: string;
};

/** The full DMCI project catalog, sorted by location then name for the picker. */
export const DMCI_CATALOG: DmciCatalogEntry[] = (catalog as DmciCatalogEntry[])
  .slice()
  .sort((a, b) => a.location.localeCompare(b.location) || a.name.localeCompare(b.name));
