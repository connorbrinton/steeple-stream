declare global {
  interface Window {
    Hls: any;
    SteepleComponent: any;
    SteeplePlayer: any;
    steepleRole: string;
  }

  interface Element {
    dataset: DOMStringMap;
    disabled: boolean;
    focus(): void;
    hidden: any;
    range: any;
    reset(): void;
    style: CSSStyleDeclaration;
    title: string;
    value: string;
  }

  interface HTMLElement {
    fullscreenElement: any;
    mediaStore: any;
  }

  interface HTMLVideoElement {
    steepleIsLive: boolean;
    steepleTimeline: any;
  }
}

export {};
