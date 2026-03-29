import { PackagingFeature } from "@/data/packaging";

type PackagingFeatureCardProps = {
  feature: PackagingFeature;
};

export default function PackagingFeatureCard({
  feature,
}: PackagingFeatureCardProps) {
  return (
    <div className="flex items-start gap-5 rounded-[25px] border border-[#f5dede] bg-white p-8">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-red-light">
        {feature.icon}
      </div>
      <div>
        <p className="section-label text-[.65rem]">{feature.label}</p>
        <p className="mt-1.5 font-cormorant-garamond text-[1.25rem] text-red-deep">
          {feature.title}
        </p>
        <p className="mt-2 text-[.85rem] leading-[1.65] font-light text-red-dark opacity-75">
          {feature.description}
        </p>
      </div>
    </div>
  );
}
