import { toast } from "sonner";

interface SnapshotOptions {
  filename?: string;
  bg?: string;
}

/** 
 * Export a DOM element as a downloadable PNG using html-to-image-style canvas rendering.
 * Lightweight: uses html2canvas via dynamic import. We avoid that dep here and use a 
 * simpler SVG foreignObject technique.
 */
export async function snapshotElement(el: HTMLElement, opts: SnapshotOptions = {}) {
  const { filename = `randomizr-${Date.now()}.png`, bg = "#0F1118" } = opts;
  try {
    const rect = el.getBoundingClientRect();
    const w = Math.ceil(rect.width);
    const h = Math.ceil(rect.height);
    // Inline computed styles into a clone so the SVG renders correctly
    const clone = el.cloneNode(true) as HTMLElement;
    // Strip interactive bits
    clone.querySelectorAll("button, input, textarea").forEach((n) => (n as HTMLElement).style.pointerEvents = "none");

    const xhtml = new XMLSerializer().serializeToString(clone);
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="background:${bg};padding:24px;color:#fff;font-family:Inter,sans-serif">
            ${xhtml}
          </div>
        </foreignObject>
      </svg>`.trim();

    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = rej;
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = w * 2; // 2x for retina
    canvas.height = h * 2;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(2, 2);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    canvas.toBlob((b) => {
      if (!b) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(b);
      a.download = filename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      toast.success("📸 Snapshot saved!");
    }, "image/png");
  } catch (e) {
    console.error(e);
    toast.error("Snapshot failed — try a different element");
  }
}

/** Build a sharable result-card element on the fly and snapshot it. */
export async function snapshotResultCard(opts: { title: string; result: string; subtitle?: string; emoji?: string }) {
  const card = document.createElement("div");
  card.style.cssText = `
    width: 600px; padding: 48px; border-radius: 24px;
    background: linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 50%, #0c2c4a 100%);
    color: white; font-family: 'Space Grotesk', Inter, sans-serif;
    text-align: center;
  `;
  card.innerHTML = `
    <div style="font-size:14px;letter-spacing:0.3em;opacity:0.6;text-transform:uppercase">RANDOMIZR</div>
    <div style="font-size:64px;margin:16px 0">${opts.emoji ?? "✨"}</div>
    <div style="font-size:20px;opacity:0.8;margin-bottom:12px">${opts.title}</div>
    <div style="font-size:48px;font-weight:900;background:linear-gradient(120deg,#00f0ff,#ff00ea);-webkit-background-clip:text;background-clip:text;color:transparent">
      ${opts.result}
    </div>
    ${opts.subtitle ? `<div style="font-size:14px;opacity:0.6;margin-top:12px">${opts.subtitle}</div>` : ""}
    <div style="font-size:11px;letter-spacing:0.2em;opacity:0.4;margin-top:32px">randomizr.app</div>
  `;
  document.body.appendChild(card);
  await snapshotElement(card, { filename: `randomizr-${opts.title.toLowerCase().replace(/\s+/g, "-")}.png` });
  document.body.removeChild(card);
}
