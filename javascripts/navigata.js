"use strict";
var sections;
var navigata = function(){
  var $navigata = $("#navigata");
  $navigata.empty();
  sections = [];
  $("body>section").each(function(idx){
    var $this = $(this);
    if(!$this.attr('id')){
      $this.attr('id', "sec"+idx);
    }
    var hashtag = $this.attr('id');
    var title = $this.children('header').text().trim();
    var navlink = $("<a/>")
                    .text(title)
                    .attr("href", "#"+hashtag)
                    .appendTo($navigata);
    sections.push({section: this, navlink: navlink});
  });
  calcScroll();
};

var previousSectionShown = null;
var calcScroll = function(){
  var scrollTop = window.pageYOffset || $(window).scrollTop();
  var windowHeight = $(window).height();
  var scrollBottom = scrollTop + windowHeight;
  var maxShownPercent = 0;
  var currentSectionShown;
  for(var i=0; i<sections.length; i++){
    var the = sections[i];
    var $section = $(the.section);
    var $navlink = $(the.navlink);
    var sectionTop = $section.offset().top;
    var sectionHeight = $section.outerHeight();
    var displayHeight = sectionHeight;
    if(sectionHeight > windowHeight){
      displayHeight = windowHeight;
    };
    var contentTop = scrollTop - sectionTop;
    var contentBottom = scrollBottom - sectionTop;

    if (contentTop < 0){
      contentTop = 0;
    }
    if (contentTop > sectionHeight){
      contentTop = sectionHeight;
    }
    if (contentBottom < 0){
      contentBottom = 0;
    }
    var reverse = false;
    if (contentBottom > sectionHeight){
      contentBottom = sectionHeight;
      reverse = true
    }

    var revealHeight = contentBottom - contentTop;
    var revealPercent = revealHeight / displayHeight;
    if (revealPercent > maxShownPercent){
      currentSectionShown = $navlink;
      maxShownPercent = revealPercent;
    }
    if (reverse){
      var backgroundPosition = revealPercent / 2;
    } else {
      var backgroundPosition = 1 - revealPercent / 2;
    }
    $navlink.css({backgroundPosition: 'left ' + backgroundPosition*100 + '%'});
  }

  if (!previousSectionShown || previousSectionShown !== currentSectionShown){
    $("#navigata>a").addClass("hide-in-mobile");
    $(currentSectionShown).removeClass("hide-in-mobile");
    previousSectionShown = currentSectionShown;
  }
}

var resize = function(){
  calcScroll();
  $("nav").removeClass("reveal");
}

var reveal = function(e){
  var $nav = $("body>nav");
  console.log($nav.css('right'));
  if($nav.css('right') === '0px'){ // mobile mode detection
    if(!$nav.hasClass("reveal")){
      e.preventDefault();
    }
    e.stopPropagation();
    $nav.addClass("reveal");
  }
  e.stopPropagation();
}

var unreveal = function(e){
  var $nav = $("body>nav");
  if($nav.css('right') === '0px' && $nav.hasClass("reveal")){
    $nav.removeClass("reveal");
    e.preventDefault();
    e.stopPropagation();
  }
}

$(function(){
  navigata();
  $(window).resize(resize);
  $(window).scroll(calcScroll);
  $(window).on('touchmove', calcScroll);
  $("body>nav").on('click touchstart', reveal);
  $("body").on('click touchstart', unreveal);
});

