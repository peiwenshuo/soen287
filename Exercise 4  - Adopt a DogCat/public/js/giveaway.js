window.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("giveawayForm");

  form.addEventListener("submit", function (e) {
    const errorDiv = document.getElementById("errorMessage");
    errorDiv.innerHTML = "";

    let errorMessages = [];

    const petType = document.getElementById("petType").value.trim();
    const breed = document.getElementById("breed").value.trim();
    const age = document.getElementById("age").value.trim();
    const gender = document.getElementById("gender").value.trim();
    const ownerName = document.getElementById("ownername").value.trim();
    const ownerEmail = document.getElementById("owneremail").value.trim();

    if (petType === "") errorMessages.push("Please select a pet type.");
    if (breed === "") errorMessages.push("Please select a breed.");
    if (age === "") errorMessages.push("Please select an age.");
    if (gender === "") errorMessages.push("Please select a gender.");
    if (ownerName === "") errorMessages.push("Please enter your name.");
    if (ownerEmail === "") errorMessages.push("Please enter your email.");
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(ownerEmail)) {
        errorMessages.push("Please enter a valid email address");
      }
    }


    const getsAlongCheckboxes = document.querySelectorAll('input[name="getsAlong[]"]');
    let getsAlongSelected = false;
    for (let i = 0; i < getsAlongCheckboxes.length; i++) {
      if (getsAlongCheckboxes[i].checked) {
        getsAlongSelected = true;
        break;
      }
    }
    if (!getsAlongSelected) {
      errorMessages.push("Please select at least one option for 'gets along with'");
    }

    if (errorMessages.length > 0) {
      e.preventDefault();
      errorDiv.innerHTML = errorMessages.join("<br>");
    }
  });
});
