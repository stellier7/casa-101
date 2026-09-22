import { CinematicHero } from "@/components/CinematicHero";
import { EditorialClose } from "@/components/EditorialClose";
import { ImmersiveStory } from "@/components/ImmersiveStory";
import { MassingChapter } from "@/components/MassingChapter";
import { QuietViewProvider, QuietViewToggle } from "@/components/QuietView";
import { SiteChrome } from "@/components/SiteChrome";
import { SmoothScroll } from "@/components/SmoothScroll";

export default function Home() {
  return (
    <main className="w-full bg-black">
      <QuietViewProvider>
        <SmoothScroll>
          <SiteChrome />
          <CinematicHero />
          <ImmersiveStory />
          <MassingChapter />
          <EditorialClose />
          <QuietViewToggle />
        </SmoothScroll>
      </QuietViewProvider>
    </main>
  );
}
