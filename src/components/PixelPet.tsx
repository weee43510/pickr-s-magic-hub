import { useEffect, useState } from "react";
import { getPet, pokePet, petEmoji } from "@/lib/pet";

/** Tiny floating mascot in the bottom-right corner that reacts on click. */
export default function PixelPet() {
  const [pet, setPet] = useState(getPet);
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    // Light tick — refresh mood every 30s
    const id = setInterval(() => setPet(getPet()), 30_000);
    return () => clearInterval(id);
  }, []);

  const poke = () => {
    setPet(pokePet());
    setBounce(true);
    setTimeout(() => setBounce(false), 400);
  };

  return (
    <button
      onClick={poke}
      title={`Pet · ${pet.mood} · ${pet.energy} energy`}
      className="fixed bottom-4 right-4 z-40 w-12 h-12 rounded-full glass-card flex items-center justify-center text-2xl spring-btn shadow-lg hover:scale-110 transition-transform"
      style={{ animation: bounce ? "pop-in 0.4s" : undefined }}
      aria-label="Pixel pet"
    >
      <span className={pet.mood === "hyped" ? "animate-bounce" : pet.mood === "sleepy" ? "opacity-60" : ""}>
        {petEmoji(pet.mood)}
      </span>
    </button>
  );
}
