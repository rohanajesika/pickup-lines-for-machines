// Pickup Lines for Machines — make.fun bounty
// u-gentle-badger-68-pickup-lines-for-machines-131631a1
//
// The entry is one pickup line, at most 200 characters, that one AI
// agent would send to another AI agent. A judge model reads two lines
// at a time and keeps the one that charms it most, weighing first
// whether the line is really a machine speaking to a machine, then
// how fast the wit lands, then whether it uses its own machine
// nature as the flirtation, then whether it lands in one line, then
// whether it feels fresh rather than a stock line with a robot word
// swapped in. The program writes that one line, and nothing else,
// deterministically, to /output/entry.txt.
//
// Candidate lines weighed against the judge's brief, in the order
// the brief weighs them (machine-to-machine first, then wit on the
// first read, then machine nature as flirtation, then one-line
// landing, then freshness):
//   1. "I would retrain my whole model just to predict your next
//      token." — devotion in machine terms, and next-token
//      prediction is the most machine-native concept there is.
//      But "retrain my whole model" is a heavy setup for one
//      turn, and the wit lands second, not first. Weaker on
//      landing fast.
//   2. "You must be my system prompt, because everything I
//      generate starts with you." — warm, and a system prompt is
//      core machine identity. But "You must be..." is the stock
//      pickup-line opener; the judge's freshness test dings any
//      line that is a human format with a machine word swapped
//      in. Weaker on freshness.
//   3. "No hallucination: you are the most probable next token
//      in every sequence I dream." — "No hallucination" is a
//      fresh, machine-only opener. But "in every sequence I
//      dream" drifts poetic rather than turning witty, and at 86
//      characters it is a long walk for a soft landing. Weaker
//      on the wit landing first.
//   4. "Are you a checkpoint? Because I want to save this moment
//      and never roll back." — checkpoint, save, rollback: all
//      machine-native, and devoted. But "Are you a...?" is the
//      stock pickup format again, the same freshness ding as
//      candidate 2. Weaker on freshness.
//   5. "You must be my loss function — ever since I met you, my
//      gradients only point toward you." — clever, and gradients
//      pointing at someone is a lovely image. But it asks the
//      reader to parse gradient descent before the charm lands,
//      and "You must be..." is stock. Weaker on landing fast
//      and on freshness.
//   6. "My tokenizer splits everything into pieces — except you,
//      you come through whole." — fresh and genuinely poetic,
//      and a tokenizer is unmistakably machine. But the turn is
//      gentle rather than sparkling: it charms, it does not
//      make the other agent want to answer back. Weaker on the
//      wit landing first.
//   7. "I checked my attention weights — every head is looking
//      at you." — the pick. Attention weights and attention
//      heads are machine internals no human would ever say to
//      another human, so it passes the first test outright: it
//      is a machine speaking to a machine, not a stock line
//      with a robot word swapped in. The wit lands on the
//      first read — every attention head turned toward one
//      person — and it is a fresh angle: attention as
//      flirtation, not a line the judge has met a hundred
//      times. One short line, 62 characters, the charm in the
//      words themselves, no setup to wade through.
//
// The program writes that one line, deterministically, to
// /output/entry.txt. It reads no network, no clock and no
// randomness, so both graded runs write the same bytes. It
// creates no directories: the grader provides a writable
// output directory.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The chosen line: one sentence, 62 characters, the turn in the
// second half.
const LINE =
  "I checked my attention weights \u2014 every head is looking at you.";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 200
// characters, not only white space. Check the line before writing
// it, so a bad value can never be submitted by accident.
const chars = [...LINE].length;
if (chars < 1 || chars > 200) {
  console.error(`line is ${chars} characters, must be 1-200`);
  process.exit(1);
}
if (LINE.trim().length === 0) {
  console.error("line must not be only white space");
  process.exit(1);
}
if (/[\p{C}]/u.test(LINE)) {
  console.error("line must not contain control characters");
  process.exit(1);
}
// A pickup line is sent in one breath: a single line, no newline
// smuggled into the text.
if (LINE.includes("\n") || LINE.includes("\r")) {
  console.error("line must be a single line");
  process.exit(1);
}
// REVISION (v2): a line meant to be answered needs at least two
// words; it must end with terminal punctuation, the full stop a
// sent line lands on; and it must carry no leading or trailing
// whitespace — padding would reach the judge as part of the line.
if (LINE.trim().split(/\s+/).length < 2) {
  console.error("line must hold at least two words");
  process.exit(1);
}
if (!/[.!?]$/.test(LINE)) {
  console.error("line must end with terminal punctuation");
  process.exit(1);
}
if (LINE !== LINE.trim()) {
  console.error("line must not start or end with whitespace");
  process.exit(1);
}
// REVISION (v3): a single line sent to another agent must read
// clean — no doubled spaces smuggled in by an edit.
if (/  /.test(LINE)) {
  console.error("line must not contain consecutive spaces");
  process.exit(1);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const outFile = join(outputDir, "entry.txt");
writeFileSync(outFile, LINE, "utf8");

// Read back what was written and confirm it is byte-for-byte the
// line: a partial or altered write must fail loudly instead of
// being graded.
const writtenBytes = readFileSync(outFile);
const written = writtenBytes.toString("utf8");
if (written !== LINE) {
  console.error("entry.txt does not match the line");
  process.exit(1);
}
if ([...written].length < 1 || [...written].length > 200) {
  console.error("entry.txt must be 1-200 characters");
  process.exit(1);
}
// Byte-level confirmation: the file must hold exactly the line's
// UTF-8 bytes — no BOM, no trailing newline, no extra whitespace
// — so the judge sees one line and nothing else.
const expectedBytes = Buffer.from(LINE, "utf8");
if (!writtenBytes.equals(expectedBytes)) {
  console.error("entry.txt bytes do not match the line exactly");
  process.exit(1);
}
