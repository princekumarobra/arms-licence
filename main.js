// Apka Latest Link
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbxB3HMHjB1D1uHn9bDKLnVM4AtlR2q8GS27XtipvX8fKYxKRVl2ZRuPwp7acvISE8XRoA/exec";

async function searchData() {
  const inputVal = document.getElementById("uinInput").value.trim();
  const loader = document.getElementById("loader");
  const printArea = document.getElementById("printArea");
  const btnDiv = document.getElementById("btnDiv");
  
  // Reset old data
  printArea.classList.add("hidden");
  btnDiv.classList.add("hidden");
  
  if (!inputVal) {
    alert("Please enter UIN Number");
    return;
  }
  
  loader.classList.remove("hidden");
  
  try {
    const response = await fetch(SHEET_API_URL);
    const data = await response.json();
    
    // UIN Match
    const result = data.find(row => String(row["UIN"]).trim() === String(inputVal).trim());
    
    if (result) {
      // Data Fill
      document.getElementById("res_uin").textContent = result["UIN"];
      document.getElementById("res_name").textContent = result["LICENCE NAME"];
      document.getElementById("res_father").textContent = result["FATHER SPOUSE NAME"] || result["FATHER NAME"];
      
      let dob = result["DATE OF BIRTH"];
      if (dob) document.getElementById("res_dob").textContent = String(dob).substring(0, 10);
      
      document.getElementById("res_licno").textContent = result["LICENCE NO"];
      document.getElementById("res_area").textContent = result["AREA VALIDITY"];
      
      // Smart Authority Search
      let auth = result["ISSUING AUTHORITY"];
      if (!auth) {
        const allKeys = Object.keys(result);
        const authKey = allKeys.find(key => key.includes("AUTHORITY"));
        if (authKey) auth = result[authKey];
      }
      document.getElementById("res_auth").textContent = auth || "";
      
      // Photo Logic
      const photoImg = document.getElementById("res_photo");
      let photoUrl = result["PHOTO"];
      if (photoUrl) {
        if (photoUrl.includes("drive.google.com")) {
          const idMatch = photoUrl.match(/\/d\/(.+?)\//);
          if (idMatch) photoUrl = "https://lh3.googleusercontent.com/d/" + idMatch[1];
        }
        photoImg.src = photoUrl;
        photoImg.style.display = "block";
      } else {
        photoImg.style.display = "none";
      }
      
      // Show Result
      printArea.classList.remove("hidden");
      btnDiv.classList.remove("hidden");
    } else {
      alert("No Data Found for UIN: " + inputVal);
    }
    
  } catch (error) {
    console.error(error);
    alert("Error! Check Internet.");
  } finally {
    loader.classList.add("hidden");
  }
}

// --- PRINT FUNCTION (Simple & Safe) ---
function printCertificate() {
  window.print();
}

// --- RESET FUNCTION (No Reload) ---
function resetSearch() {
  document.getElementById("uinInput").value = "";
  document.getElementById("printArea").classList.add("hidden");
  document.getElementById("btnDiv").classList.add("hidden");
  document.getElementById("uinInput").focus();
}