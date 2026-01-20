import { App, Modal, Notice, MarkdownView } from 'obsidian';
import { getFormattedDate, applyTemplate, calculateInsertPosition } from './utils';
import { CaptureSlot, SimpleTextCaptureSettings } from './types';

export class SimpleTextCaptureModal extends Modal {
    slot: CaptureSlot;
    settings: SimpleTextCaptureSettings;
    isComposing: boolean = false;

    constructor(app: App, slot: CaptureSlot, settings: SimpleTextCaptureSettings) {
        super(app);
        this.slot = slot;
        this.settings = settings;
    }

    onOpen() {
        const { contentEl } = this;

        this.modalEl.addClass('simple-text-capture-modal-container');

        // Apply custom modal background if set
        if (this.settings.modalBackgroundColor) {
            this.modalEl.style.backgroundColor = this.settings.modalBackgroundColor;
        }

        contentEl.addClass('simple-text-capture-modal-content');

        const textarea = contentEl.createEl('textarea', {
            value: ''
        });

        // Apply custom input background if set
        if (this.settings.inputBackgroundColor) {
            textarea.style.backgroundColor = this.settings.inputBackgroundColor;
        }

        setTimeout(() => {
            textarea.focus();
            // Move cursor to end (though it's empty, good practice if we prefill later)
            // const len = textarea.value.length;
            // textarea.setSelectionRange(len, len);
        }, 100);

        // Robust IME handling
        textarea.addEventListener('compositionstart', () => {
            this.isComposing = true;
        });

        textarea.addEventListener('compositionend', () => {
            this.isComposing = false;
        });

        textarea.addEventListener('keydown', async (e) => {
            if (this.isComposing || e.isComposing) return;
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                await this.saveNote(textarea.value);
                this.close();
            }
        });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }

    async saveNote(content: string) {
        if (!content.trim()) return;

        const dateStr = getFormattedDate(new Date());
        const finalContent = applyTemplate(this.slot.template, content, dateStr);

        // Get Active Markdown File
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!activeView) {
            new Notice("No active Markdown file found to capture text.");
            return;
        }

        const file = activeView.file;
        if (!file) return;

        let fileContent = await this.app.vault.read(file);
        let targetHeader = this.slot.targetHeader;

        // Split lines for insertion
        const lines = fileContent.split('\n');

        let insertIndex = -1;
        if (targetHeader) {
            const metadata = this.app.metadataCache.getFileCache(file);
            const headings = metadata?.headings || [];
            insertIndex = calculateInsertPosition(lines, headings, targetHeader);
        }

        if (insertIndex !== -1) {
            lines.splice(insertIndex, 0, finalContent);
            fileContent = lines.join('\n');
        } else {
            if (insertIndex === -1 && targetHeader) {
                fileContent += '\n' + finalContent;
            } else if (insertIndex === -1 && !targetHeader) {
                fileContent += '\n' + finalContent;
            } else {
                lines.splice(insertIndex, 0, finalContent);
                fileContent = lines.join('\n');
            }
        }

        await this.app.vault.modify(file, fileContent);
        new Notice('Saved to active file');
    }
}
