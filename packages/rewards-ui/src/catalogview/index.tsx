import { render } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { signal } from "@preact/signals";
import { Electroview } from "electrobun/view";
import { TitleBar } from "@spiritvale/ui-theme/title-bar";
import { ListRow, RowHead } from "@spiritvale/ui-theme/list-row";

import type { RewardsCatalogRpc, RewardsCatalogState } from "../app-types.ts";

const format = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });

const state = signal<RewardsCatalogState | undefined>(undefined);

const rpc = Electroview.defineRPC<RewardsCatalogRpc>({
  handlers: { requests: {}, messages: { stateChanged: (next) => { state.value = next; } } },
});
const electroview = new Electroview({ rpc });

void electroview.rpc?.request.getState({}).then((next) => { state.value = next; });

function formatChance(value: number): string {
  return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 3 }).format(value)}%`;
}

function App() {
  const next = state.value;
  const queryRef = useRef<HTMLInputElement>(null);

  // Only sync the field from server state when the user isn't actively typing
  // in it — mirrors the original imperative guard against clobbering keystrokes.
  useEffect(() => {
    const input = queryRef.current;
    if (input && next && document.activeElement !== input) input.value = next.query;
  }, [next?.query]);

  useEffect(() => {
    if (next) queryRef.current?.focus();
  }, [next !== undefined]);

  if (!next) return null;

  return (
    <>
      <TitleBar
        appTag="Mob Catalog"
        minWidth={520}
        minHeight={420}
        getFrame={async () => (await electroview.rpc?.request.getWindowFrame({})) ?? { x: 0, y: 0, width: 520, height: 420 }}
        setFrame={(frame) => void electroview.rpc?.request.setWindowFrame(frame)}
        toggleMaximize={async () => (await electroview.rpc?.request.toggleMaximize({}))?.maximized ?? false}
        onMinimize={() => void electroview.rpc?.request.windowAction({ action: "minimize" })}
        onClose={() => void electroview.rpc?.request.windowAction({ action: "close" })}
      />
      <main>
        <div class="catalog-head">
          <div>
            <h1>Mob catalog</h1>
            <p>Build-matched base values before party and status modifiers.</p>
          </div>
          <span class="pill">{next.catalogCount} mobs</span>
        </div>
        <label class="field catalog-search">
          <span aria-hidden="true">⌕</span>
          <input
            ref={queryRef}
            type="search"
            placeholder="Search mob name or ID…"
            autocomplete="off"
            defaultValue={next.query}
            onInput={(event) => void electroview.rpc?.request.setQuery({ query: (event.target as HTMLInputElement).value })}
          />
        </label>
        <div class="list catalog-list">
          {next.catalog.length === 0 ? (
            <div class="empty-state">
              {next.catalogCount === 0 ? "No catalog data is bundled for this build yet." : "No mobs match this search."}
            </div>
          ) : (
            next.catalog.map((mob) => (
              <ListRow
                key={mob.id}
                chips={mob.drops.length > 0
                  ? mob.drops.map((drop) => `${drop.itemName} ×${drop.count}${drop.chance === undefined ? "" : ` · ${formatChance(drop.chance)}`}`)
                  : undefined}
              >
                <RowHead
                  titleTag="h3"
                  title={mob.displayName}
                  meta={`Level ${mob.level}${mob.boss ? " · Boss" : ""} · ${mob.id}`}
                  values={[`${format.format(mob.baseExperience)} base XP`, `${format.format(mob.baseCoins)} base coins`]}
                />
              </ListRow>
            ))
          )}
        </div>
      </main>
    </>
  );
}

render(<App />, document.getElementById("root")!);
