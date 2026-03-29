import { CareRule } from "@/data/care";


type CareRuleItemProps = {
  rule: CareRule;
  withBottomBorder?: boolean;
};

export default function CareRuleItem({
  rule,
  withBottomBorder = true,
}: CareRuleItemProps) {
  return (
    <div
      className={`flex items-start gap-5 py-6 ${withBottomBorder ? "border-b border-white/10" : ""}`}
    >
      <span className="shrink-0 font-cormorant-garamond text-[1.5rem] leading-none text-(--red-light)">
        {rule.number}
      </span>
      <div>
        <p className="font-cormorant-garamond text-[1.1rem] text-[#ffb8bc]">
          {rule.title}
        </p>
        <p className="mt-1 text-sm font-light leading-relaxed text-white/75">
          {rule.description}
        </p>
      </div>
    </div>
  );
}