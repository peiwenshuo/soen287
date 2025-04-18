function updateDateTime(){
  const now = new Date();
  const options ={
    weekday:'long',
    year:'numeric',
    month:'short',
    day:'numeric',
    hour:'2-digit',
    minute:'2-digit',
    second:'2-digit'
  };
  const formattedDateTime = now.toLocaleTimeString('en-us',options);
  document.getElementById("dateTimeDisplay").textContent =formattedDateTime;

}
updateDateTime();
setInterval(updateDateTime,1000);
