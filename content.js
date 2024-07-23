//for creating custom shortcut
let isXPressed = false;
let isPPressed = false;

document.addEventListener("keydown", function (event) {
  if (event.key === "x") {
    isXPressed = true;
  }
  if (event.key === "p") {
    isPPressed = true;
  }
  if (isXPressed && isPPressed) {
    let selectedText = window.getSelection().toString();
    console.log(selectedText);

    if (selectedText) {
      chrome.runtime.sendMessage({ action: "processCode", code: selectedText });
      //enable stop button
      let stopButton = document.getElementById("stopButton");
      stopButton.disabled = false;
      stopButton.style.opacity = "1";
    }

    isXPressed = false;
    isPPressed = false;
  }
});

document.addEventListener("keyup", function (event) {
  if (event.key === "x") {
    isXPressed = false;
  }
  if (event.key === "p") {
    isPPressed = false;
  }
});

function createResponseDiv() {
  let responseDiv = document.createElement("div");
  responseDiv.id = "responseDiv";
  responseDiv.style.position = "fixed";
  responseDiv.style.bottom = "20px";
  responseDiv.style.right = "20px";
  responseDiv.style.width = "400px";
  responseDiv.style.maxHeight = "400px";
  responseDiv.style.overflowY = "auto";
  responseDiv.style.backgroundColor = "#c9d1d9";
  responseDiv.style.border = "1px solid #30363d";
  responseDiv.style.borderRadius = "6px";
  responseDiv.style.padding = "16px";
  responseDiv.style.zIndex = "1000";
  //   responseDiv.textContent = "Response from LLM will be displayed here";
  responseDiv.style.fontFamily =
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"';
  responseDiv.style.fontSize = "14px";
  responseDiv.style.lineHeight = "1.5";
  responseDiv.style.color = "#0d1117";
  responseDiv.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  responseDiv.style.transition = "all 0.3s ease";
  // responseDiv.style.opacity = '0';
  responseDiv.style.transform = "translateY(20px)";

  //header
  let header = document.createElement("div");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.marginBottom = "16px";

  //title
  let title = document.createElement("h3");
  title.textContent = "XPlain";
  title.style.margin = "0";
  title.style.color = "#0d1117";
  title.style.fontSize = "16px";

  //stop button
  let stopButton = document.createElement("button");
  stopButton.textContent = "Stop";
  stopButton.id = "stopButton";
  stopButton.style.backgroundColor = "#21262d";
  stopButton.style.color = "#c9d1d9";
  stopButton.style.border = "none";
  stopButton.style.padding = "5px 10px";
  stopButton.style.borderRadius = "6px";
  stopButton.style.cursor = "pointer";
  stopButton.onclick = function () {
    chrome.runtime.sendMessage({ action: "stopGeneration" });
    stopButton.textContent = "Aborted";
    stopButton.disabled = true;
    stopButton.style.opacity = "0.5";
  };

  header.appendChild(title);
  header.appendChild(stopButton);

  //generated content
  let content = document.createElement("div");
  content.id = "responseContent";
  content.textContent = "select code and press x + p to generate explanation";
  content.style.fontFamily =
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"';

  responseDiv.appendChild(header);
  responseDiv.appendChild(content);
  document.body.appendChild(responseDiv);
}

createResponseDiv();

// message listener
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  let contentDiv = document.getElementById("responseContent");
  if (request.action == "updateResponse") {
    contentDiv.textContent += request.chunk;
    contentDiv.scrollTop = responseDiv.scrollHeight;
  } else if (request.action == "error") {
    contentDiv.textContent = "Error: " + request.message;
    contentDiv.scrollTop = responseDiv.scrollHeight;
  } else if (request.action == "generationComplete") {
    let stopButton = document.getElementById("stopButton");
    stopButton.textContent = "Generation Complete";
    stopButton.disabled = true;
    stopButton.style.opacity = "0.5";
  }
});
