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
responseDiv.style.bottom = '10px';
responseDiv.style.right = '10px';
responseDiv.style.width = '300px';
responseDiv.style.maxHeight = '200px';
responseDiv.style.overflowY = 'auto';
responseDiv.style.backgroundColor = '#ffffff';
responseDiv.style.border = '1px solid black';
responseDiv.style.padding = '10px';
responseDiv.style.zIndex = '1000';
responseDiv.textContent = "Response from LLM will be displayed here";
responseDiv.style.fontFamily = '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"';
responseDiv.style.fontSize = '14px';
responseDiv.style.lineHeight = '1.5';
responseDiv.style.color = '#c9d1d9';

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