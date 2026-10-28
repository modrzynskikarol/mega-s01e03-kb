<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { causeOf, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  let { ticket, issues }: { ticket: number; issues: Record<string, string> } = $props();

  // Two problems, counted the desk's way: each report where its tenant files it (causes.ts).
  // The one-day moves the desk noted stay in the count and get a footnote.
  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  const rows = $derived(
    ['parser', 'hint'].map((p) => ({ p, n: merged.filter((r) => causeOf(r, tenantOf(r)) === p).length }))
  );
  const oneDay = $derived(merged.filter((r) => notes.oneDayMove.includes(r.id)).length);
</script>

<table>
  <thead><tr><th>problem</th><th>reports</th><th>ticket</th></tr></thead>
  <tbody>
    {#each rows as row (row.p)}
      <tr><td><code>{row.p}</code></td><td>{row.n}</td><td><a href={issues[row.p]}>{issues[row.p].split('/').pop() ? '#' + issues[row.p].split('/').pop() : ''}</a></td></tr>
    {/each}
    <tr><td>total</td><td>{rows.reduce((a, r) => a + r.n, 0)}</td><td></td></tr>
  </tbody>
</table>
<p class="note">{oneDay} of the <code>parser</code> reports read as a one-day move, not a swap. They stay counted there.</p>
