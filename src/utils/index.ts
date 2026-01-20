
/**
 * Formats a date object to "yy/MM/dd HH:mm" string.
 * @param date The date to format
 * @returns Formatted string e.g. "24/05/20 18:30"
 */
export function getFormattedDate(date: Date): string {
    const yy = date.getFullYear().toString().slice(-2);
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    const HH = date.getHours().toString().padStart(2, '0');
    const MM = date.getMinutes().toString().padStart(2, '0');
    return `${yy}/${mm}/${dd} ${HH}:${MM}`;
}

/**
 * Applies template replacements.
 * @param template The template string containing {$input} and {{date}}
 * @param input The user input text
 * @param dateStr The formatted date string
 * @returns The final string
 */
export function applyTemplate(template: string, input: string, dateStr: string): string {
    return template
        .replace('{$input}', () => input)
        .replace('{{date}}', () => dateStr);
}

/**
 * Normalizes a header string by removing leading hashes and whitespace.
 * e.g. "## My Header" -> "My Header"
 * @param header The header string
 * @returns Normalized header
 */
export function normalizeHeader(header: string): string {
    return header.replace(/^#+\s*/, '');
}

/**
 * Calculates the line number to insert text based on target header.
 * @param lines The lines of the file content
 * @param headings The list of heading objects (from MetadataCache)
 * @param targetHeader The target header text (raw input)
 * @returns The line number (0-indexed) where text should be inserted. Returns -1 if no specific header logic applied (append to end).
 */
export function calculateInsertPosition(lines: string[], headings: { heading: string, level: number, position: { start: { line: number }, end: { line: number } } }[], targetHeader: string): number {
    if (!targetHeader) return -1;

    const cleanTarget = normalizeHeader(targetHeader);

    // Find matching header
    const foundHeader = headings.find(h => h.heading === cleanTarget || h.heading === targetHeader);

    if (!foundHeader) return -1;

    // Find the NEXT header of same or higher level (lower number)
    const nextHeader = headings.find(h =>
        h.position.start.line > foundHeader.position.start.line &&
        h.level <= foundHeader.level
    );

    if (nextHeader) {
        return nextHeader.position.start.line;
    } else {
        // No next header, return end of file
        return lines.length;
    }
}
