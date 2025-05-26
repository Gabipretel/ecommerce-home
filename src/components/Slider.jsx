import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination } from 'swiper/modules';
import '../css/Slider.css';
import imagesBanner from '../data/imagesBanner.js';

const Slider = () => {
  return (
    <div className="slider-container">
      <Swiper
        loop
        centeredSlides
        autoplay={{
          delay: 2500,
          disableOnInteraction: true,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination]}
        className="mySwiper"
      >
        {imagesBanner.map((image) => (
          <SwiperSlide key={image.id}>
            <img src={image.image} alt={image.alt} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
