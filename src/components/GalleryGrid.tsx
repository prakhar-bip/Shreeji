import { galleryItems, type GalleryItem } from "@/data/gallery";
import { track } from "@/lib/analytics";

export function GalleryGrid({ items = galleryItems }: { items?: GalleryItem[] }) {
  return (
    <ul className="grid auto-rows-[9.5rem] grid-cols-2 gap-3 md:auto-rows-[12rem] md:grid-cols-4">
      {items.map((item) => (
        <li
          key={item.id}
          className={[
            "card-soft group relative",
            item.shape === "tall" ? "row-span-2" : "",
            item.shape === "wide" ? "col-span-2" : "",
          ].join(" ")}
          onClick={() => track("gallery_open", { image: item.id })}
        >
          <img
            src={item.src}
            alt={item.alt}
            width={1024}
            height={768}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 pt-6 pb-2 text-xs font-semibold text-white">
            {item.caption}
          </span>
        </li>
      ))}
    </ul>
  );
}
