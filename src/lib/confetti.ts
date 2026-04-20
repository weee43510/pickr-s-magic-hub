import confetti from "canvas-confetti";

/** 
 * Minimal lag version: 
 * - Fixed low particle count (max 15)
 * - No infinite loops/frames
 * - Single burst only
 */
export function celebrate() {
  confetti({
    particleCount: 15,
    spread: 50,
    origin: { y: 0.8 },
    ticks: 150, // Disappears faster to save memory
    colors: ["#00f0ff", "#ff00ea"],
    disableForReducedMotion: true
  });
}

/** Disabled to prevent lag */
export function cannons() {
  celebrate(); 
}

/** Minimal emoji burst */
export function emojiRain(emoji: string) {
  const shape = confetti.shapeFromText({ text: emoji, scalar: 2 });
  confetti({
    particleCount: 5,
    shapes: [shape],
    origin: { y: 0.5 },
    scalar: 2
  });
}
