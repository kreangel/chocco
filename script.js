// скрипт для бургера

let burger  = document.querySelector('.burger');
let overlay = document.querySelector('.overlay');

let links = document.querySelectorAll('.menu__link--active');

links.forEach(function(element){
  element.addEventListener('click' , toggleMenu);
})

function toggleMenu(){
  burger.classList.toggle('burger--active');
  overlay.classList.toggle('overlay--active');
}

burger.addEventListener('click' , toggleMenu);

// скрипт для отзывов

const findBlockByAlias = alias => {
  return $(".reviews__item").filter((ndx, item) => {
    return $(item).attr("data-linked-with") == alias;
  });
};

$(".interactive-avatar__link").click((e) => {
  e.preventDefault();

  const $this = $(e.currentTarget);
  const target = $this.attr("data-open");
  const itemToShow = findBlockByAlias(target);
  const curItem = $this.closest(".interactive-avatar");

  itemToShow.addClass("active").siblings().removeClass("active");
  curItem.addClass("active").siblings().removeClass("active");
})

// скрипт для аккщрдеона

const openItim = item => {
  const container = item.closest(".team__item");
  const contentBlock = container.find(".team__content");
  const textBlock = contentBlock.find(".team__content-block");
  const reqHaight = textBlock.height();

  container.addClass("active");
  contentBlock.height(reqHaight);
};

const closeEveryItem = container => {
  const items = container.find(".team__content");
  const itemContainer = container.find(".team__item");

  itemContainer.removeClass("active");
  items.height(0);
};


$(".team__title").click ((e) => {
  const $thisTeam = $(e.currentTarget);
  const container = $thisTeam.closest(".team");
  const elemContainer = $thisTeam.closest(".team__item");

  if (elemContainer.hasClass("active")) {
    closeEveryItem(container);
  } else {
    closeEveryItem(container);
    openItim($thisTeam);
  }
});

// слайдер

const slider = $(".products").bxSlider({
  pager: false,
  controls: false,
});

$(".poducts-slider__arrows--direction--prev").click((e) => {
  e.preventDefault();
  slider.goToPrevSlide();
})

$(".poducts-slider__arrows--direction--next").click((e) => {
  e.preventDefault();
  slider.goToNextSlide();
})

// модальное окно

const validateFields = (form, fieldsArray) => {
  
  fieldsArray.forEach(field => {
    field.removeClass("input-error");
    if (field.val().trim() == "") {
      field.addClass("input-error");
    }
  });
  
  const errorFields = form.find(".input-error");

  return errorFields.length == 0;
}

$(".form").submit((e) => {
  e.preventDefault();

  const form = $(e.currentTarget);
  const name = form.find("[name='name']");
  const phone = form.find("[name='phone']");
  const comment = form.find("[name='comment']");
  const to = form.find("[name='to']");

  const modal = $("#modal");
  const content = modal.find(".modal__content");

  modal.removeClass("error-modal");

  const isValid =validateFields(form, [name, phone, comment, to]);

  if (isValid) {
    const request = $.ajax({
      url: "https://webdev-api.loftschool.com/sendmail",
      method: "post",
      data: {
        name: name.val(),
        phone: phone.val(),
        comment: comment.val(),
        to: to.val(),
      },
    });

    request.done((data) => {
      content.text(data.message);
    });

    request.fail((data) => {
      const message = data.responseJSON.message;
      content.text(message);
      modal.addClass("error-modal");        
    });

    request.always(() => {
      $.fancybox.open({
        src: "#modal",
        type: "inline"
      });
    });
  }
  e.target.reset();
});

$(".app-submit-btn").click((e) => {
  e.preventDefault();
  $.fancybox.close();
});

// аккардеон

