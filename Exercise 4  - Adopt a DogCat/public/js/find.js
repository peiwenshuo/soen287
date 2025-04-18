window.addEventListener('DOMContentLoaded',function (){
  const searchForm =document.getElementById("searchForm");
  if (searchForm){
    searchForm.addEventListener('submit',function (e){
      const errorDiv = document.getElementById("errorMessage");
      errorDiv.textContent='';

      const petType = document.getElementById('petType').value.trim();
      const breed = document.getElementById('breed').value.trim();
      const age = document.getElementById('age').value.trim();
      const gender = document.getElementById('gender').value.trim();

      let errorMessage = [];

      if (petType ==='') errorMessage.push("Please select a Pet Type.");
      if (breed ==='')errorMessage.push("Please select a Breed.");
      if (age ==='')errorMessage.push("Please select a Preferred Age.");
      if (gender ==='')errorMessage.push("Please select a Preferred Gender.");


      const compatibilityCheckboxes = document.getElementsByName("compatibility");
      let compatibilityChecked = false;
      for (let i = 0; i < compatibilityCheckboxes.length; i++) {
        if (compatibilityCheckboxes[i].checked) {
          compatibilityChecked = true;
          break;
        }
      }
      if (!compatibilityChecked) {
        errorMessage.push("Please select at least one compatibility option.");
      }



      if (errorMessage.length >0 ){
        e.preventDefault();
        errorDiv.innerHTML = errorMessage.join("<br>")
      }
    });
  }
});


