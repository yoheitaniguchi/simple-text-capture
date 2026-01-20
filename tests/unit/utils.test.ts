import { getFormattedDate, applyTemplate, normalizeHeader, calculateInsertPosition } from '../../src/utils';

describe('Date Formatting', () => {
    test('formats date correctly as yy/MM/dd HH:mm', () => {
        const date = new Date('2024-05-20T18:30:00');
        expect(getFormattedDate(date)).toBe('24/05/20 18:30');
    });

    test('pads single digits correctly', () => {
        const date = new Date('2024-01-05T09:05:00');
        expect(getFormattedDate(date)).toBe('24/01/05 09:05');
    });
});

describe('Template Application', () => {
    test('replaces placeholders correctly', () => {
        const template = "Date: {{date}}, content: {$input}";
        const input = "Hello World";
        const date = "24/01/01 00:00";
        expect(applyTemplate(template, input, date)).toBe("Date: 24/01/01 00:00, content: Hello World");
    });
});

describe('Header Normalization', () => {
    test('removes leading hashes and space', () => {
        expect(normalizeHeader('## My Header')).toBe('My Header');
        expect(normalizeHeader('#MyHeader')).toBe('MyHeader');
    });

    test('leaves plain text alone', () => {
        expect(normalizeHeader('My Header')).toBe('My Header');
    });
});

describe('Insert Position Calculation', () => {
    const headings = [
        { heading: 'Section 1', level: 1, position: { start: { line: 0 }, end: { line: 0 } } },
        { heading: 'Subsection A', level: 2, position: { start: { line: 5 }, end: { line: 5 } } },
        { heading: 'Section 2', level: 1, position: { start: { line: 20 }, end: { line: 20 } } }
    ];
    const lines = new Array(30).fill(''); // Mock 30 lines

    test('returns start line of next section (same level)', () => {
        // Target: Section 1. Next same level is Section 2 at line 20.
        expect(calculateInsertPosition(lines, headings, 'Section 1')).toBe(20);
    });

    test('returns start line of next section (higher level)', () => {
        // Target: Subsection A. Next is Section 2 (Level 1 < Level 2) at line 20.
        expect(calculateInsertPosition(lines, headings, 'Subsection A')).toBe(20);
    });

    test('returns file length if no next section', () => {
        // Target: Section 2. No header after it.
        expect(calculateInsertPosition(lines, headings, 'Section 2')).toBe(30);
    });

    test('returns -1 if header not found', () => {
        expect(calculateInsertPosition(lines, headings, 'Non Existent')).toBe(-1);
    });

    test('handles hashed target input', () => {
        // Target: "## Subsection A". Should match "Subsection A".
        expect(calculateInsertPosition(lines, headings, '## Subsection A')).toBe(20);
    });
});
