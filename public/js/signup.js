$("#fourth").hide();
$("#second").hide();
$("#first-loader").hide()
$("#third").hide()

const loginButton = document.getElementById("submit");
const secondButton = document.getElementById("secondNext");
const thirdButton = document.getElementById("thirdNext");
const fourthButton = document.getElementById("detailsButt");


loginButton.addEventListener("click", function (event) {
  event.preventDefault();
  const email = document.getElementById("email").value;

  $("#first").fadeOut();
  $("#first-loader").delay(500).fadeIn();

  setTimeout(function () {
    $.post(
      "signup/email",
      {
        type: "email",
        email: email,
      },
      function (data) {
        if (data.success) {
          $("#first-loader").delay(500).fadeOut();
          $("#second").delay(1000).fadeIn();

          if (history.pushState) {
            var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?key=${data.key}`;
            window.history.pushState({ path: newurl }, '', newurl);
          }
        } else {
          $("#first-loader").delay(500).fadeOut();
          $("#first").delay(1000).fadeIn();
          errBox.innerHTML = data.message;
        }
      }
    )
  }, 800);
});

const resend = () => {
  const email = document.getElementById("email").value;
  $("#second").fadeOut();
  $("#first-loader").delay(500).fadeIn();
  const key = findGetParameter("key")
  $.post(
    "signup/email",
    {
      type: "resend",
      email: email,
      key: key
    },
    function (data) {
      if (data.success) {
        $("#first-loader").delay(500).fadeOut();
        $("#second").delay(1000).fadeIn();
      } else {
        $("#first-loader").delay(500).fadeOut();
        $("#first").delay(1000).fadeIn();
        errBox.innerHTML = data.message;
      }
    }
  )
}

const validateEmail = () => {
  const errBox = document.getElementById("errBox");
  const emailField = document.getElementById("email").value;
  const nextBtn = document.getElementById('submit')
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const valid = re.test(String(emailField).toLowerCase());
  if (valid) {
    errBox.innerHTML = "";
    nextBtn.disabled = false
    nextBtn.className = "submit"
  } else {
    errBox.innerHTML = "Please Enter a Valid Email Format!";
    nextBtn.disabled = true
    nextBtn.className = "disabledButton"

  }
};

/**************** SECOND PAGE *****************/





$(".digit-group")
  .find("input")
  .each(function () {
    $(this).attr("maxlength", 1);
    $(this).on("keyup", function (e) {
      var parent = $($(this).parent());

      if (e.keyCode === 8 || e.keyCode === 37) {
        var prev = parent.find("input#" + $(this).data("previous"));

        if (prev.length) {
          $(prev).select();
        }
      } else if (
        (e.keyCode >= 48 && e.keyCode <= 57) ||
        (e.keyCode >= 65 && e.keyCode <= 90) ||
        (e.keyCode >= 96 && e.keyCode <= 105) ||
        e.keyCode === 39
      ) {
        var next = parent.find("input#" + $(this).data("next"));

        if (next.length) {
          $(next).select();
        } else {
          if (parent.data("autosubmit")) {
            parent.submit();
          }
        }
      }
    });
  });

secondButton.addEventListener("click", function (event) {
  event.preventDefault();
  $("#second").fadeOut();
  $("#first-loader").delay(500).fadeIn();
  const email = document.getElementById("email").value;
  const key = findGetParameter("key")
  let otp = document.getElementById('digit-1').value + document.getElementById('digit-2').value + document.getElementById('digit-3').value + document.getElementById('digit-4').value + document.getElementById('digit-5').value + document.getElementById('digit-6').value
  const errBox = document.getElementById('prompt')

  setTimeout(function () {
    $.post(
      "signup",
      {
        type: "otp",
        email: email,
        key: key,
        otp: otp
      },
      function (data) {
        if (data.otp) {
          $("#first-loader").delay(1000).fadeOut();
          $("#third").delay(1500).fadeIn();
        } else {
          $("#first-loader").delay(1000).fadeOut();
          $("#second").delay(1500).fadeIn();
          errBox.style.color = 'red'
          errBox.innerHTML = "Please Recheck Your OTP!";
        }
      }
    )
  }, 800);
});

const goToFirst = () => {
  $("#second").fadeOut();
  $("#first").delay(500).fadeIn();
}

function findGetParameter(parameterName) {
  var result = null,
    tmp = [];
  location.search
    .substr(1)
    .split("&")
    .forEach(function (item) {
      tmp = item.split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
  return result;
}
/********************** THIRD PAGE **************************** */


thirdButton.addEventListener("click", function (event) {
  event.preventDefault();
  $("#third").fadeOut();
  $("#fourth").delay(500).fadeIn();
})


const checkEntry1 = () => {
  const a = document.getElementById('firstname').value
  const b = document.getElementById('lastname').value
  const submit = document.getElementById('detailsFirst')

  if (a == "" || b == "") {
    submit.disabled = true
    submit.className = 'disabledButton'
  } else {
    submit.disabled = false
    submit.className = 'submit'
  }
}


const checkEntry2 = () => {
  const a = document.getElementById('phone').value
  const fourthSubmit = document.getElementById('detailsSecond')

  if (a == "") {
    fourthSubmit.disabled = true
    fourthSubmit.className = 'disabledButton'
  } else {
    fourthSubmit.disabled = false
    fourthSubmit.className = 'submit'
  }
}

const checkEntry3 = () => {
  const a = document.getElementById('password').value
  const b = document.getElementById('cpassword').value
  const fourthSubmit = document.getElementById('detailsButt')

  if (a == "" || b == "") {
    fourthSubmit.disabled = true
    fourthSubmit.className = 'disabledButton'
  } else {
    fourthSubmit.disabled = false
    fourthSubmit.className = 'submit'
  }
}

const detailsFirst = document.getElementById('detailsFirst')
const detailsSecond = document.getElementById('detailsSecond')

$('#group2').hide()
$('#group3').hide()

detailsFirst.addEventListener("click", function (event) {
  event.preventDefault()
  $('#group1').fadeOut();
  $('#group2').delay(400).fadeIn();
})

detailsSecond.addEventListener("click", function (event) {
  event.preventDefault()
  $('#group2').fadeOut();
  $('#group3').delay(400).fadeIn();

})


fourthButton.addEventListener("click", function (event) {
  event.preventDefault()

  const email = document.getElementById("email").value;
  const firstname = document.getElementById("firstname").value;
  const lastname = document.getElementById("lastname").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;


  setTimeout(function () {
    $("#fourth").fadeOut();
    $("#first-loader").delay(500).fadeIn();

    $.post(
      "signup",
      {
        type: "signup",
        email: email,
        firstname: firstname,
        lastname: lastname,
        phone: phone,
        password: password
      },
      function (data) {
        if (data.success) {
          setTimeout(() => { window.location.href = '/login' }, 1000)
        } else {
          err.innerHTML = "Something Went Wrong"
          $("#first").fadeIn();
          $("#first-loader").delay(500).fadeOut();

        }
      }
    )
  }, 800);
})

const matchPass = () => {
  const a = document.getElementById('password').value
  const b = document.getElementById('cpassword').value
  const err = document.getElementById('err')
  const fourthSubmit = document.getElementById('detailsButt')

  if (a == b) {
    err.innerHTML = ""
    fourthSubmit.disabled = false
    fourthSubmit.className = 'submit'
    return true
  } else {
    err.innerHTML = "Passwords do Not Match"
    fourthSubmit.disabled = true
    fourthSubmit.className = 'disabledButton'

  }
}

