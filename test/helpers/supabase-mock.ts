/**
 * A controllable fake Supabase client for route-handler integration tests.
 *
 * Mirrors just enough of the PostgREST builder surface the routes touch:
 *   from(table).select().eq().eq()      → awaitable { data, error }
 *   from(table).insert(rows).select()   → awaitable { data, error }
 *   from(table).upsert(rows, opts)      → awaitable { data, error }
 *   from(table).update(patch).eq()      → awaitable { data, error }
 *   ...single() / ...maybeSingle()      → unwrap first row
 *
 * Every builder is thenable, so `await client.from(...).select().eq(...)` resolves to
 * the configured result. All operations are recorded on `client.calls` for assertions.
 */

export interface RecordedCall {
  table: string;
  op: "select" | "insert" | "upsert" | "update" | "delete";
  payload?: unknown;
  filters: Array<{ kind: string; column: string; value: unknown }>;
  options?: unknown;
}

export interface TableResult {
  data?: unknown;
  error?: unknown;
}

/** Per-table programmable results, keyed by `${table}:${op}` or just `${table}`. */
export type ResultMap = Record<string, TableResult>;

export interface FakeSupabase {
  from: (table: string) => any;
  calls: RecordedCall[];
  /** Override the result returned for a table/op (e.g. "judge_scores:select"). */
  setResult: (key: string, result: TableResult) => void;
}

export function createFakeSupabase(initial: ResultMap = {}): FakeSupabase {
  const results: ResultMap = { ...initial };
  const calls: RecordedCall[] = [];

  function resultFor(table: string, op: string): TableResult {
    return results[`${table}:${op}`] ?? results[table] ?? { data: [], error: null };
  }

  function makeBuilder(table: string, op: RecordedCall["op"], payload?: unknown, options?: unknown) {
    const call: RecordedCall = { table, op, payload, filters: [], options };
    calls.push(call);

    const builder: any = {
      select(_cols?: string) {
        return builder;
      },
      insert(rows: unknown) {
        call.op = "insert";
        call.payload = rows;
        return builder;
      },
      upsert(rows: unknown, opts?: unknown) {
        call.op = "upsert";
        call.payload = rows;
        call.options = opts;
        return builder;
      },
      update(patch: unknown) {
        call.op = "update";
        call.payload = patch;
        return builder;
      },
      delete() {
        call.op = "delete";
        return builder;
      },
      eq(column: string, value: unknown) {
        call.filters.push({ kind: "eq", column, value });
        return builder;
      },
      neq(column: string, value: unknown) {
        call.filters.push({ kind: "neq", column, value });
        return builder;
      },
      in(column: string, value: unknown) {
        call.filters.push({ kind: "in", column, value });
        return builder;
      },
      not(column: string, _op: unknown, value: unknown) {
        call.filters.push({ kind: "not", column, value });
        return builder;
      },
      gt(column: string, value: unknown) {
        call.filters.push({ kind: "gt", column, value });
        return builder;
      },
      gte(column: string, value: unknown) {
        call.filters.push({ kind: "gte", column, value });
        return builder;
      },
      lt(column: string, value: unknown) {
        call.filters.push({ kind: "lt", column, value });
        return builder;
      },
      lte(column: string, value: unknown) {
        call.filters.push({ kind: "lte", column, value });
        return builder;
      },
      order() {
        return builder;
      },
      limit() {
        return builder;
      },
      ilike(column: string, value: unknown) {
        call.filters.push({ kind: "ilike", column, value });
        return builder;
      },
      or(expr: string) {
        call.filters.push({ kind: "or", column: expr, value: expr });
        return builder;
      },
      single() {
        const r = resultFor(table, call.op);
        const row = Array.isArray(r.data) ? r.data[0] ?? null : r.data ?? null;
        return Promise.resolve({ data: row, error: r.error ?? null });
      },
      maybeSingle() {
        const r = resultFor(table, call.op);
        const row = Array.isArray(r.data) ? r.data[0] ?? null : r.data ?? null;
        return Promise.resolve({ data: row, error: r.error ?? null });
      },
      then(resolve: (v: TableResult) => unknown, reject?: (e: unknown) => unknown) {
        const r = resultFor(table, call.op);
        return Promise.resolve({ data: r.data ?? null, error: r.error ?? null }).then(resolve, reject);
      },
    };
    return builder;
  }

  return {
    calls,
    setResult(key, result) {
      results[key] = result;
    },
    from(table: string) {
      return makeBuilder(table, "select");
    },
  };
}
