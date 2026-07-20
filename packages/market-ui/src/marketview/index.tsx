import { render } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { signal } from "@preact/signals";
import { Electroview } from "electrobun/view";
import { TitleBar } from "@spiritvale/ui-theme/title-bar";
import { StatusDot } from "@spiritvale/ui-theme/status-dot";
import { ListRow } from "@spiritvale/ui-theme/list-row";

import type { MarketUiListing, MarketUiRpc, MarketUiState, MarketUiStat } from "../app-types.ts";

const STATUS_TONE: Record<MarketUiState["status"], "is-ok" | "is-warn" | "is-err"> = {
  waiting: "is-warn",
  watching: "is-ok",
  ready: "is-ok",
  stopped: "is-warn",
  error: "is-err",
};

const numberFormat = new Intl.NumberFormat();
let queryTimer: ReturnType<typeof setTimeout> | undefined;

const state = signal<MarketUiState | undefined>(undefined);

const rpc = Electroview.defineRPC<MarketUiRpc>({
  handlers: { requests: {}, messages: { stateChanged: (next) => { state.value = next; } } },
});
const electroview = new Electroview({ rpc });

void electroview.rpc?.request.getState({}).then((next) => { state.value = next; });

function setQuery(query: string): void {
  if (queryTimer) clearTimeout(queryTimer);
  queryTimer = setTimeout(() => {
    void electroview.rpc?.request.setQuery({ query }).then((next) => { state.value = next; });
  }, 150);
}

function loadMore(): void {
  void electroview.rpc?.request.loadMore({}).then((next) => { state.value = next; });
}

function formatPrice(value: string): string {
  try {
    return numberFormat.format(BigInt(value));
  } catch {
    return value;
  }
}

function formatStat(stat: MarketUiStat): string {
  const value = stat.value === undefined ? `roll ${numberFormat.format(stat.roll)}` : `${numberFormat.format(stat.value)}${stat.percent ? "%" : ""}`;
  return `${humanizeStat(stat.name)} ${value}`;
}

function humanizeStat(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/\bHp\b/g, "HP")
    .replace(/\bMp\b/g, "MP");
}

function App() {
  const next = state.value;
  const queryRef = useRef<HTMLInputElement>(null);

  // Only sync the field from server state when the user isn't actively typing in
  // it — otherwise the debounced setQuery round-trip would clobber keystrokes
  // typed between the request firing and its response landing.
  useEffect(() => {
    const input = queryRef.current;
    if (input && next && document.activeElement !== input) input.value = next.query;
  }, [next?.query]);

  if (!next) return <main class="app-shell" />;

  return (
    <main class="app-shell">
      <TitleBar
        appTag="Market"
        minWidth={520}
        minHeight={480}
        getFrame={async () => (await electroview.rpc?.request.getWindowFrame({})) ?? { x: 0, y: 0, width: 520, height: 480 }}
        setFrame={(frame) => void electroview.rpc?.request.setWindowFrame(frame)}
        toggleMaximize={async () => (await electroview.rpc?.request.toggleMaximize({}))?.maximized ?? false}
        onMinimize={() => void electroview.rpc?.request.windowAction({ action: "minimize" })}
        onClose={() => void electroview.rpc?.request.windowAction({ action: "close" })}
      />
      <section class="search-bar">
        <label class="field" for="market-query">
          <span aria-hidden="true">⌕</span>
          <input
            id="market-query"
            ref={queryRef}
            type="search"
            maxLength={200}
            autocomplete="off"
            placeholder="Search items, sellers, shops, or maps"
            defaultValue={next.query}
            onInput={(event) => setQuery((event.target as HTMLInputElement).value)}
          />
        </label>
        <button class={next.filters.length > 0 ? "btn active" : "btn"} type="button" onClick={() => void electroview.rpc?.request.openFilters({})}>
          Filters {next.filters.length > 0 && <span class="filter-count">{next.filters.length}</span>}
        </button>
      </section>
      <section class="status-strip" aria-live="polite">
        <StatusDot tone={STATUS_TONE[next.status]} detail={next.statusDetail} />
        <strong id="result-count" class="t-data">{numberFormat.format(next.matchCount)} {next.matchCount === 1 ? "result" : "results"}</strong>
      </section>
      <section class="results" aria-label="Market listings">
        {next.listings.length === 0 ? (
          <div class="empty-state">
            {next.status === "waiting"
              ? "No active market session. Start the passive market command, then open the in-game market."
              : next.capturedCount === 0
                ? "Waiting for market listings from the current session."
                : "No captured listings match this search and filter set."}
          </div>
        ) : (
          next.listings.map((listing) => <ListingCard key={listing.key} listing={listing} />)
        )}
      </section>
      <div class="load-more-row">
        {next.hasMore && <button class="btn" type="button" onClick={loadMore}>Load more</button>}
      </div>
    </main>
  );
}

function ListingCard({ listing }: { listing: MarketUiListing }) {
  const metadata = [listing.seller, listing.shopName, listing.mapId].filter(Boolean).join(" · ");
  return (
    <ListRow className="listing" chips={listing.stats.length > 0 ? listing.stats.map(formatStat) : undefined}>
      <strong class="row-title">{listing.name}</strong>
      <strong class="listing-price">{formatPrice(listing.price)}</strong>
      <span class="row-meta">{metadata || listing.itemId || "Market listing"}</span>
      <span class="row-meta listing-quantity">{numberFormat.format(listing.available)} available</span>
    </ListRow>
  );
}

render(<App />, document.getElementById("root")!);
