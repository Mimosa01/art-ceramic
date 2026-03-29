"use client"

import { useIsMdUp } from "@/hooks/useMediaQuery";
import { useGalleryStore } from "@/store/galleryStore";
import { useModalStore } from "@/store/modalStore";
import { useEffect } from "react";
import Button from "../ui/Button";
import { DesktopCarousel } from "../ui/DesctopCarousel";
import { TikTokGallery } from "../ui/VerticalCarousel";
import SectionHeader from "../ui/SectionHeader";
import clsx from "clsx";
import RevealSection from "../ui/RevealSection";

export default function Gallery() {
  const isDesktop = useIsMdUp();
  const items = useGalleryStore((s) => s.items);
  const listStatus = useGalleryStore((s) => s.listStatus);
  const listError = useGalleryStore((s) => s.listError);
  const loadGallery = useGalleryStore((s) => s.loadGallery);
  const openModal = useModalStore((s) => s.openModal);

  useEffect(() => {
    void loadGallery();
  }, [loadGallery]);

  const handleOpenModal = (payload: string | null) => {
    openModal(payload);
  };

  return (
    <RevealSection
      id="mugs"
      className={clsx(
        'relative overflow-hidden py-28 px-6 md:px-16',
        'bg-warm-white',
        'before:pointer-events-none before:absolute before:-top-[200px] before:-right-[150px] before:size-[600px] before:rounded-full before:border before:border-white/6',
        'after:pointer-events-none after:absolute after:-bottom-[150px] after:-left-[100px] after:size-[400px] after:rounded-full after:border after:border-white/4',
      )}
    >
      <div className="relative z-10 px-6 py-[5.6rem] md:px-16">
        <div className="dot-grid absolute inset-0 opacity-40 pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <SectionHeader
            label="Работы"
            title={
              <>
                Каждая кружка -
                <br />
                <em>маленькое произведение</em>
              </>
            }
            description={
              <>
                <span className="md:hidden">
                  Листайте работы вверх или нажмите «Хочу такую же» - оформим
                  заявку на похожую кружку.
                </span>
                <span className="hidden md:inline">
                  Листайте карусель или откройте карточку - можно заказать работу
                  в том же стиле или свою идею.
                </span>
              </>
            }
          />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {listStatus === "loading" && items.length === 0 ? (
              <div className="col-span-full text-center text-sm text-red-700 py-12">
                <p>Загрузка работ...</p>
              </div>
            ) : null}

            {listStatus === "error" ? (
              <div className="col-span-full text-center text-sm text-red-700 py-12">
                <p>Не удалось загрузить работы</p>
                {listError ? <p className="opacity-70 mt-2">{listError}</p> : null}
              </div>
            ) : null}

            {listStatus === "success" && items.length === 0 ? (
              <p className="col-span-full text-center text-sm text-crimson-600 py-12 max-w-lg mx-auto leading-relaxed">
                Работ пока нет в выдаче. Если в таблице уже есть строки — проверьте в Supabase:{" "}
                <strong>is_active = true</strong> и политику RLS <strong>SELECT</strong> для роли{" "}
                <code className="text-xs bg-crimson-100/50 px-1">anon</code>.
              </p>
            ) : null}

            {items.length > 0 ? (
              <div className="col-span-full w-full min-w-0">
                {isDesktop ? (
                  <DesktopCarousel items={items} />
                ) : (
                  <TikTokGallery
                    items={items}
                    rootClassName="relative -mx-6 w-[calc(100%+3rem)] overflow-hidden rounded-2xl border border-[#f5dede] shadow-[0_24px_60px_rgba(132,19,30,.15)] h-[min(70.4vh,656px)] min-h-[336px]"
                  />
                )}
              </div>
            ) : null}
          </div>

          <div className="mt-[2.4rem] text-center">
            <Button variant="primary" onClick={() => handleOpenModal(null)}>
              Хочу свою кружку
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
