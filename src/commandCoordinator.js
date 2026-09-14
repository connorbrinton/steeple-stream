import { EventEmitter } from "node:events";
export class LocationCommandCoordinator extends EventEmitter {
    constructor({ service, ingestManager, mediaManager }) {
        super();
        this.service = service;
        this.ingestManager = ingestManager;
        this.mediaManager = mediaManager;
        this.ingestManager?.on?.("changed", () => this.emit("health-changed"));
    }
    async start(actor = null) {
        const state = await this.service.start(actor);
        await this.ingestManager.startForState(state);
        await this.mediaManager?.setRecording?.(true);
        return this.changed(await this.service.summary());
    }
    async end(actor = null) {
        await this.mediaManager?.setRecording?.(false);
        return this.changed(await this.service.end(actor));
    }
    async setMode(mode, actor = null) {
        const state = await this.service.setMode(mode, actor);
        await this.ingestManager.startForState(state);
        return this.changed(state);
    }
    async updateSource(source, actor = null) {
        const state = await this.service.updateSource(source, actor);
        await this.ingestManager.restartForState(state);
        return this.changed(state);
    }
    async updateCameraControlSource(source, actor = null) {
        const state = await this.service.updateCameraControlSource(source, actor);
        return this.changed(state);
    }
    async addConfiguredSource(source, actor = null) {
        const state = await this.service.addManualSource(source, actor);
        return this.changed(state);
    }
    async addManualSource(source, actor = null) {
        const state = await this.service.addManualSource(source, actor);
        return this.changed(state);
    }
    async recallPreset(presetId, actor = null) {
        const result = await this.service.recallPreset(presetId, actor);
        this.emit("changed");
        return result;
    }
    async capturePreset(presetId, actor = null) {
        const result = await this.service.capturePreset(presetId, actor);
        this.emit("changed");
        return result;
    }
    changed(state) {
        this.emit("changed", state);
        return state;
    }
}
