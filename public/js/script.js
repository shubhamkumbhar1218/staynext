// Example starter JavaScript for disabling form submissions if there are invalid fields

// Bootstrap validation (keep as it is)
(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})();


// ✅ APPLY ONLY TO LISTING FORM
const listingForm = document.getElementById("listingForm");

if (listingForm) {
  listingForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const locationInput = document.getElementById("location");

    // safety check
    if (!locationInput) {
      listingForm.submit();
      return;
    }

    const location = locationInput.value;

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

    document.getElementById("lat").value = lat;
    document.getElementById("lng").value = lng;

    console.log("Coordinates:", lat, lng);

    listingForm.submit(); // ✅ submit ONLY this form
  });
}




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