const mesureWidth = itemA => {
  let reqItemWidth = 0;

  const screenWidth = $(window).width();
  const container = itemA.closest(".products-menu");
  const titlesBlocks = container.find(".products-menu__title");
  const titlesWidth = titlesBlocks.width() * titlesBlocks.length;

  const textContainer = itemA.find(".products-menu__container");
  const paddingLeft = parseInt(textContainer.css("padding-left"));
  const paddingRight = parseInt(textContainer.css("padding-right"));

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  if (isMobile) {
    reqItemWidth = screenWidth - titlesWidth;
  } else {
    reqItemWidth = 500;
  }

  console.log(paddingLeft);

  return {
    container: reqItemWidth,
    textContainer: reqItemWidth - paddingRight - paddingLeft
  }
}

const closeEveryItemInContainer = container => {
  const items = container.find(".products-menu__item");
  const content = container.find(".products-menu__content");

  items.removeClass("active");
  content.width(0);
}

const openItimA = itemA => {
  const hiddenContent = itemA.find(".products-menu__content");
  const reqWidth = mesureWidth(itemA);
  const textBlock = itemA.find(".products-menu__container")

  itemA.addClass("active");
  hiddenContent.width(reqWidth.container);
  textBlock.width(reqWidth.textContainer);
}

$(".products-menu__title").on("click", e => {
  e.preventDefault();
  
  const $thisA = $(e.currentTarget);
  const itemA = $thisA.closest(".products-menu__item");
  const itemOpened = itemA.hasClass("active");
  const container = $thisA.closest(".products-menu")

  if (itemOpened) {
    closeEveryItemInContainer(container)
  } else {
    closeEveryItemInContainer(container)
    openItimA(itemA);
  }
});

$(".products-menu__content").on("click", e => {
  e.preventDefault();

  closeEveryItemInContainer($('.products-menu'));
})

// OPS

const sections = $("section");
const display = $(".maincontent");
const sideMenu = $(".fixed-menu");
const menuItems = sideMenu.find(".fixed-menu__item");

const mobileDetect = new MobileDetect(window.navigator.userAgent);
const isMobile = mobileDetect.mobile();

let inScroll = false;

sections.first().addClass("active");

const countSectionPosition = (sectionEq) => {
  const position = sectionEq * -100;

  if (isNaN(position)) {
    console.error("передано не верное значение в countSectionPosition");
    return 0;
  }

  return  position;
}

const changeMenuThemeForSection = sectionEq => {
  const currentSection = sections.eq(sectionEq);
  const menuTheme = currentSection.attr("data-sidemenu-theme");
  const activeClass = "fixed-menu--shadowed"

  if (menuTheme == "black") {
    sideMenu.addClass(activeClass);
  } else {
    sideMenu.removeClass(activeClass);
  }
}

const resetActiveClassForItem = (items, itemEq, activeClass) => {
  items.eq(itemEq).addClass(activeClass).siblings().removeClass(activeClass);
}

const performTransition = sectionEq => {
  if (inScroll) return;

  const transitionOver = 1000;

  inScroll = true;

  const position = countSectionPosition(sectionEq);

  changeMenuThemeForSection(sectionEq);

  display.css({
    transform: `translateY(${position}%)`
  });

  resetActiveClassForItem(sections, sectionEq, "active");
  
  setTimeout(() => {
    inScroll = false;
    resetActiveClassForItem(menuItems, sectionEq, "fixed-menu__item--active")
  }, transitionOver);
}

const viewportScroller = () => {
  const activeSection = sections.filter(".active");
  const nextSection = activeSection.next();
  const prevSection = activeSection.prev();

  return {
    next() {
      if (nextSection.length) {
        performTransition(nextSection.index());
      }
    },
    prev() {
      if (prevSection.length) {
        performTransition(prevSection.index());
      }
    },
  }  
}

$(window).on("wheel", e => {
  const deltaY = e.originalEvent.deltaY;
  const scroller = viewportScroller();
  
  if (deltaY > 0) {
    scroller.next();
  }
  
  if (deltaY < 0) {
    scroller.prev();
  }
});

$(window).on("keydown", e => {
  
  const tagName = e.target.tagName.toLowerCase();
  const userTypingInInpuuts = tagName == "input" || tagName == "textarea";
  const scroller = viewportScroller();

  if (userTypingInInpuuts) return;

  switch (e.keyCode) {
    case 38:
      scroller.prev();
      break;

    case 40:
      scroller.next();
      break;
  }
  
});

