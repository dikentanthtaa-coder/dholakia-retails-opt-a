import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

// Loose source type — Sanity image references are nested objects.
type ImageSource = Parameters<typeof builder.image>[0];

export function urlFor(source: ImageSource) {
  return builder.image(source);
}
