## XPlain

XPlain is a Chrome extension designed to help you understand code while browsing on GitHub. It uses a local running LLM server to help you to understand unfamiliar codebases and learn new programming concepts.

---

## Demo

![Demo Video](./xplain.gif)



### Features
- Code Explanation: Get instant explanations for code snippets while browsing GitHub.
- No external API calls. Everything happens on your machine. It is designed with Local LLM Inference in mind, for a privacy first experience.
- **Extensible**: Works on ```github.com``` by default but is extensible to work with other websites like gitlab, jupyter notebooks, etc. Simply update your ```manifest.json``` and provide host_permissions to your favorite websites to understand code.
- Support for Multiple Languages: Currently this extension has been tested with SOTA microsoft-phi-2 and performs best with python codebases. Stay tuned for multiple language support
- Easy to Use: Simply select over a piece of code and press ```x+p``` together ***(short for xplain)*** to get an explanation.

---

### Installation

- Clone this repository
- Navigate to chrome://extensions in your Chrome browser.
- Enable Developer Mode by clicking the toggle switch next to Developer mode.
- Click the LOAD UNPACKED button and select the extension directory.
- Voila! Your extension is active

---

### Usage

- Navigate to any GitHub repository and open a file. Select the code snippet you want understanding of.
- After selection, press ```x+p``` together (short for xplain) and the local LLM server will do the rest for you.

---

### Contributing
Contributions are welcome! Please read our contributing guide to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to MLXPlain.

### License
XPlain is MIT licensed.

### Contact
If you have any questions, feel free to reach out to us.