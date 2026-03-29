import { includedItems, rules } from "@/data/care";
import CareIncludedCard from "../ui/care/CareIncludeCard";
import CareRuleItem from "../ui/care/CareRuleItem";
import RevealSection from "../ui/RevealSection";
import SectionHeader from "../ui/SectionHeader";

export default function Care() {
  return (
    <RevealSection
      id="care"
      className="relative overflow-hidden bg-red-deep px-6 py-24 md:px-16"
    >
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-[.07]" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeader
          label="Забота об изделии"
          className="mb-16"
          labelColorClassName="text-(--red-light)"
          titleClassName="text-[clamp(2rem,4vw,3.5rem)]"
          title={
            <>
              <span className="text-white">Как ухаживать</span>
              <br />
              <em className="text-[#ffb8bc]">за кружкой</em>
            </>
          }
          descriptionClassName="max-w-[480px] text-[.95rem] text-white/78"
          description={
            <>
              К каждому изделию прилагается памятка и специальное средство - всё
              необходимое уже внутри.
            </>
          }
        />

        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            {includedItems.map((item) => (
              <CareIncludedCard key={item.title} item={item} />
            ))}
          </div>

          <div className="text-white">
            <p className="section-label mb-8 text-red-light">Простые правила</p>
            <div className="space-y-0 border-t border-white/10">
              {rules.map((rule, index) => (
                <CareRuleItem
                  key={rule.number}
                  rule={rule}
                  withBottomBorder={index !== rules.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </RevealSection>
  );
};
