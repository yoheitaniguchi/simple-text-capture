import { Plugin } from 'obsidian';
import { SimpleTextCaptureSettings } from './types';
import { DEFAULT_SETTINGS, DEFAULT_SLOT } from './constants';
import { SimpleTextCaptureModal } from './modal';
import { SimpleTextCaptureSettingTab } from './settings';

export default class SimpleTextCapturePlugin extends Plugin {
    settings: SimpleTextCaptureSettings;

    async onload() {
        await this.loadSettings();
        await this.ensureSettings();

        for (let i = 0; i < 5; i++) {
            const slotIndex = i;
            const slotNumber = i + 1;

            this.addCommand({
                id: `open-slot-${slotNumber}`,
                name: `Capture (Slot ${slotNumber})`,
                callback: () => {
                    new SimpleTextCaptureModal(this.app, this.settings.slots[slotIndex], this.settings).open();
                }
            });
        }

        this.addSettingTab(new SimpleTextCaptureSettingTab(this.app, this));
    }

    onunload() {
    }


    async ensureSettings() {
        if (!this.settings.slots || this.settings.slots.length < 5) {
            this.settings.slots = this.settings.slots || [];
            while (this.settings.slots.length < 5) {
                // Ensure deep copy of defaults
                this.settings.slots.push({ ...DEFAULT_SLOT });
            }
            await this.saveSettings();
        }

        // Backfill missing properties for existing slots
        let updated = false;
        this.settings.slots.forEach(s => {
            if (typeof s.targetHeader === 'undefined') { s.targetHeader = ''; updated = true; }
        });

        if (typeof this.settings.modalBackgroundColor === 'undefined') {
            this.settings.modalBackgroundColor = DEFAULT_SETTINGS.modalBackgroundColor;
            updated = true;
        }
        if (typeof this.settings.inputBackgroundColor === 'undefined') {
            this.settings.inputBackgroundColor = DEFAULT_SETTINGS.inputBackgroundColor;
            updated = true;
        }

        if (updated) await this.saveSettings();
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
