
$(function () {
  $('#contact, #closeContact').click(function () {
    contact.toggle();
    $('html, body').animate({
      scrollTop: $("#contactContainer").offset().top
    }, 1000);
  });

  $('#find, #closeFind').click(function () {
    find.toggle();
    $('html, body').animate({
      scrollTop: $("#findContainer").offset().top
    }, 1000);
  });

  window.onscroll = function () { backToTop.scrollFunction() };
})

contact = {
  toggle: function () {
    let contactDiv = $('#contactContainer');
    let contactClasses = contactDiv.attr('class').split(/\s+/);
    if ($.inArray('contact-sidenav-open', contactClasses) > 0) {
      contactDiv.removeClass('contact-sidenav-open');
      contactDiv.addClass('contact-sidenav-closed');
    } else {
      contactDiv.removeClass('contact-sidenav-closed');
      contactDiv.addClass('contact-sidenav-open');
    }
  },
}

find = {
  toggle: function () {
    let contactDiv = $('#findContainer');
    let contactClasses = contactDiv.attr('class').split(/\s+/);
    if ($.inArray('find-sidenav-open', contactClasses) > 0) {
      contactDiv.removeClass('find-sidenav-open');
      contactDiv.addClass('find-sidenav-closed');
    } else {
      contactDiv.removeClass('find-sidenav-closed');
      contactDiv.addClass('find-sidenav-open');
    }
  },
}

backToTop = {
  scrollFunction : function () {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      document.getElementById("backToTop").style.display = "block";
    } else {
      document.getElementById("backToTop").style.display = "none";
    }
  },
  topFunction : function () {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }


}