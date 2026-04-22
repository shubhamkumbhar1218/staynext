// Example starter JavaScript for disabling form submissions if there are invalid fields

(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()




document.querySelector("form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const location = document.getElementById("location").value;

    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
    );

    const data = await res.json();

    if (data.length === 0) {
        alert("Location not found");
        return;
    }

    const lat = data[0].lat;
    const lng = data[0].lon;

    // set hidden inputs
    document.getElementById("lat").value = lat;
    document.getElementById("lng").value = lng;

    console.log("Coordinates:", lat, lng);

    e.target.submit(); // submit form
});
