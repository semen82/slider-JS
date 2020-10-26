let options = {
    wrap: '#carousel-wrap',     // селектор обёртки
    slider: '.slider',          // селектор блока с слайдами
    prev: '.prev',              // селектор кнопки "назад"
    next: '.next',              // селектор кнопки "вперёд"
    time: 1,                    // время перелистывания слайда
    interval: 5000,             // интервал между перелистыванием
    autoSlide: true,         // включить автослайд
    dots: '.dots',              // селектор блока с точками
};

const wrap = document.querySelector(options.wrap);
const slider = wrap.querySelector(options.slider);
const prev = wrap.querySelector(options.prev);
const next = wrap.querySelector(options.next);
const countSlide = slider.children.length;
const dots = wrap.querySelector(options.dots);
let listDots;
let intervalId = 0;
let activeSlide = 1;
for (let item of slider.children) {
    item.style.transition = `margin ${options.time}s`;
}

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {

    prev.style.display = 'none';
    next.style.display = 'none';

}

(function createDoted() {
    for (let i = 0; i < countSlide; i++) {
        let dot = document.createElement('i');
        dot.classList.add('fa', 'fa-circle');
        dots.append(dot);
    }
    dots.firstElementChild.classList.add('active');
    listDots = dots.children;
})();

function prevDot() {
    if (activeSlide == 1) {
        listDots[activeSlide - 1].classList.remove('active');
        activeSlide = countSlide;
        listDots[activeSlide - 1].classList.add('active');
    } else {
        listDots[activeSlide - 1].classList.remove('active');
        activeSlide--;
        listDots[activeSlide - 1].classList.add('active');
    }
}

function nextDot() {
    if (activeSlide < countSlide) {
        listDots[activeSlide - 1].classList.remove('active');
        listDots[activeSlide].classList.add('active');
        activeSlide++;
    } else {
        listDots[activeSlide - 1].classList.remove('active');
        activeSlide = 1;
        listDots[activeSlide - 1].classList.add('active');
    }
}

function createSlide(url) {
    let img = document.createElement('img');
    img.setAttribute('src', url);
    img.classList.add('item');
    img.style.transition = `margin ${options.time}s`;

    return img;
}

function nextSlide() {
    clearInterval(intervalId);
    next.removeEventListener('click', nextSlide);
    let elem = slider.firstElementChild;
    let url = elem.getAttribute('src');
    elem.remove();
    slider.firstElementChild.style.marginLeft = '-100%';
    let slide = createSlide(url);
    slider.append(slide);
    setTimeout(() => {
        next.addEventListener('click', nextSlide);
        startInterval();
    }, options.time * 1000);
    nextDot();
}

function prevSlide() {
    clearInterval(intervalId);
    prev.removeEventListener('click', prevSlide);
    let first = slider.firstElementChild;
    first.style.marginLeft = '0';
    let last = slider.lastElementChild;
    let url = last.getAttribute('src');

    let slide = createSlide(url);
    slide.style.marginLeft = '-100%';
    setTimeout(() => {
        last.remove();
        slider.prepend(slide);
        prev.addEventListener('click', prevSlide);
        startInterval();
    }, options.time * 1000);
    prevDot();
}

prev.addEventListener('click', prevSlide);
next.addEventListener('click', nextSlide);

function startInterval() {
    if (options.autoSlide) {
        intervalId = setInterval(() => {
            nextSlide();
        }, options.interval);
    }
}
startInterval();



let startPoint;
let endPoint;

document.addEventListener('touchstart', function (event) {
    event.preventDefault();
    event.stopPropagation();
    startPoint = event.changedTouches[0].pageX;
});

document.addEventListener('touchend', function (event) {
    endPoint = event.changedTouches[0].pageX;

    if (Math.abs(startPoint - endPoint) > 150) {
        if ((startPoint - endPoint) > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
});