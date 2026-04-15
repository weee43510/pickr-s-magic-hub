import { useState } from "react";
import AppSidebar, { type ToolId } from "@/components/AppSidebar";
import AiMystic from "@/components/tools/AiMystic";
import FingerRoulette from "@/components/tools/FingerRoulette";
import PhotoWheel from "@/components/tools/PhotoWheel";
import RankingBoard from "@/components/tools/RankingBoard";
import TeamSplitter from "@/components/tools/TeamSplitter";
import CoinDice from "@/components/tools/CoinDice";

const toolComponents: Record<ToolId, React.FC> = {
  mystic: AiMystic,
  roulette: FingerRoulette,
  wheel: PhotoWheel,
  ranking: RankingBoard,
  teams: TeamSplitter,
  coinDice: CoinDice,
};

export default function Index() {
  const [activeTool, setActiveTool] = useState<ToolId>("mystic");
  const [collapsed, setCollapsed] = useState(false);

  const ActiveComponent = toolComponents[activeTool];

  return (
    <div className="gradient-bg-animated min-h-screen">
      <AppSidebar
        active={activeTool}
        onSelect={setActiveTool}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <main
        className={`transition-all duration-300 min-h-screen p-6 ${collapsed ? "ml-16" : "ml-56"}`}
      >
        <div className="max-w-5xl mx-auto">
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
}
