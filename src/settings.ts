import { App, PluginSettingTab, Setting } from 'obsidian';
import SimpleTextCapturePlugin from './main';

export class SimpleTextCaptureSettingTab extends PluginSettingTab {
    plugin: SimpleTextCapturePlugin;

    constructor(app: App, plugin: SimpleTextCapturePlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Simple Text Capture Settings' });
        containerEl.createEl('p', { text: 'Assign keys to "Capture (Slot X)" commands via Obsidian Hotkeys settings.' });

        for (let i = 0; i < 5; i++) {
            const slot = this.plugin.settings.slots[i];
            const slotNum = i + 1;

            containerEl.createEl('h3', { text: `Slot ${slotNum}` });

            // Target Header Setting
            new Setting(containerEl)
                .setName('Target Header')
                .setDesc('Append text under this header (e.g. "Daily Log"). If empty or not found, appends to end of file.')
                .addText(text => text
                    .setPlaceholder('Daily Log')
                    .setValue(slot.targetHeader)
                    .onChange(async (value) => {
                        slot.targetHeader = value;
                        await this.plugin.saveSettings();
                    }));

            new Setting(containerEl)
                .setName('Template')
                .setDesc('Use {$input} and {{date}}')
                .addTextArea(text => {
                    text
                        .setPlaceholder('\n## {{date}}\n{$input}\n')
                        .setValue(slot.template)
                        .onChange(async (value) => {
                            slot.template = value;
                            await this.plugin.saveSettings();
                        });
                    text.inputEl.style.width = '30ch';
                    text.inputEl.style.minWidth = '200px';
                });
        }

        containerEl.createEl('h2', { text: 'Appearance' });

        new Setting(containerEl)
            .setName('Modal Background Color')
            .setDesc('Background color of the capture window.')
            .addColorPicker(color => color
                .setValue(this.plugin.settings.modalBackgroundColor)
                .onChange(async (value) => {
                    this.plugin.settings.modalBackgroundColor = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Input Area Background Color')
            .setDesc('Background color of the text input area.')
            .addColorPicker(color => color
                .setValue(this.plugin.settings.inputBackgroundColor)
                .onChange(async (value) => {
                    this.plugin.settings.inputBackgroundColor = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Reset Colors')
            .setDesc('Restore default colors.')
            .addButton(button => button
                .setButtonText('Reset')
                .onClick(async () => {
                    this.plugin.settings.modalBackgroundColor = '#202020';
                    this.plugin.settings.inputBackgroundColor = '#161616';
                    await this.plugin.saveSettings();
                    this.display(); // Refresh settings UI
                }));
    }
}
