# Conversational AI Hackathon @ Cambridge 🎙️🤖
## 20th January 2025
Welcome to the **Conversational AI Hackathon**, hosted at Cambridge! 🚀 This event is your opportunity to dive into the exciting world of Conversational AI and build real-time, voice-driven applications that tackle innovative challenges.

Email {sohaib, jiameng, adnan, lohith, emma, rachel}@neuphonic.com if you need any help!

---

## Challenge

**Build a real-time conversational AI solution** that delivers seamless, voice-driven interactions for innovative use cases. Your goal is to combine state-of-the-art components to create a functional, impactful system.

---

## Judging Criteria

Your project will be judged based on the following criteria:

1. **Functionality (15%)**
   - How well does the solution perform its intended task?  
   - Does the conversational AI respond appropriately and handle various inputs effectively?

2. **Innovation & Creativity (40%)**
   - Is the idea unique, or does it improve upon existing solutions?  
   - Does it demonstrate creative use of conversational AI technology?

3. **User Experience (15%)**
   - Is the AI interaction intuitive and engaging for users?  
   - Are the responses natural and contextually relevant?

4. **Impact & Applicability (30%)**
   - How well does the solution address a real-world problem?  
   - Can the project be scaled or adapted for broader use cases?

---

## Table of Contents

- [Conversational AI Hackathon @ Cambridge 🎙️🤖](#conversational-ai-hackathon--cambridge-️)
  - [20th January 2025](#20th-january-2025)
  - [Challenge](#challenge)
  - [Judging Criteria](#judging-criteria)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Setup](#setup)
    - [Project Structure](#project-structure)
    - [Prerequisites](#prerequisites)
    - [Getting Started](#getting-started)
  - [Challenges \& Ideas](#challenges--ideas)
    - [Challenges](#challenges)
    - [Project Ideas](#project-ideas)
  - [Contribution Guidelines](#contribution-guidelines)
  - [License](#license)


---

## Introduction

The hackathon is designed to give you hands-on experience with:  
- **Text-to-Speech (TTS):** Utilising Neuphonic's API for Voice Synthesis.  
- **Speech-to-Speech (TTS):** Utilising Neuphonic's API for Conversational AI

In what follows, we'll show you how to get started and use our software!

---

## Setup

### Project Structure
```bash
├── Quickstart.ipynb                # JupyterNotebook going over various helpful examples
├── README.md                       # Documentation
├── LICENSE                         # MIT License
└── requirements.txt                # Dependencies
```

### Prerequisites

You will need to be running a minimum of Python 3.10+.

### Getting Started

Start by cloning this repository. 
```bash
git clone https://github.com/neuphonic/cambridge-hackathon.git
cd cambridge-hackathon
```

Set up a virtual environment and install the necessary dependencies.
There are multiple ways to create a virtual environment (e.g., conda, venv, etc.), so feel free to use your preferred method.
Here is an example using Python's built-in venv module:

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Then head over to the [https://docs.neuphonic.com/quickstart](https://docs.neuphonic.com/quickstart) 
section of our docs for instructions on how to get started where we demonstrate
1. How to get your API key.
2. How to run some example applications.

> :warning: Mac users may encounter a `'portaudio.h' file not found` when trying to play audio or install
> `pyaudio`. You can resolve this error by running `brew install portaudio`. 
> Install `brew` at [https://brew.sh/](https://brew.sh/) if you don't have it already.

Additionally, you can explore the `Quickstart.ipynb` Jupyter notebook, which guides you through 
performing text-to-speech using the Neuphonic API and utilizing our Agents (Chatbot) feature.

Explore the rest of our documentation to see what other features we have!

---

## Challenges & Ideas

### Challenges
- **Real-time performance**: Ensure smooth, low-latency interactions.  
- **Robustness**: Handle varied accents, speech rates, and noisy environments.  

### Project Ideas
- **Virtual Assistant**: Build a personalized voice assistant.  
- **Interactive Learning**: Develop a language learning app.  
- **Accessibility Tool**: Create tools for users with disabilities.
- **News Summarisation**: Fetch the latest news, generates concise summaries, and delivers them as personalized audio clips.
- **Dynamic Storytelling**: Create interactive audiobooks, with the story adapting based on mood or context.
- **TTS Fitness Coach**: Cirtual fitness coach that provides real-time, motivational voice instructions during workouts.
- **AI Audioguides**:Design a tool for generating personalized audioguides for museums or attractions.

---

## Contribution Guidelines

All contributions during the hackathon should be:  
- Clearly documented.  
- Tested to ensure compatibility with the main system.  

---

## License

This project is licensed under the MIT License. See `LICENSE` for more details.

---

Happy Hacking! 🎉
