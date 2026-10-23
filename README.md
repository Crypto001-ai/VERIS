VERIS - Verify Before You Trust

Before you pay, check the proof.

VERIS is an AI-powered safety companion that helps people evaluate suspicious financial messages and payment requests before acting. It explains warning signs, recommends practical verification steps, and helps users make more informed decisions without relying on fear or urgency.

Live Demo

Try VERIS: [Insert deployed web app URL]

Source Code: [Insert public GitHub repository URL]

The Problem

Scammers exploit trust, fear, and urgency to pressure people into sending money or sharing sensitive information.

For example, someone may receive a WhatsApp message that appears to come from a relative claiming to be at a hospital or police checkpoint and urgently requesting ₦20,000.

The recipient may panic and transfer the money before confirming the sender's identity.

VERIS is designed to help people pause, examine the message, and verify the situation before taking action.

How It Works

1. Submit a message: Paste suspicious text or upload a screenshot, where supported.
2. Examine warning signs: AI analyses the submitted content and explains potentially suspicious wording or requests.
3. Understand the evidence: Learn what deserves attention and what remains unverified.
4. Choose safer next steps: Follow practical guidance, such as calling the supposed sender through a previously known phone number before transferring money.

Features

- AI-powered analysis of suspicious financial messages.
- Evidence-based explanations of potential warning signs.
- Practical identity-verification and payment-safety guidance.
- Guidance for requests involving sensitive information such as BVNs, passwords, PINs, and verification codes.
- Support for text and screenshot analysis, according to the configured model's capabilities.
- Responsive interface for desktop and mobile devices.

AI Model and Open Innovation

VERIS is built around an open-weight Gemma model.

Model: [Insert exact Gemma model ID]

Inference method: [Insert hosted provider or local runtime]

The project uses an open-weight model so developers can inspect its documentation, explore deployment options, and build on the technology rather than treating the AI as an inaccessible black box.

The application code is released under the MIT License. The model's weights and related assets remain subject to their own applicable licence and terms.

Technology Stack

Update this list to match the actual implementation:

- Frontend: [Actual framework and language]
- AI model: Google Gemma [Exact model ID]
- Inference: [Actual provider or runtime]
- Deployment: [Actual hosting platform]

Getting Started

Prerequisites

- Git
- Node.js and npm, if required by the project
- An API key or model runtime configured for the selected Gemma inference provider

Installation

Clone the repository:

git clone https://github.com/YOUR_USERNAME/veris.git
cd veris

Install dependencies:

npm install

Create a local environment configuration file using the variable names documented in ".env.example".

Configure the required model provider and credentials. Never commit real API keys or secrets to the repository.

Start the development server using the command documented in the project's package scripts.

Follow the provider-specific instructions in the project documentation to run the application successfully.

Example Scenario

Message received:

"Please send ₦20,000 immediately. I'm at the hospital, my banking app isn't working, and I'll pay you back in an hour."

VERIS should identify relevant warning signs, including pressure to act quickly and an urgent request to transfer money, then recommend independently contacting the supposed sender before paying.

These warning signs do not prove that the message is fraudulent. A genuine emergency is also possible, so independent verification matters.

Privacy and Safety

- Remove personal information from messages and screenshots before submitting them.
- Never share passwords, PINs, one-time codes, or banking credentials to verify an emergency.
- Do not treat an AI assessment as proof that a message is genuine or fraudulent.
- Verify payment requests through an independent, trusted communication channel.
- Review the configured inference provider's data-handling policies before submitting sensitive information.

VERIS is an educational safety tool, not a guarantee against fraud or a substitute for independent verification.

Limitations

- AI may misinterpret messages or miss warning signs.
- A familiar profile picture or display name does not prove the sender's identity.
- A suspicious message may have a legitimate explanation.
- VERIS cannot independently confirm that a sender, emergency, bank account, or payment request is genuine unless a separately implemented and reliable verification source supports that conclusion.

Contributing

Contributions, bug reports, and suggestions are welcome. Please open an issue to discuss significant changes before submitting a pull request.

Licence

This project's source code is available under the MIT License. See the "LICENSE" (LICENSE) file.

The Gemma model and third-party dependencies are subject to their respective licences and terms.