$(".wrapper").on("touchmove", e => e.preventDefault());

$("[data-scroll-to]").click(e => {
  e.preventDefault();

  const $thisN = $(e.currentTarget);
  const targetN = $thisN.attr("data-scroll-to");
  const reqSection = $(`[data-section-id=${targetN}]`);

  performTransition(reqSection.index());
});

if (isMobile) {
  // https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
  $("body").swipe({
    swipe: function (event, direction) {
      const scroller = viewportScroller();
      let scrollDirection = "";

      if (direction == "up") scrollDirection = "next";
      if (direction == "down") scrollDirection = "prev";

      scroller[scrollDirection]();
    },
  });
}


// скрипт для карты

let myMap;

const init = () => {
  myMap = new ymaps.Map("map", {
    center: [59.948588, 30.357900],
    zoom: 12,
    controls: []
  });

  const coords = [
    [59.986840, 30.355248],
    [60.004911, 30.300624],
    [59.927590, 30.360820]
  ];

  const myCollection = new ymaps.GeoObjectCollection({}, {
    draggable: false,
    iconLayout: 'default#image',
    iconImageHref: "./img/icons/marker.svg",
    iconImageSize: [30, 42],
    iconImageOffset: [-3, -42]
  });

  coords.forEach(coord => {
    myCollection.add(new ymaps.Placemark(coord));
  });

  myMap.geoObjects.add(myCollection);  

  myMap.behaviors.disable('scrollZoom');
}

ymaps.ready(init);

// Player

let player;
const playerContainer = $('.player');

let eventsInit = () => {
  $(".player__start").click(e => {
    e.preventDefault();

    if (playerContainer.hasClass("paused")) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  });

  $(".player__playback").click(e => {
    const bar = $(e.currentTarget);
    const clickedPosition = e.originalEvent.layerX;
    const newButtonPositionPercent = (clickedPosition / bar.width()) * 100;
    const newPlaybackPositionSec = (player.getDuration() / 100) * newButtonPositionPercent;

    $(".player__playback-button").css({
      left: `${newButtonPositionPercent}%`
    });

    player.seekTo(newPlaybackPositionSec);
  });

  $(".player__splash").click(e => {
    player.playVideo();
  })
}

const formatTime = timeSec => {
  const roundTime = Math.round(timeSec);

  const minutes = addZero(Math.floor(roundTime / 60));
  const seconds = addZero(roundTime - minutes * 60);

  function addZero(num) {
    return num < 10 ? `0${num}` : num;
  }

  return `${minutes} : ${seconds}`;
}

const onPlayerReady = () => {
  let interval;
  const durationSec = player.getDuration();
  
  $(".player__duration-estimate").text(formatTime(durationSec));

  if (typeof interval != 'undefined') {
    clearInterval(interval);
  }

  interval = setInterval(() => {
    const completedSec = player.getCurrentTime();
    const completedPercent = (completedSec / durationSec) * 100;

    $(".player__playback-button").css({
      left: `${completedPercent}%`
    })

    $(".player__duration-completed").text(formatTime(completedSec));
  }, 1000);
}

const onPlayerStateChange = event => {
  /*
    -1 (воспроизведение видео не начато)
    0 (воспроизведение видео завершено)
    1 (воспроизведение)
    2 (пауза)
    3 (буферизация)
    5 (видео подают реплики).
  */
  switch (event.data) {
    case 1:
      playerContainer.addClass("active");
      playerContainer.addClass("paused");
      break;

    case 2:
      playerContainer.removeClass("active");
      playerContainer.removeClass("paused");
      break;
  }
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('yt-player', {
    height: '405',
    width: '660',
    videoId: 'LXb3EKWsInQ',
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    },
    playerVars: {
      controls: 0,
      disablekb: 0,
      showinfo: 0,
      rel: 0,
      autoplay: 0,
      modestbranding: 0
    }
  });
}

eventsInit();