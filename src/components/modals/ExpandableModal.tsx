import { FC, useState, TouchEvent, useEffect } from "react";
import { darkThemeClass } from "@/utils/utils";
import { RelatedFile } from "@/features/base/types";

interface ModalProps {
  image: RelatedFile;
  images: RelatedFile[];
  theme: string;
}

interface CarouselProps {
  image: RelatedFile;
  images: RelatedFile[];
}

const Carousel: FC<CarouselProps> = ({ images, image }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    let imgIndex: number = 0;
    if (image && images.length > 0) {
      let index = images.findIndex((x) => x.url === image.url);
      if (index === 0 || index > 0) {
        imgIndex = index;
      }
    }
    setCurrentIndex(imgIndex);
  }, [image, images]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;

    if (deltaX > 50) {
      prevSlide();
    } else if (deltaX < -50) {
      nextSlide();
    }
  };

  return (
    <div
      className="carousel"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        style={{
          flex: "0.1",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span style={{ cursor: "pointer" }} onClick={prevSlide}>
          <i className="las la-chevron-circle-left la-2x"></i>
        </span>
      </div>
      <div style={{ flex: "0.8" }}>
        <div className="text-center">{images[currentIndex]?.filetype}</div>
        <img
          style={{
            width: "100%",
            height: "auto",
            transition: "transform 0.5s ease",
          }}
          src={images[currentIndex]?.url}
          alt={`Slide ${currentIndex}`}
        />
        <div className="center-btns">
          <span className="mx-2">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>
      <div
        style={{
          flex: "0.1",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span style={{ cursor: "pointer" }} onClick={nextSlide}>
          <i className="las la-chevron-circle-right la-2x"></i>
        </span>
      </div>
    </div>
  );
};

const ExpandableModal: FC<ModalProps> = ({ image, images, theme }) => {
  const modal = darkThemeClass("dt-modal-content", theme);
  return (
    <div className="col-md-8">
      <div
        className="modal fade"
        id="expandableModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="modal-center"
        aria-hidden="true"
        style={{ display: "none" }}
      >
        <div
          className="modal-dialog modal-dialog-centered modal-fullscreen"
          role="document"
        >
          <div className={`modal-content ${modal}`}>
            <div
              className="text-right"
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <button
                type="button"
                className="btn"
                data-bs-dismiss="modal"
                aria-label="close"
              >
                <span
                  className={`las la-times ${modal && "text-white"}`}
                ></span>
              </button>
            </div>
            <div className="modal-body px-5 pb-4">
              <Carousel image={image} images={images} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandableModal;
