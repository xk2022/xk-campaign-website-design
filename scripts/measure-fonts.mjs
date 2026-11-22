import { chromium } from "@playwright/test";
import { existsSync } from "node:fs";

const input = process.argv[2];
if (!input) {
  console.error("Usage: node scripts/measure-fonts.mjs http://127.0.0.1:3007/");
  process.exit(1);
}
const target = new URL(input);
if (!["http:", "https:"].includes(target.protocol)) {
  throw new Error("The measurement URL must use HTTP or HTTPS.");
}

const executablePath =
  process.env.CHROMIUM_PATH ??
  (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);
const browser = await chromium.launch({ executablePath });

try {
  // Each run starts a fresh context with no previous page/font cache.
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  await context.addInitScript(() => {
    const state = { supported: false, value: 0 };
    window.__xkFontLabCLS = state;
    let sessionStart = 0;
    let previousShift = 0;
    let sessionValue = 0;
    try {
      if (!PerformanceObserver.supportedEntryTypes?.includes("layout-shift")) {
        return;
      }
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.hadRecentInput) continue;
          if (
            sessionValue > 0 &&
            entry.startTime - previousShift < 1000 &&
            entry.startTime - sessionStart < 5000
          ) {
            sessionValue += entry.value;
          } else {
            sessionStart = entry.startTime;
            sessionValue = entry.value;
          }
          previousShift = entry.startTime;
          state.value = Math.max(state.value, sessionValue);
        }
      });
      observer.observe({ type: "layout-shift", buffered: true });
      state.supported = true;
    } catch {
      // Unsupported browsers report null rather than a misleading zero score.
    }
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  const response = await page.goto(target.toString());
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );

  const metrics = await page.evaluate(() => {
    const resources = performance.getEntriesByType("resource");
    const aggregate = (pattern) => {
      const files = resources.filter((resource) => pattern.test(resource.name));
      return {
        requests: files.length,
        encodedBodySize: files.reduce((sum, file) => sum + file.encodedBodySize, 0),
        decodedBodySize: files.reduce((sum, file) => sum + file.decodedBodySize, 0),
        transferSize: files.reduce((sum, file) => sum + file.transferSize, 0),
        files: files.map((file) => ({
          name: file.name.split("/").at(-1),
          encodedBodySize: file.encodedBodySize,
        })),
      };
    };
    const cls = window.__xkFontLabCLS;
    return {
      url: location.href,
      viewport: {
        width: innerWidth,
        height: innerHeight,
        deviceScaleFactor: devicePixelRatio,
      },
      documentWidth: document.documentElement.scrollWidth,
      fontStack: getComputedStyle(document.body).fontFamily,
      fonts: aggregate(/\.woff2?(?:\?|$)/),
      css: aggregate(/\.css(?:\?|$)/),
      labCLS: cls?.supported ? cls.value : null,
    };
  });

  console.log(
    JSON.stringify(
      {
        conditions:
          "Cold Chromium context, 375×812, DPR 1, mobile/touch; load + networkidle + document.fonts.ready, before scrolling.",
        limitations:
          "ResourceTiming body bytes and a local load-window CLS observation only. These are lab measurements, not field Core Web Vitals or a public-network performance claim.",
        status: response?.status() ?? null,
        ...metrics,
        pageErrors,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
