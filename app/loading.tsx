import DrLoader from "@/components/DrLoader";

/**
 * Root loading boundary — streamed in by Next.js while server data resolves.
 *
 * Renders the brand DR liquid-fill preloader: outline + rising blue fill,
 * a sweeping progress bar, and a tracked-out caption. Pure CSS animation
 * (see globals.css `.dr-loader`) — no client JS shipped for the loading
 * frame.
 */
export default function Loading() {
  return <DrLoader fullscreen={false} />;
}
