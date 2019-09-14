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

  // var multirow = 2;
  $("#addmultirow").click(function () {
    var multirow = $('.triprow').length + 1;
    var fieldHTML = 
      '<div class="col-sm-12 nopadding triprow" id="triprow_' + multirow + '">'+
        '<div class="col-sm-7 formleft">'+
          '<div class="col-sm-6 datepickerinputbox">'+
            '<div class="form-group">'+
      '<input type="text" class="form-control flightfrom backicon locationsrch" placeholder="Flight From" value="" name="multifrom_' + multirow + '" id="multifrom_' + multirow + '">'+
            '</div>'+
          '</div>'+
          '<div class="col-sm-6 datepickerinputbox">'+
            '<div class="form-group">'+
      '<input type="text" class="form-control flightto backicon locationsrch" placeholder="Flight To" value="" name="multito_' + multirow + '" id="multito_' + multirow + '">'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<div class="col-sm-5 formright">'+
          '<div class="col-sm-5 datepickerinputbox">'+
            '<input id="multitripdepart_' + multirow + '" name="multitripdepart_' + multirow + '" class="datepickerinput backicon" type="text" placeholder="mm/dd/yyyy" onclick="setdate(this);" />'+
          '</div>'+
            '<div class="col-sm-4 datepickerinputbox">'+
            '<select name="multitripadult_' + multirow + '" id="multitripadult_' + multirow + '">'+
              '<option value="" selected disabled>Passengers</option>'+
              '<option value="1">1</option><option value="2">2</option>'+
              '<option value="3">3</option><option value="4">4</option>'+
              '<option value="5">5</option>'+
            '</select>'+
          '</div>'+
          '<div class="col-sm-3 delbtn">'+
            '<button class="delmultirow">Delete</button>'+
          '</div>'+
        '</div>';
      // var fieldHTML = '<div class="col-sm-12 nopadding triprow" id="triprow_' + multirow + '"><div class="col-sm-7 formleft"><div class="col-sm-6 datepickerinputbox"><div class="form-group"><input type="text" class="form-control flightfrom backicon locationsrch" placeholder="Flight From" value="" name="multifrom[]" id="multifrom_' + multirow + '"></div></div><div class="col-sm-6 datepickerinputbox"><div class="form-group"><input type="text" class="form-control flightto backicon locationsrch" placeholder="Flight To" value="" name="multito[]" id="multito_' + multirow + '"></div></div></div><div class="col-sm-5 formright"><div class="col-sm-5 datepickerinputbox"><input id="multitripdepart_' + multirow + '" name="multitripdepart[]" class="datepickerinput backicon" type="text" placeholder="mm/dd/yyyy" onclick="setdate(this);"/></div><div class="col-sm-4 datepickerinputbox"><select name="multitripadult_' + multirow + '" id="multitripadult_' + multirow + '"><option value="" selected disabled>Passengers</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></div><div class="col-sm-3 delbtn"><button class="delmultirow">Delete</button></div></div>';


    $('body').find('.triprow:last').after(fieldHTML);
    // multirow++;
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


  function requestSuccess(response) {
    console.log(response);
  }

  $(".flightform").on("submit", function (event) {
    event.preventDefault();
    var nameMap = {
      // Round Trip
      "roundfrom": "LEADCF1",
      "roundto": "LEADCF2",
      "rounddepart": "LEADCF81",
      "roundreturn": "LEADCF83",
      "roundpassenger": "LEADCF51",

      // One Way
      "onewayfrom": "",
      "onewayto": "",
      "onewaydepart": "",
      "onewaypassenger": "LEADCF51",

      // Multi Form
      "class": "LEADCF8",

      "multifrom_1": "LEADCF1",
      "multito_1": "LEADCF2",
      "multitripdepart_1": "LEADCF81",
      "multitripadult_1": "LEADCF51",

      "multifrom_2": "LEADCF4",
      "multito_2": "LEADCF6",
      "multitripdepart_2": "LEADCF85",
      "multitripadult_2": "LEADCF51",

      "multifrom_3": "LEADCF5",
      "multito_3": "LEADCF7",
      "multitripdepart_3": "LEADCF84",
      "multitripadult_3": "LEADCF51",

      "lastname": "Last Name",
      "email": "Email",
      "phone": "Phone",


    }
    var data = $(this).serializeArray();
    var url = "https://crm.zoho.com/crm/WebToLeadForm";
    var tyPage = "https&#x3a;&#x2f;&#x2f;www.flightaroo.com&#x2f;thank-you&#x2f;"
    var postData = {
      "xnQsjsdp": "f2bc23ae6e9abcbb676146562effba055f64c357581796f8e039d596534c7325",
      "zc_gad": "",
      "xmIwtLD": "5a5ba60886b11c463c081fcac4bd42c615de07f283189a74a05966c1d0e27989",
      "actionType": "TGVhZHM=",
      "returnURL": tyPage,
      "LEADCF9": "Yes"
    }

    data.map(function (item) {
      postData[nameMap[item.name]] = item.value
    })

    console.log(postData);
    $.ajax({
      type: "POST",
      url: url,
      data: postData,
      success: function(res) {
        if(res) window.location.replace("./thank-you.html");
      },
      fail: function(err) {
        console.log("Ajax error: ");
        console.log(err);
      }
    });

  });

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

