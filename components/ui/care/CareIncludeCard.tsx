import { IncludedItem } from "@/data/care";


type CareIncludedCardProps = {
  item: IncludedItem;
};

export default function CareIncludedCard({ item }: CareIncludedCardProps) {
  return (
    <div className="flex items-start gap-6 rounded-[25px] border border-white/10 bg-white/5 p-6 backdrop-blur-[2px]">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-(--red-mid)">
        {item.icon}
      </div>
      <div>
        <p className="section-label text-[.65rem] text-(--red-light)">
          В комплекте
        </p>
        <p className="mt-2 font-cormorant-garamond text-[1.3rem] font-light text-white">
          {item.title}
        </p>
        <p className="mt-2 text-sm font-light leading-relaxed text-white/75">
          {item.description}
        </p>
      </div>
    </div>
  );
}