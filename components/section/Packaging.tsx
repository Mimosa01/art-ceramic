import { packagingFeatures } from "@/data/packaging";
import Image from "next/image";
import PackagingCta from "../ui/packaging/PackagingCTA";
import PackagingFeatureCard from "../ui/packaging/PackagingFeature";
import RevealSection from "../ui/RevealSection";
import SectionHeader from "../ui/SectionHeader";

export default function Packaging() {
  return (
    <RevealSection
      id="packaging"
      className="bg-(--warm-white) px-6 py-24 md:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="Упаковка"
          className="mb-16"
          titleClassName="text-[clamp(2rem,4vw,3.5rem)]"
          title={
            <>
              Упаковка - это
              <br />
              <em className="text-(--red-mid)">тоже часть подарка</em>
            </>
          }
          description={
            <>
              Каждая кружка уходит к владельцу готовой к вручению. Разворачивать
              её - уже маленький праздник.
            </>
          }
        />

        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <div className="relative min-h-[340px] overflow-hidden rounded-[25px] border border-white/10 bg-white/5">
            <Image
              src="/images/pack.jpg"
              alt="Фото подарочной упаковки"
              className="aspect-4/3 w-full object-cover"
              loading="lazy"
              width={500}
              height={500}
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-(--red-deep)/45 via-transparent to-transparent" />
          </div>

          <div className="flex flex-col justify-between">
            {packagingFeatures.map((feature) => (
              <PackagingFeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
        <PackagingCta />
      </div>
    </RevealSection>
  );
};
