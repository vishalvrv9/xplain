document.addEventListener('mouseup', function() {
    let selectedText = window.getSelection().toString();
    console.log(selectedText)
    if (selectedText) {
      chrome.runtime.sendMessage({action: "processCode", code: selectedText});
    }
  });

let responseDiv = document.createElement('div');
responseDiv.id = 'responseDiv';
responseDiv.style.position = 'fixed';
responseDiv.style.bottom = '20px';
responseDiv.style.right = '20px';
responseDiv.style.width = '400px';
responseDiv.style.maxHeight = '400px';
responseDiv.style.overflowY = 'auto';
responseDiv.style.backgroundColor = '#c9d1d9';
responseDiv.style.border = '1px solid #30363d';
responseDiv.style.borderRadius = '6px';
responseDiv.style.padding = '16px';
responseDiv.style.zIndex = '1000';
responseDiv.textContent = "Response from LLM will be displayed here";
responseDiv.style.fontFamily = '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"';
responseDiv.style.fontSize = '14px';
responseDiv.style.lineHeight = '1.5';
responseDiv.style.color = '#0d1117';
responseDiv.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
responseDiv.style.transition = 'all 0.3s ease';
// responseDiv.style.opacity = '0';
responseDiv.style.transform = 'translateY(20px)';


document.body.appendChild(responseDiv);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.action == "updateResponse"){
        responseDiv.textContent += request.chunk;
        responseDiv.scrollTop = responseDiv.scrollHeight;
    }else if(request.action == "error"){
        responseDiv.textContent = "Error: " + request.message;
        responseDiv.scrollTop = responseDiv.scrollHeight;
    }
});