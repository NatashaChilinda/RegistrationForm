const form = document.getElementById("registrationForm");
const cardsContainer = document.getElementById("cardsContainer");
const tableBody = document.querySelector("#summaryTable tbody");
const feedback = document.getElementById("feedback");
const searchInput = document.getElementById("search");

let profiles = JSON.parse(localStorage.getItem("profiles")) || [];
let editIndex = null; // Tracks which profile is being edited

// Email regex (must be lowercase)
const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

function validateField(input, condition, errorId, errorMessage) {
  const errorElement = document.getElementById(errorId);

  if (condition) {
    errorElement.textContent = "";
    input.classList.remove("invalid");
    input.classList.add("valid");
    return true;
  } else {
    errorElement.textContent = errorMessage;
    input.classList.remove("valid");
    input.classList.add("invalid");
    return false;
  }
}

function validateForm() {
  let isValid = true;

  if (!validateField(form.firstName, form.firstName.value.trim() !== "", "firstNameError", "First name required")) isValid = false;
  if (!validateField(form.lastName, form.lastName.value.trim() !== "", "lastNameError", "Last name required")) isValid = false;
  if (!validateField(form.email, emailRegex.test(form.email.value.trim()), "emailError", "Invalid email (lowercase only)")) isValid = false;
  if (!validateField(form.programme, form.programme.value.trim() !== "", "programmeError", "Programme required")) isValid = false;
  if (!validateField(form.year, form.year.value !== "", "yearError", "Select year")) isValid = false;

  return isValid;
}

// Live validation
["firstName", "lastName", "email", "programme", "year"].forEach(field => {
  form[field].addEventListener("input", validateForm);
});

function renderProfiles() {
  cardsContainer.innerHTML = "";
  tableBody.innerHTML = "";

  profiles.forEach((profile, index) => {
    // Card
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${profile.photo || "https://via.placeholder.com/200"}" alt="Profile Photo">
      <h3>${profile.firstName} ${profile.lastName}</h3>
      <p><strong>Email:</strong> ${profile.email}</p>
      <p><strong>Programme:</strong> ${profile.programme}</p>
      <p><strong>Year:</strong> ${profile.year}</p>
      <p><em>${profile.interests}</em></p>
      <button onclick="editProfile(${index})">Edit</button>
      <button onclick="removeProfile(${index})">Remove</button>
    `;
    cardsContainer.appendChild(card);

    // Table Row
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${profile.firstName} ${profile.lastName}</td>
      <td>${profile.email}</td>
      <td>${profile.programme}</td>
      <td>${profile.year}</td>
      <td class="actions">
        <button onclick="editProfile(${index})">Edit</button>
        <button onclick="removeProfile(${index})">Remove</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  localStorage.setItem("profiles", JSON.stringify(profiles));
}

form.addEventListener("submit", e => {
  e.preventDefault();
  if (!validateForm()) return;

  const profileData = {
    firstName: form.firstName.value.trim(),
    lastName: form.lastName.value.trim(),
    email: form.email.value.trim(),
    programme: form.programme.value.trim(),
    year: form.year.value,
    interests: form.interests.value.trim(),
    photo: form.photo.value.trim()
  };

  if (editIndex !== null) {
    // Update existing profile
    profiles[editIndex] = profileData;
    feedback.textContent = "Profile updated successfully!";
    editIndex = null;
  } else {
    // Add new profile
    profiles.push(profileData);
    feedback.textContent = "Profile added successfully!";
  }

  renderProfiles();
  setTimeout(() => feedback.textContent = "", 3000);
  form.reset();

  // Remove validation highlights
  document.querySelectorAll("input, select, textarea").forEach(el => el.classList.remove("valid", "invalid"));
});

// Edit profile
function editProfile(index) {
  const profile = profiles[index];
  editIndex = index;

  form.firstName.value = profile.firstName;
  form.lastName.value = profile.lastName;
  form.email.value = profile.email;
  form.programme.value = profile.programme;
  form.year.value = profile.year;
  form.interests.value = profile.interests;
  form.photo.value = profile.photo;

  // Highlight all fields as valid
  document.querySelectorAll("input, select, textarea").forEach(el => {
    el.classList.add("valid");
    el.classList.remove("invalid");
  });
}

// Remove profile
function removeProfile(index) {
  if (confirm("Are you sure you want to remove this profile?")) {
    profiles.splice(index, 1);
    renderProfiles();
  }
}

// Search function (filters cards and table)
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();

  // Filter table rows
  document.querySelectorAll("#summaryTable tbody tr").forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(query) ? "" : "none";
  });

  // Filter cards
  document.querySelectorAll(".card").forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(query) ? "" : "none";
  });
});

// Initial render
renderProfiles();






