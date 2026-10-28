<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { causeOf, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  let { ticket, issues }: { ticket: number; issues: Record<string, string> } = $props();

  // Three problems: the one-day moves the desk noted, the booking-v3 hint, and the month-first parser.
  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  const problemOf = (r: Report) => (notes.oneDayMove.includes(r.id) ? 'oneDay' : (causeOf(r, tenantOf(r)) ?? 'unplaced'));
  const rows = $derived(
    ['parser', 'hint', 'oneDay'].map((p) => ({ p, n: merged.filter((r) => problemOf(r) === p).length }))
  );
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
