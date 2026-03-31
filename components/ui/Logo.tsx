import Image from "next/image";

export default function Logo() {

  return (
    <span className="inline-flex shrink-0">
      <Image
        src={"/images/logo-light.png"}
        alt="ИЗА"
        width={400}
        height={140}
        className="h-16 w-auto max-w-[min(85vw,22rem)] object-contain object-left md:h-20"
        sizes="(max-width: 768px) min(85vw, 22rem), 400px"
      />
    </span>
  );
}
