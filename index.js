function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}

/* ========== Tabs (Login/Register) ========== */
function switchTab(tab) {
  document.getElementById("loginForm").style.display = tab === "login" ? "flex" : "none";
  document.getElementById("registerForm").style.display = tab === "register" ? "flex" : "none";
  document.getElementById("loginTab").classList.toggle("active", tab === "login");
  document.getElementById("registerTab").classList.toggle("active", tab === "register");
}
window.switchTab = switchTab;

/* ========== Register & Login (localStorage demo) ========== */
document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const user = {
    username: document.getElementById("regUsername").value.trim(),
    password: document.getElementById("regPassword").value
  };
  if (!user.username || !user.password) {
    alert("⚠ Please fill all fields.");
    return;
  }
  localStorage.setItem("user", JSON.stringify(user));
  alert("✅ Registered successfully! Please login.");
  switchTab("login");
});

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const stored = JSON.parse(localStorage.getItem("user") || "null");
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;
  if (stored && stored.username === username && stored.password === password) {
    document.getElementById("authPage").style.display = "none";
    showSection("home");
  } else {
    alert("❌ Invalid credentials or not registered.");
  }
});

/* ========== Section switching ========== */
const sections = document.querySelectorAll(".section");
function showSection(id) {
  sections.forEach((sec) => sec.classList.remove("active"));
  const s = document.getElementById(id);
  if (s) s.classList.add("active");
}
window.showSection = showSection;

/* ========== Chatbot UI ========== */
const chat = document.getElementById("chat");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

/* ========== Gemini API Call ========== */
const GEMINI_API_KEY = "AIzaSyAYBdU8EhCeRGPXlYrznGrO04IrjQXLuvo"; // 🔑 Replace with your Gemini API key
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

async function botReply(userText) {
  try {
    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: userText }]
          }
        ]
      })
    });

    const data = await res.json();
    console.log("Gemini response:", data);

    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "❌ No response."
    );
  } catch (err) {
    console.error("Gemini API error:", err);
    return "⚠ Error connecting to Gemini API.";
  }
}

function appendMessage(text, who = "bot") {
  const bubble = document.createElement("div");
  bubble.className = "bubble " + (who === "me" ? "from-me" : "from-bot");
  bubble.textContent = text; // safer than innerHTML for text
  chat.appendChild(bubble);
  chat.scrollTop = chat.scrollHeight;
}


async function sendMessage(userText) {
  if (!userText.trim()) return;
  appendMessage(userText, "me");
  input.value = "";
  appendMessage("⏳ Typing...", "bot");
  const reply = await botReply(userText);
  chat.removeChild(chat.lastChild);
  appendMessage(reply, "bot");
}

sendBtn.addEventListener("click", () => sendMessage(input.value));
input.addEventListener("keydown", (e) => { if (e.key === "Enter") sendMessage(input.value); });

/* ========== Voice Recognition (Web Speech API) ========== */
const voiceBtn = document.getElementById("voiceBtn");
if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.interimResults = false;

  voiceBtn.addEventListener("click", () => {
    recognition.start();
    appendMessage("🎤 Listening...", "bot");
  });

  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    appendMessage("You (voice): " + transcript, "me");
    const reply = await botReply(transcript);
    appendMessage(reply, "bot");
  };

  recognition.onerror = (event) => {
    appendMessage("⚠ Voice error: " + event.error, "bot");
  };
} else {
  voiceBtn.disabled = true;
  voiceBtn.title = "Voice recognition not supported in this browser";
}

/* ========== Book Appointment (Modal + Date Picker + List) ========== */
const bookBtn = document.getElementById("bookAppointment");
const apptDialog = document.getElementById("apptDialog");
const dateInput = document.getElementById("appointmentDate");
const timeInput = document.getElementById("appointmentTime");
const confirmAppt = document.getElementById("confirmAppt");
const cancelAppt = document.getElementById("cancelAppt");
const appointmentsList = document.getElementById("appointmentsList");

if (dateInput) dateInput.min = todayISO();

function loadAppointments() {
  if (!appointmentsList) return;

  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  appointmentsList.innerHTML = "";

  if (appointments.length === 0) {
    appointmentsList.innerHTML = "<li>No appointments booked yet.</li>";
    return;
  }

  appointments.forEach((appt, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<b>${appt.name}</b> (${appt.contact}) - ${appt.type} on ${appt.date} at ${appt.time}`;

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.style.marginLeft = "10px";
    delBtn.onclick = () => {
      appointments.splice(index, 1);
      localStorage.setItem("appointments", JSON.stringify(appointments));
      loadAppointments();
    };

    li.appendChild(delBtn);
    appointmentsList.appendChild(li);
  });
}

if (bookBtn) {
  bookBtn.addEventListener("click", () => {
    dateInput.value = todayISO();
    timeInput.value = "";
    if (apptDialog.showModal) apptDialog.showModal();
    else apptDialog.setAttribute("open", "");
  });
}

if (confirmAppt) {
  confirmAppt.addEventListener("click", () => {
    const name = document.getElementById("appointmentName").value.trim();
    const contact = document.getElementById("appointmentContact").value.trim();
    const type = document.getElementById("appointmentType").value;
    const date = dateInput.value;
    const time = timeInput.value || "Not specified";

    if (!name || !contact || !type || !date) {
      alert("⚠ Please fill in all required fields (name, contact, type, date).");
      return;
    }

    const appointment = { name, contact, type, date, time };
    let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    appointments.push(appointment);
    localStorage.setItem("appointments", JSON.stringify(appointments));

    alert(`✅ Appointment Confirmed!\nName: ${name}\nContact: ${contact}\nType: ${type}\nDate: ${date}\nTime: ${time}`);

    try { apptDialog.close(); } catch { apptDialog.removeAttribute("open"); }
    loadAppointments();
  });
}

if (cancelAppt) {
  cancelAppt.addEventListener("click", () => {
    try { apptDialog.close(); } catch { apptDialog.removeAttribute("open"); }
  });
}

window.addEventListener("load", () => {
  appendMessage("👋 Welcome! Please login or register first.", "bot");
  loadAppointments();
});

