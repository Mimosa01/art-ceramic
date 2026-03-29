import clsx from 'clsx';

type LogoProps = {
  variant: 'primary' | 'inverse';
};

export default function Logo({ variant }: LogoProps) {
  return (
    <div
      className={clsx(
        "relative inline-block rounded-[25px] border px-3 py-1 font-['Cormorant_Garamond',serif] text-2xl font-light tracking-[0.2em]",
        'before:pointer-events-none before:absolute before:-left-[3px] before:-top-[3px] before:size-3 before:rounded-tl-[25px] before:border-l-2 before:border-t-2 before:content-[\'\']',
        'after:pointer-events-none after:absolute after:-bottom-[3px] after:-right-[3px] after:size-3 after:rounded-br-[25px] after:border-b-2 after:border-r-2 after:content-[\'\']',
        variant === 'primary' && [
          'border-[var(--red-light)] text-[var(--red-mid)]',
          'before:border-l-[var(--red-accent)] before:border-t-[var(--red-accent)]',
          'after:border-b-[var(--red-accent)] after:border-r-[var(--red-accent)]',
        ],
        variant === 'inverse' && [
          'border-[var(--warm-white)] text-[var(--warm-white)]',
          'before:border-l-[var(--red-light)] before:border-t-[var(--red-light)]',
          'after:border-b-[var(--red-light)] after:border-r-[var(--red-light)]',
        ],
      )}
    >
      А И
    </div>
  );
}
