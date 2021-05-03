// скрипт для бургера

let burger  = document.querySelector('.burger');
let overlay = document.querySelector('.overlay');

let links = document.querySelectorAll('.menu__link');

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

let inScroll = false;

sections.first().addClass("active");

const performTransition = sectionEq => {

  if (inScroll == false) {
    inScroll = true;
    const position = sectionEq * -100;
  
    display.css({
      transform: `translateY(${position}%)`
    });
  
    sections.eq(sectionEq).addClass("active").siblings().removeClass("active");

    setTimeout(() => {
      inScroll = false;
    }, 1000);
  }
}

const scrollViewport = direction => {
  const activeSection = sections.filter(".active");
  const nextSection = activeSection.next();
  const prevSection = activeSection.prev();

  if (direction == "next" && nextSection.length) {
    performTransition(nextSection.index())
  }
  
  if (direction == "prev" && prevSection.length) {
    performTransition(prevSection.index())
  }
}

$(window).on("wheel", e => {
  const deltaY = e.originalEvent.deltaY;
  
  if (deltaY > 0) {
    scrollViewport("next");
  }
  
  if (deltaY < 0) {
    scrollViewport("prev");
  }
});

$(window).on("keydown", e => {
  
  const tagName = e.target.tagName.toLowerCase();

  if (tagName !== "input" && tagName !== "textarea") {
    switch (e.keyCode) {
      case 38: //prev
        scrollViewport("prev");
        break;
  
      case 40: //next
        scrollViewport("next");
        break;
    }
  }
});

$("[data-scroll-to]").click(e => {
  e.preventDefault();

  const $thisN = $(e.currentTarget);
  const targetN = $thisN.attr("data-scroll-to");
  const reqSection = $(`[data-section-id=${targetN}]`);

  console.log(reqSection.index());
});

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