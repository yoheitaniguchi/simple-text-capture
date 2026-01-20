export interface CaptureSlot {
    template: string;
    targetHeader: string;
}

export interface SimpleTextCaptureSettings {
    slots: CaptureSlot[];
    modalBackgroundColor: string;
    inputBackgroundColor: string;
}
