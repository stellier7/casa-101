import { PhotoFrame } from "@/components/PhotoFrame";
import { PROPERTY } from "@/lib/property";

export function ImmersiveStory() {
  return (
    <div id="recorrido" className="w-full bg-black">
      {PROPERTY.photos.map((photo, index) => (
        <PhotoFrame
          key={photo.src}
          photo={photo}
          photoIndex={index}
          priority={index === 0}
        />
      ))}
    </div>
  );
}
