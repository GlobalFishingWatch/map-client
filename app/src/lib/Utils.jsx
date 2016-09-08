const scrollTo = function(el, v) {
  var fast = 0;
  if(v === null){
    fast=500;
  }
  fast = v;
  $('html, body').animate({
    scrollTop: $(el).offset().top
  }, fast);
}

export { scrollTo };
