function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}

/* ========== Tabs (Login/Register/Forgot Password) ========== */
function switchTab(tab) {
  document.getElementById("loginForm").style.display = tab === "login" ? "flex" : "none";
  document.getElementById("registerForm").style.display = tab === "register" ? "flex" : "none";
  document.getElementById("forgotPasswordForm").style.display = tab === "forgotPassword" ? "flex" : "none";
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
    const mainContent = document.getElementById("mainContent");
    if (mainContent) mainContent.style.display = "flex";
    showSection("home");
  } else {
    alert("❌ Invalid credentials or not registered.");
  }
});

/* ========== Forgot Password ========== */
document.getElementById("forgotPasswordForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("forgotUsername").value.trim();
  const newPassword = document.getElementById("newPassword").value;
  if (!username || !newPassword) {
    alert("⚠ Please fill all fields.");
    return;
  }
  const stored = JSON.parse(localStorage.getItem("user") || "null");
  if (stored && stored.username === username) {
    stored.password = newPassword;
    localStorage.setItem("user", JSON.stringify(stored));
    alert("✅ Password reset successfully! Please login.");
    switchTab("login");
  } else {
    alert("❌ User not found. Please check your username.");
  }
});

/* ========== Section switching (Smooth Scroll) ========== */
function showSection(id) {
  const s = document.getElementById(id);
  if (s) {
    // Scroll the section into view beautifully
    s.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
window.showSection = showSection;

/* ========== ScrollSpy & Reveal Animations ========== */
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section");
  const navLinks = document.querySelectorAll(".bottom-nav a");

  // ScrollSpy observer
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Remove active class from all nav links
        navLinks.forEach((link) => link.classList.remove("active-nav"));
        // Add active class to the corresponding nav link
        const activeLink = document.querySelector(`.bottom-nav a[onclick="showSection('${entry.target.id}')"]`);
        if (activeLink) activeLink.classList.add("active-nav");
      }
    });
  }, { threshold: 0.5 }); // Trigger when 50% of the section is visible

  sections.forEach((sec) => spyObserver.observe(sec));

  // Reveal Animation observer
  const revealElements = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  revealElements.forEach((el) => revealObserver.observe(el));
});

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
    
    if (!res.ok || data.error) {
      console.error("Gemini API error:", data.error || "Unknown Error");
      return getMockChatbotResponse(userText);
    }

    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      getMockChatbotResponse(userText)
    );
  } catch (err) {
    console.error("Gemini API exception:", err);
    return getMockChatbotResponse(userText);
  }
}

