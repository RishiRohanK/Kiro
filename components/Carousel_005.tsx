"use client";

import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import { Autoplay, EffectCreative, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";

import { cn } from "@/lib/utils";

const Carousel_005 = ({
  images,
  className,
  showPagination = false,
  showNavigation = false,
  loop = true,
  autoplay = false,
  spaceBetween = 0,
}: {
  images: { src: string; alt: string }[];
  className?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  spaceBetween?: number;
}) => {
  const css = `
  .Carousal_005 {
    width: 100%;
    height: 400px;
  }
  
  .Carousal_005 .swiper-slide {
    background-position: center;
    background-size: cover;
    border-radius: 20px;
    width: 85% !important;
  }

  .Carousal_005 .swiper-pagination {
    bottom: 0px !important;
  }

  .Carousal_005 .swiper-pagination-bullet {
    background-color: #000 !important;
    width: 6px;
    height: 6px;
    opacity: 0.2;
  }

  .Carousal_005 .swiper-pagination-bullet-active {
    opacity: 1;
    width: 20px;
    border-radius: 4px;
    transition: all 0.3s ease;
  }

  .Carousal_005 .swiper-button-next,
  .Carousal_005 .swiper-button-prev {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(4px);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: #000 !important;
    border: 1px solid rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
  }

  .Carousal_005 .swiper-button-next:hover,
  .Carousal_005 .swiper-button-prev:hover {
    background: #fff;
    transform: scale(1.1);
  }
 
  `;
  return (
    <div className={cn("relative w-full mx-auto", className)}>
      <style>{css}</style>

      <div className="w-full">
        <Swiper
          spaceBetween={spaceBetween}
          autoplay={
            autoplay
              ? {
                  delay: 2500,
                  disableOnInteraction: false,
                }
              : false
          }
          effect="creative"
          grabCursor={true}
          slidesPerView="auto"
          centeredSlides={true}
          loop={loop}
          pagination={
            showPagination
              ? {
                  clickable: true,
                }
              : false
          }
          navigation={
            showNavigation
              ? {
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }
              : false
          }
          className="Carousal_005"
          creativeEffect={{
            prev: {
              shadow: true,
              translate: [0, 0, -400],
            },
            next: {
              translate: ["100%", 0, 0],
            },
          }}
          modules={[EffectCreative, Pagination, Autoplay, Navigation]}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="">
              <img
                className="h-full w-full scale-105 rounded-3xl object-cover"
                src={image.src}
                alt={image.alt}
              />
            </SwiperSlide>
          ))}
          <div className="swiper-button-next after:hidden">
            <ChevronRightIcon className="h-5 w-5" />
          </div>
          <div className="swiper-button-prev after:hidden">
            <ChevronLeftIcon className="h-5 w-5" />
          </div>
        </Swiper>
      </div>
    </div>
  );
};

export default Carousel_005;
