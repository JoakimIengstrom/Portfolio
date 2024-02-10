document.addEventListener('DOMContentLoaded', function () {
    const menuBtn = document.querySelector('.menu-btn');
    const menuContainer = document.querySelector('.menu-container');
  
    if (menuBtn) {
      menuBtn.addEventListener('click', function () {
        menuContainer.classList.toggle('show-menu');
      });
  
      menuContainer.addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
          menuContainer.classList.remove('show-menu');
        }
      });
    }
  
    const flipCards = document.querySelectorAll('.flip-card');
    if (flipCards) {
      flipCards.forEach(function (flipCard) {
        flipCard.addEventListener('click', function () {
          this.classList.toggle('flipped');
        });
      });
    }
  });
  