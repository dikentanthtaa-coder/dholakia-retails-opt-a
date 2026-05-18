import ConditionalHeader from "./ConditionalHeader";

/**
 * Server-component shell so the header reaches the streamed HTML without
 * waiting for client hydration. `ConditionalHeader` is a thin Client
 * Component that filters out the /studio chrome on the client.
 */
export default function HeaderWrapper() {
  return <ConditionalHeader />;
}
