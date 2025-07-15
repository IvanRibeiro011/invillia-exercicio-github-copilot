document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const cancelActivitySelect = document.getElementById("cancel-activity");
  const cancelParticipantSelect = document.getElementById("cancel-participant");
  const signupForm = document.getElementById("signup-form");
  const cancelForm = document.getElementById("cancel-form");
  const messageDiv = document.getElementById("message");
  const cancelMessageDiv = document.getElementById("cancel-message");
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  let activitiesData = {};

  // Tab functionality
  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab");
      
      // Remove active class from all buttons and tabs
      tabButtons.forEach(btn => btn.classList.remove("active"));
      tabContents.forEach(content => content.classList.remove("active"));
      
      // Add active class to clicked button and corresponding tab
      button.classList.add("active");
      document.getElementById(`${targetTab}-tab`).classList.add("active");
      
      // Hide any visible messages when switching tabs
      messageDiv.classList.add("hidden");
      cancelMessageDiv.classList.add("hidden");
    });
  });

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();
      activitiesData = activities;

      // Clear loading message
      activitiesList.innerHTML = "";

      // Clear existing options
      activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';
      cancelActivitySelect.innerHTML = '<option value="">-- Select an activity --</option>';

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        // Create participants list HTML
        let participantsHtml = "";
        if (details.participants.length > 0) {
          participantsHtml = `
            <div class="participants-section">
              <p><strong>Participants enrolled:</strong></p>
              <ul class="participants-list">
                ${details.participants.map(email => `<li>${email}</li>`).join('')}
              </ul>
            </div>
          `;
        } else {
          participantsHtml = '<p class="no-participants">No participants enrolled yet.</p>';
        }

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
          ${participantsHtml}
        `;

        activitiesList.appendChild(activityCard);

        // Add option to both select dropdowns
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);

        const cancelOption = document.createElement("option");
        cancelOption.value = name;
        cancelOption.textContent = name;
        cancelActivitySelect.appendChild(cancelOption);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle activity selection for cancellation
  cancelActivitySelect.addEventListener("change", (event) => {
    const selectedActivity = event.target.value;
    const participantSelect = cancelParticipantSelect;
    
    if (selectedActivity && activitiesData[selectedActivity]) {
      const participants = activitiesData[selectedActivity].participants;
      
      // Clear and enable participant select
      participantSelect.innerHTML = "";
      participantSelect.disabled = false;
      
      if (participants.length > 0) {
        participantSelect.innerHTML = '<option value="">-- Select a participant --</option>';
        participants.forEach(email => {
          const option = document.createElement("option");
          option.value = email;
          option.textContent = email;
          participantSelect.appendChild(option);
        });
      } else {
        participantSelect.innerHTML = '<option value="">-- No participants enrolled --</option>';
        participantSelect.disabled = true;
      }
    } else {
      // Reset participant select
      participantSelect.innerHTML = '<option value="">-- First select an activity --</option>';
      participantSelect.disabled = true;
    }
  });

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Handle cancel form submission
  cancelForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const activity = document.getElementById("cancel-activity").value;
    const email = document.getElementById("cancel-participant").value;

    try {
      // Try multiple endpoint patterns
      let response;
      let result;

      // First try: using signup endpoint with DELETE method
      response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "DELETE",
        }
      );

      // If 404, try alternative endpoint patterns
      if (response.status === 404) {
        // Try: /activities/{activity}/participants/{email}
        response = await fetch(
          `/activities/${encodeURIComponent(activity)}/participants/${encodeURIComponent(email)}`,
          {
            method: "DELETE",
          }
        );
      }

      if (response.status === 404) {
        // Try: POST to a cancel endpoint
        response = await fetch(
          `/activities/${encodeURIComponent(activity)}/cancel`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email }),
          }
        );
      }

      result = await response.json();

      if (response.ok) {
        cancelMessageDiv.textContent = result.message;
        cancelMessageDiv.className = "success";
        cancelForm.reset();
        // Reset participant select
        cancelParticipantSelect.innerHTML = '<option value="">-- First select an activity --</option>';
        cancelParticipantSelect.disabled = true;
        // Refresh activities list to show updated participants
        fetchActivities();
      } else {
        cancelMessageDiv.textContent = result.detail || "An error occurred";
        cancelMessageDiv.className = "error";
      }

      cancelMessageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        cancelMessageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      cancelMessageDiv.textContent = "Failed to cancel registration. Please try again.";
      cancelMessageDiv.className = "error";
      cancelMessageDiv.classList.remove("hidden");
      console.error("Error canceling registration:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
