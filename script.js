const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const sliderImages = document.getElementById("slider-images");
const totalImages = document.querySelectorAll("#slider-images img").length;
let currentIndex = 0;

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % totalImages;
  updateSliderPosition();
});

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + totalImages) % totalImages;
  updateSliderPosition();
});

function updateSliderPosition() {
  const offset = -currentIndex * 100;
  sliderImages.style.transform = `translateX(${offset}%)`;
}