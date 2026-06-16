/** Tiny CSV parser with basic quoted-field support, shared by API + UI. */

import { csvRowSchema, CSV_COLUMNS, type CsvRow } from "./validators";

function splitLine(line: string): string[] {
  return (
    line.match(/("([^"]|"")*"|[^,]*)(,|$)/g)?.slice(0, -1).map((cell) =>
      cell.replace(/,$/, "").replace(/^"|"$/g, "").replace(/""/g, '"').trim(),
    ) ?? []
  );
}

/** Parse CSV text into validated rows keyed by the known columns. */
export function parseCsv(text: string): CsvRow[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];

  const header = splitLine(lines[0]).map((h) => h.toLowerCase());
  const hasHeader = CSV_COLUMNS.some((c) => header.includes(c));
  const cols = hasHeader ? header : (CSV_COLUMNS as readonly string[]);
  const dataLines = hasHeader ? lines.slice(1) : lines;

  return dataLines.flatMap((line) => {
    const cells = splitLine(line);
    const record: Record<string, string> = {};
    cols.forEach((col, i) => {
      record[col] = cells[i] ?? "";
    });
    const parsed = csvRowSchema.safeParse(record);
    return parsed.success ? [parsed.data] : [];
  });
}
