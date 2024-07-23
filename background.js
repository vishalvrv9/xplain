//abort controller to stop generation
// https://developer.mozilla.org/en-US/docs/Web/API/AbortController
let abortController = new AbortController();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "processCode") {
    //   alert("Received code: " + request.code);
    sendToLocalLLM(request.code);
  } else if (request.action === "stopGeneration") {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
  }
});

async function sendToLocalLLM(code) {
  console.log("Sending code to local LLM: " + code);
  const baseUrl = "http://127.0.0.1:5000/generate";
  const params = new URLSearchParams({
    prompt: `
        Instruct: You are an expert programmer and technical writer. Your task is to explain the following code snippet in a clear, concise, and informative manner. Break down the explanation into logical steps and highlight key concepts.

        Code snippet:
        ${code}
        
        Please explain this code, covering the following aspects:
        1. Overall purpose of the code
        2. Key components and their functions
        3. Any important programming concepts or techniques used
        4. Use clear and concise language suitable for beginner programmers
        5. Highlight any best practices or potential optimizations
        6. If applicable, mention alternative approaches to achieve the same result

        Ensure your explanation is thorough and accurate. If you're unsure about any aspect of the code, state so clearly rather than making assumptions./n
        Output:
        `,

    stream: "true",
  });

  const llmlxEndpoint = `${baseUrl}?${params.toString()}`;
  console.log(llmlxEndpoint);

  abortController = new AbortController();

  try {
    const response = await fetch(llmlxEndpoint, {
      method: "GET",
      signal: abortController.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let fullResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const chunk = decoder.decode(value, { stream: true });
      fullResponse += chunk;

      //send chunk to content script
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "updateResponse",
          chunk: chunk,
        });
      });
    }
    console.log(fullResponse);

    // if generation is complete, simulate click on stop button
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "generationComplete",
      });
    });
  } catch (error) {
    console.error(error);
    if (error.name === "AbortError") {
      //aborted by user so abort gracefully
      console.log("Generation stopped by user");
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "updateResponse",
        chunk: "\n\nGeneration stopped",
      });
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "generationComplete",
        chunk: "\n\nGeneration stopped",
      });
    } else {
      //sending error to content script
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "error",
          error: error.toString(),
        });
      });
    }
  }finally{
    abortController = null;
  }
}
