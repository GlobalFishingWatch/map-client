const scrollTo = function(el) {
  $('html, body').animate({
    scrollTop: $(el).offset().top
  }, 500);
}

export { scrollTo };