// Fallback logic if API key is invalid or quota exceeded
function getMockChatbotResponse(text) {
  const lowerText = text.toLowerCase();
  
  // Headache / Sar Dard
  if (lowerText.includes("headache") || lowerText.includes("sar dard") || lowerText.includes("sir dard") || lowerText.includes("pain in head")) {
    return "⚕️ **For Headache (Sar Dard):**\n\n1. Drink a large glass of water, as dehydration is a common cause.\n2. Rest in a quiet, dark room.\n3. You can gently massage your temples or apply a cold/warm compress.\n4. If the pain is severe, an over-the-counter pain reliever like Paracetamol (Acetaminophen) can help.\n\n*Note: Agar dard bohot zyada hai ya 2 din se kam nahi ho raha, please consult a doctor immediately.*";
  }
  
  // Stomach ache / Pet dard
  if (lowerText.includes("stomach") || lowerText.includes("pet dard") || lowerText.includes("stomach ache") || lowerText.includes("acidity") || lowerText.includes("gas")) {
    return "⚕️ **For Stomach Ache / Acidity (Pet Dard):**\n\n1. Drink warm water or peppermint tea to soothe your stomach.\n2. Avoid spicy, oily, or heavily processed foods.\n3. An antacid can help if you are experiencing heartburn or acidity.\n\n*Note: Agar pet dard asahniya (unbearable) hai ya ulti (vomiting) ho rahi hai, toh turant doctor se sampark karein.*";
  }
  
  // Fever / Bukhar
  if (lowerText.includes("fever") || lowerText.includes("bukhar") || lowerText.includes("bukhari") || lowerText.includes("temperature")) {
    return "⚕️ **For Fever (Bukhar):**\n\n1. Get plenty of rest and stay hydrated by drinking water and clear broths.\n2. Keep your room comfortably cool.\n3. You may take an over-the-counter fever reducer like Paracetamol. Avoid taking antibiotics without a prescription.\n\n*Note: Agar bukhar 102°F (38.9°C) se zyada hai ya 3 din se nahi utar raha, please see a doctor immediately.*";
  }
  
  // Cough and Cold / Khasi Zukham
  if (lowerText.includes("cough") || lowerText.includes("cold") || lowerText.includes("khasi") || lowerText.includes("zukham") || lowerText.includes("sardi")) {
    return "⚕️ **For Cough & Cold (Khasi aur Zukham):**\n\n1. Do warm salt-water gargles 2-3 times a day for a sore throat.\n2. Drink warm fluids, like tea with honey and ginger.\n3. Use steam inhalation to clear nasal congestion.\n\n*Note: Agar saans lene mein takleef ho (breathing difficulty), turant doctor ko dikhayein.*";
  }
  
  // Appointment / Booking
  if (lowerText.includes("appointment") || lowerText.includes("book") || lowerText.includes("doctor")) {
    return "📅 **To Book an Appointment:**\n\nPlease use the '📅 Book Appointment' button located at the top right corner of the navigation bar. You can select your preferred specialist and schedule a visit anytime!";
  }
  
  // Greetings
  if (lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("hey") || lowerText.includes("namaste") || lowerText.includes("kya haal")) {
    return "👋 **Hello! Namaste!**\n\nI am HealthBot, your AI medical assistant. You can ask me about symptoms like fever (bukhar), headache (sar dard), stomach ache, or how to book an appointment!";
  }
  
  // General fallback
  return "🤖 **HealthBot System:**\n\nI am currently operating in offline mode. For specific medical queries like this, I highly recommend consulting a certified medical professional.\n\nTry asking me about common symptoms like:\n- \"I have a headache / Mujhe sar dard hai\"\n- \"Fever / Mujhe bukhar hai\"\n- \"Cough and cold / Khasi aur zukham\"";
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

/* ========== Medicine Search Logic ========== */
async function searchMedicineFDA(query) {
  try {
    // Try exact brand name search first
    let res = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(query)}"&limit=1`);
    
    // Fallback to generic name search
    if (!res.ok) {
       res = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encodeURIComponent(query)}"&limit=1`);
    }
    
    // Fallback to general search
    if (!res.ok) {
       res = await fetch(`https://api.fda.gov/drug/label.json?search="${encodeURIComponent(query)}"&limit=1`);
    }
    
    if (!res.ok) {
       return getMockMedicineInfo(query) || "❌ Medicine not found in database. Please check the spelling.";
    }
    
    const data = await res.json();
    if (!data || !data.results || data.results.length === 0) {
        return getMockMedicineInfo(query) || "❌ No data found.";
    }
    
    const drug = data.results[0];
    const brandName = drug.openfda?.brand_name?.[0] || query.toUpperCase();
    const genericName = drug.openfda?.generic_name?.[0] || "";
    
    const indications = drug.indications_and_usage ? drug.indications_and_usage[0] : (drug.purpose ? drug.purpose[0] : "No usage information provided.");
    const warnings = drug.warnings ? drug.warnings[0] : "No warnings provided.";
    
    let info = `📌 Brand: ${brandName}\n`;
    if (genericName) info += `🧪 Generic: ${genericName}\n`;
    info += `\n✅ Uses & Indications:\n${indications.substring(0, 500)}${indications.length > 500 ? '...' : ''}\n`;
    info += `\n⚠ Warnings & Side Effects:\n${warnings.substring(0, 500)}${warnings.length > 500 ? '...' : ''}`;
    
    return info;
  } catch(e) {
    return getMockMedicineInfo(query) || "⚠ Network error fetching data.";
  }
}

function getMockMedicineInfo(text) {
   const lower = text.toLowerCase();
   if (lower.includes('vicks')) return "📌 Brand: VICKS\n🧪 Generic: Menthol, Camphor, Eucalyptus Oil\n\n✅ Uses:\nTemporarily relieves cough associated with a cold. Temporarily relieves minor aches and pains of muscles and joints.\n\n⚠ Warnings:\nFor external use only. Avoid contact with eyes. Do not use by mouth, with tight bandages, or in nostrils.";
   if (lower.includes('aspirin')) return "📌 Brand: ASPIRIN\n\n✅ Uses:\nProvides temporary relief of minor aches and pains and reduces fever.\n\n⚠ Warnings:\nReye's syndrome warning: Children and teenagers who have or are recovering from chicken pox or flu-like symptoms should not use this product.";
   if (lower.includes('paracetamol') || lower.includes('crocin') || lower.includes('tylenol')) return "📌 Brand: PARACETAMOL\n\n✅ Uses:\nPain reliever and fever reducer.\n\n⚠ Warnings:\nLiver warning: This product contains acetaminophen. Severe liver damage may occur if you take more than 4,000 mg in 24 hours.";
   return null;
}

