var options = {
  shouldSort: true,
  threshold: 0.4,
  maxPatternLength: 32,
  keys: [{
    name: 'iata',
    weight: 0.5
  },
  {
    name: 'name',
    weight: 0.3
  },
  {
    name: 'city',
    weight: 0.2
  }]
};

var fuse = new Fuse(airports, options);

var results = [];
var numResults = 0;
var selectedIndex = -1;

$(document).ready(function () {
  $("#rounddepart").datepicker({
    format: 'mm/dd/yyyy',
    //todayHighlight: true,
    autoclose: true,
    startDate: new Date()
  }).on('changeDate', function (selected) {
    var startDate = new Date(selected.date.valueOf());
    $('#roundreturn').datepicker('setStartDate', startDate);
  }).on('clearDate', function (selected) {
    $('#roundreturn').datepicker('setStartDate', null);
  });

  $('.datepickerinput').datepicker({
    startDate: '+1d'
  });

  //carousel options
  $('#quote-carousel').carousel({
    pause: true, interval: 10000,
  });

  var multirow = 2;
  $("#addmultirow").click(function () {
    var fieldHTML = '<div class="col-sm-12 nopadding triprow" id="triprow_' + multirow + '"><div class="col-sm-7 formleft"><div class="col-sm-6 datepickerinputbox"><div class="form-group"><input type="text" class="form-control flightfrom backicon locationsrch" placeholder="Flight From" value="" name="multifrom[]" id="multifrom_' + multirow + '"></div></div><div class="col-sm-6 datepickerinputbox"><div class="form-group"><input type="text" class="form-control flightto backicon locationsrch" placeholder="Flight To" value="" name="multito[]" id="multito_' + multirow + '"></div></div></div><div class="col-sm-5 formright"><div class="col-sm-5 datepickerinputbox"><input id="multitripdepart_' + multirow + '" name="multitripdepart[]" class="datepickerinput backicon" type="text" placeholder="mm/dd/yyyy" onclick="setdate(this);"/></div><div class="col-sm-4 datepickerinputbox"><select name="multitripadult_' + multirow + '" id="multitripadult_' + multirow + '"><option value="" selected disabled>Passengers</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></div><div class="col-sm-3 delbtn"><button class="delmultirow">Delete</button></div></div>';

    $('body').find('.triprow:last').after(fieldHTML);
    multirow++;
  });

  $("body").on("click", ".delmultirow", function () {
    $(this).parents(".triprow").remove();
  });

  $("body").on("click", ".backicon", function () {
    var serchboxid = $(this).attr('id');
    var nextdiv = $(this).next().attr('class');
    if (nextdiv != 'autocomplete-results') {
      $('<div class="autocomplete-results" data-highlight="' + selectedIndex + '"></div>').insertAfter("#" + serchboxid);
    }
  });

  $("body").on("keyup", ".backicon", function () {
    var serchboxid = $(this).attr('id');
    var searchloc = $(this).val();
    search(searchloc, serchboxid);
  });

  $(".nextbtn").click(function () {
    $(this).closest('.nextdiv').hide();
    var formid = $(this).closest('form').attr('id');
    $('#' + formid).find('.step2').show();
  });

  $(".locationsrch").keyup(function () {
    var serchboxid = $(this).attr('id');
    var searchloc = $(this).val();
    search(searchloc, serchboxid);
  });

  $(".locationsrch").click(function () {
    var serchboxid = $(this).attr('id');
    var nextdiv = $(this).next().attr('class');
    if (nextdiv != 'autocomplete-results') {
      $('<div class="autocomplete-results" data-highlight="' + selectedIndex + '"></div>').insertAfter("#" + serchboxid);
    }
  });

  $('[data-toggle="tooltip"]').tooltip();


  $(".navigation-bar-toggle").on("click", function (b) {
    b.preventDefault(),
      $(this).toggleClass("active").next().toggleClass("active")
  })

});


function setinpuval(location, serchboxid) {
  document.getElementById(serchboxid).value = location;
  document.getElementById(serchboxid).nextSibling.remove();
}

function search(searchloc, serchboxid) {
  if (searchloc.length > 0) {
    results = _.take(fuse.search(searchloc), 7);
    numResults = results.length;

    var divs = results.map(function (r, i) {
      var divlocation = "'" + r.city + " " + r.country + " - " + r.name + "', " + "'" + serchboxid + "'";
      return '<div class="autocomplete-result" data-index="' + i + '" onclick="setinpuval(' + divlocation + ');">' +
        '<div><b>' + r.iata + '</b> - ' + r.name + '</div>' +
        '<div class="autocomplete-location">' + r.city + ', ' + r.country + '</div>' +
        '</div>';
    });

    $('#' + serchboxid).next(".autocomplete-results").html(divs.join(''));

  } else {
    numResults = 0;
    $('#' + serchboxid).next(".autocomplete-results").html();
  }
}

function setdate(selectObject) {
  var id = selectObject.id;
  $("#" + id).datepicker({
    startDate: '+1d'
  });
  $("#" + id).datepicker("show");

}

function myFunction(x) {
  x.style.background = "WHITE";
}

