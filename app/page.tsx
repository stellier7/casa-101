import { CinematicHero } from "@/components/CinematicHero";
import { EditorialClose } from "@/components/EditorialClose";
import { ImmersiveStory } from "@/components/ImmersiveStory";
import { MassingChapter } from "@/components/MassingChapter";
import { SiteChrome } from "@/components/SiteChrome";

export default function Home() {
  return (
    <main className="w-full bg-black">
      <SiteChrome />
      <CinematicHero />
      <ImmersiveStory />
      <MassingChapter />
      <EditorialClose />
    </main>
  );
}
