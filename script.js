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

$(".form").submit((e) => {
  e.preventDefault();

  const form = $(e.currentTarget);
  const name = form.find("[name='name']");
  const phone = form.find("[name='phone']");
  const comment = form.find("[name='comment']");
  const to = form.find("[name='to']");

  [name, phone, comment, to].forEach(field => {

    if (field.val() == "") {
      field.addClass("input-error");
    }
  })

  $.ajax({
    url: "https://webdev-api.loftschool.com/sendmail",
    method: "post",
    data: {
      name: name.val(),
      phone: phone.val(),
      comment: comment.val(),
      to: to.val(),
    }
  });

  //$.fancybox.open({
  //  src: "#modal",
  //  type: "inline"
  //})
})

$(".app-submit-btn").click((e) => {
  e.preventDefault();
  $.fancybox.close();
})