const medSearchInput = document.getElementById("medicineSearchInput");
const medSearchBtn = document.getElementById("medicineSearchBtn");
const medResultDialog = document.getElementById("medicineResultDialog");
const medResultTitle = document.getElementById("medicineResultTitle");
const medResultBody = document.getElementById("medicineResultBody");
const closeMedResultBtn = document.getElementById("closeMedicineResult");
const translateHindiBtn = document.getElementById("translateHindiBtn");

let currentMedInfoEnglish = "";

async function translateToHindi(text) {
  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(text)}`);
    const data = await res.json();
    return data[0].map(item => item[0]).join("");
  } catch (e) {
    console.error("Translation error:", e);
    return "अनुवाद विफल (Translation failed). Please check your internet connection.";
  }
}

if (medSearchBtn) {
  medSearchBtn.addEventListener("click", async () => {
    const query = medSearchInput.value.trim();
    if (!query) {
      alert("Please enter a medicine name to search.");
      return;
    }

    // Show loading modal
    medResultTitle.textContent = "Information for: " + query;
    medResultBody.innerHTML = "<i>Searching Global FDA Database... 🔍</i>";
    
    // Reset translate button state
    if (translateHindiBtn) {
      translateHindiBtn.textContent = "Translate to Hindi / हिंदी";
      translateHindiBtn.style.display = "none"; // hide until loaded
    }
    
    if (medResultDialog.showModal) medResultDialog.showModal();
    else medResultDialog.setAttribute("open", "");

    // Fetch from OpenFDA
    const response = await searchMedicineFDA(query);

    // Display result
    currentMedInfoEnglish = response;
    medResultBody.innerText = response;
    
    if (translateHindiBtn) translateHindiBtn.style.display = "inline-block";
  });
}

if (translateHindiBtn) {
  translateHindiBtn.addEventListener("click", async () => {
    if (medResultBody.innerText === currentMedInfoEnglish) {
      medResultBody.innerHTML = "<i>अनुवाद हो रहा है... (Translating...) ⏳</i>";
      const hindiText = await translateToHindi(currentMedInfoEnglish);
      medResultBody.innerText = hindiText;
      translateHindiBtn.textContent = "Show in English";
    } else {
      medResultBody.innerText = currentMedInfoEnglish;
      translateHindiBtn.textContent = "Translate to Hindi / हिंदी";
    }
  });
}

if (medSearchInput) {
  medSearchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") medSearchBtn.click();
  });
}

if (closeMedResultBtn) {
  closeMedResultBtn.addEventListener("click", () => {
    try { medResultDialog.close(); } catch { medResultDialog.removeAttribute("open"); }
  });
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

/* ================= Premium Features Logic ================= */



// 2. Scroll Progress Bar
const progressBar = document.getElementById("scrollProgressBar");
if (progressBar) {
  window.addEventListener("scroll", () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = scrollPercentage + "%";
  });
}

// 3. Dark Mode Toggle
const darkModeToggle = document.getElementById("darkModeToggle");
if (darkModeToggle) {
  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      darkModeToggle.textContent = "☀️";
      darkModeToggle.title = "Toggle Light Mode";
    } else {
      darkModeToggle.textContent = "🌙";
      darkModeToggle.title = "Toggle Dark Mode";
    }
  });
}

// 4. Floating Parallax Particles
const particlesContainer = document.getElementById("particles-container");
if (particlesContainer) {
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    
    // Randomize size, position, and animation duration
    const size = Math.random() * 50 + 10;
    particle.style.width = size + "px";
    particle.style.height = size + "px";
    particle.style.left = Math.random() * 100 + "vw";
    
    const duration = Math.random() * 10 + 10; // 10s to 20s
    const delay = Math.random() * 10;
    particle.style.animationDuration = duration + "s";
    particle.style.animationDelay = "-" + delay + "s";
    
    particlesContainer.appendChild(particle);
  }
}

