import { CaptureSlot, SimpleTextCaptureSettings } from './types';

export const DEFAULT_SLOT: CaptureSlot = {
    template: '\n## {{date}}\n{$input}\n',
    targetHeader: ''
};

export const DEFAULT_SETTINGS: SimpleTextCaptureSettings = {
    slots: [
        { ...DEFAULT_SLOT },
        { ...DEFAULT_SLOT },
        { ...DEFAULT_SLOT },
        { ...DEFAULT_SLOT },
        { ...DEFAULT_SLOT }
    ],
    modalBackgroundColor: '#202020', // Default dark
    inputBackgroundColor: '#161616'  // Default darker input
}
