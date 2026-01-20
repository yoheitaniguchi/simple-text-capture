
> simple-text-capture@1.0.0 test
> jest

(node:2384) Warning: `--localstorage-file` was provided without a valid path
(Use `node --trace-warnings ...` to show where the warning was created)
PASS tests/unit/utils.test.ts (6.985 s)
  Date Formatting
    ✓ formats date correctly as yy/MM/dd HH:mm (7 ms)
    ✓ pads single digits correctly (1 ms)
  Template Application
    ✓ replaces placeholders correctly (1 ms)
  Header Normalization
    ✓ removes leading hashes and space (1 ms)
    ✓ leaves plain text alone (2 ms)
  Insert Position Calculation
    ✓ returns start line of next section (same level) (1 ms)
    ✓ returns start line of next section (higher level) (1 ms)
    ✓ returns file length if no next section (2 ms)
    ✓ returns -1 if header not found
    ✓ handles hashed target input (1 ms)

Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        8.305 s, estimated 13 s
Ran all test suites.
