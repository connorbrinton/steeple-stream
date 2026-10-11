import { test, expect } from "@playwright/test";

for (const forceFallback of [false, true]) {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 844, height: 390 },
    { width: 1280, height: 800 },
  ]) {
    for (const contentHeight of [40, 300, 1400]) {
      test(`preview ${forceFallback ? "fallback" : "native"} stays discoverable and scrolls reliably: ${viewport.width}x${viewport.height}, ${contentHeight}`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport);
        if (forceFallback) {
          await page.addInitScript(() => {
            const supports = CSS.supports.bind(CSS);
            CSS.supports = (...args) =>
              args[0] === "animation-timeline" ? false : supports(...args);
          });
        }
        await page.goto("/broadcasts/stakecenter/broadcaster");
        await page.addStyleTag({
          content: `.operator-panel { height: ${contentHeight}px; overflow: hidden; }`,
        });
        await page.evaluate(
          () =>
            new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
        );
        const measure = () =>
          page.evaluate(() => {
            const scroll = document.scrollingElement;
            const preview = document.querySelector(".preview-panel").getBoundingClientRect();
            const controls = document.querySelector(".operator-panel").getBoundingClientRect();
            const probe = document.createElement("div");
            probe.style.cssText = "position:absolute;visibility:hidden;height:var(--preview-min-height)";
            document.querySelector(".broadcaster-layout").append(probe);
            const minHeight = probe.getBoundingClientRect().height;
            probe.remove();
            return {
              height: preview.height,
              minHeight,
              top: preview.top,
              controls: controls.top,
              scroll: scroll.scrollTop,
              max: scroll.scrollHeight - scroll.clientHeight,
              supported:
                CSS.supports("animation-timeline", "scroll(root)") ||
                document
                  .querySelector(".broadcaster-layout")
                  .classList.contains("preview-scroll-fallback"),
            };
          });
        const initial = await measure();
        expect(initial.supported).toBe(true);
        expect(initial.controls).toBeLessThanOrEqual(viewport.height * 0.9 + 1);
        await page.evaluate(() => window.scrollTo(0, 100000));
        await expect
          .poll(async () => {
            const value = await measure();
            return Math.abs(value.scroll - value.max);
          })
          .toBeLessThan(1);
        const bottom = await measure();
        expect(bottom.max).toBe(initial.max);
        if (initial.supported) {
          const expectedHeight = Math.max(
            initial.minHeight,
            initial.height - Math.max(0, bottom.scroll - initial.top),
          );
          await expect
            .poll(async () => Math.abs((await measure()).height - expectedHeight))
            .toBeLessThan(1);
          if (bottom.scroll >= initial.top) expect(Math.abs(bottom.top)).toBeLessThan(1);
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        await expect
          .poll(async () => Math.abs((await measure()).height - initial.height))
          .toBeLessThan(1);
      });
    }
  }
}
