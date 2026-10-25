import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../stylesheets/Chatbot.css";
import {
  FaRobot,
  FaPaperPlane,
  FaTimes,
  FaCommentDots,
  FaMicrophone,
  FaMicrophoneSlash,
  FaPause,
  FaPlay,
} from "react-icons/fa";

const getApiErrorMessage = (error) => {
  const status = error.response?.status;
  const apiMessage = error.response?.data?.error?.message;

  if (status === 400 || status === 401 || status === 403) {
    return `Gemini rejected the request${apiMessage ? `: ${apiMessage}` : ". Check the server API key and Google API access."}`;
  }
  if (status === 404) {
    return `Gemini could not find the requested model${apiMessage ? `: ${apiMessage}` : ". Check that the configured model supports generateContent."}`;
  }
  if (status === 429) {
    return `Gemini's request quota was reached${apiMessage ? `: ${apiMessage}` : ". Check your Google AI quota and try again later."}`;
  }
  if (status) {
    return `Gemini returned an error (${status})${apiMessage ? `: ${apiMessage}` : ". Please try again later."}`;
  }
  return error.message || "Could not reach the chat service. Check your connection and try again.";
};

const getPreferredSpeechVoice = (voices, language) => {
  const femaleVoicePattern =
    /\b(female|samantha|victoria|karen|zira|aria|jenny|ava|susan|michelle|linda|hazel|sara|natasha|eva|emma|olivia|sonia|priya|heera|veena|lekha|swara)\b/i;
  const matchingVoices = voices.filter((voice) =>
    femaleVoicePattern.test(voice.name) &&
    voice.lang.split("-")[0].toLowerCase() ===
      language.split("-")[0].toLowerCase()
  );
  return matchingVoices.find(
    (voice) => voice.lang.toLowerCase() === language.toLowerCase()
  ) || matchingVoices[0];
};

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeechPaused, setIsSpeechPaused] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [speechRecognitionSupported, setSpeechRecognitionSupported] =
    useState(false);
  const [speechVoices, setSpeechVoices] = useState([]);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechRecognitionSupported(Boolean(SpeechRecognition));

    const loadVoices = () =>
      setSpeechVoices(window.speechSynthesis?.getVoices() || []);
    loadVoices();
    window.speechSynthesis?.addEventListener("voiceschanged", loadVoices);

    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
      window.speechSynthesis?.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError("Voice input is not supported in this browser.");
      return;
    }

    const typedText = input.trim();
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript.trim())
        .filter(Boolean)
        .join(" ");
      setInput([typedText, transcript].filter(Boolean).join(" "));
      setVoiceError("");
    };
    recognition.onerror = (event) => {
      setVoiceError(
        event.error === "not-allowed"
          ? "Microphone access was denied. Allow microphone access in your browser settings."
          : "Voice input failed. Please try again."
      );
    };
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    setVoiceError("");
    setIsListening(true);
    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setIsListening(false);
      setVoiceError("Could not start voice input. Please try again.");
    }
  };

  const closeChat = () => {
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
    setIsListening(false);
    setIsSpeaking(false);
    setIsSpeechPaused(false);
    setIsOpen(false);
  };

  const toggleSpeechPlayback = () => {
    if (!window.speechSynthesis) return;

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsSpeechPaused(false);
    } else if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsSpeechPaused(true);
    }
  };

  const sendMessage = async () => {
    const question = input.trim();
    if (!question || isSending) return;

    const userMessage = { sender: "user", text: question };
    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setInput("");

    setIsSending(true);
    try {
      const conversation = [
        ...messages
          .filter((message) => !message.isError)
          .slice(-11)
          .map((message) => ({
            role: message.sender === "user" ? "user" : "model",
            parts: [{ text: message.text }],
          })),
        {
          role: "user",
          parts: [{ text: question }],
        },
      ];
      const response = await axios.post("/api/chat", {
        contents: conversation,
      });
      const botMessage = response.data?.text;

      if (!botMessage) {
        throw new Error("Gemini returned an empty response.");
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        { sender: "bot", text: botMessage },
      ]);
      if (window.speechSynthesis) {
        const language = "en-US";
        const voice = getPreferredSpeechVoice(speechVoices, language);
        if (!voice) {
          setIsSpeaking(false);
          setIsSpeechPaused(false);
          setVoiceError(
            "No female English speech voice is available in this browser. Install or enable one in your device's speech settings."
          );
        } else {
          const utterance = new SpeechSynthesisUtterance(botMessage);
          utterance.lang = language;
          utterance.voice = voice;
          utterance.onstart = () => {
            setIsSpeaking(true);
            setIsSpeechPaused(false);
            setVoiceError("");
          };
          utterance.onend = () => {
            setIsSpeaking(false);
            setIsSpeechPaused(false);
          };
          utterance.onerror = () => {
            setIsSpeaking(false);
            setIsSpeechPaused(false);
          };
          utterance.onpause = () => setIsSpeechPaused(true);
          utterance.onresume = () => setIsSpeechPaused(false);
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utterance);
        }
      }
    } catch (error) {
      const message = error.response
        ? getApiErrorMessage(error)
        : error.message === "Gemini returned an empty response."
          ? error.message
          : getApiErrorMessage(error);

      console.error("Gemini chatbot request failed:", {
        status: error.response?.status,
        message: error.response?.data?.error?.message || error.message,
      });
      setMessages((currentMessages) => [
        ...currentMessages,
        { sender: "bot", text: message, isError: true },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen ? (
        <div className="chatbot-icon" onClick={() => setIsOpen(true)}>
          <FaCommentDots />
        </div>
      ) : (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <FaRobot className="chat-icon" />
            <span>Portfolio AI Chat</span>
            <button
              type="button"
              className="close-icon"
              onClick={closeChat}
              aria-label="Close chat"
              title="Close chat"
            >
              <FaTimes />
            </button>
          </div>
          <div className="chatbot-body">
            <div className="chatbot-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            {voiceError && (
              <p className="voice-feedback" role="alert">
                {voiceError}
              </p>
            )}
            <div className="chatbot-input">
              <input
                type="text"
                placeholder={
                  isSending
                    ? "Waiting for a reply..."
                    : isListening
                      ? "Listening in English..."
                      : "Ask me in English..."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                disabled={isSending}
              />
              <button
                className={`voice-input-button${isListening ? " active" : ""}`}
                onClick={toggleListening}
                disabled={!speechRecognitionSupported || isSending}
                aria-label={isListening ? "Stop voice input" : "Start voice input"}
                aria-pressed={isListening}
                title={
                  speechRecognitionSupported
                    ? isListening
                      ? "Stop voice input"
                      : "Start voice input"
                    : "Voice input is not supported in this browser"
                }
              >
                {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
              </button>
              {isSpeaking ? (
                <button
                  onClick={toggleSpeechPlayback}
                  aria-label={isSpeechPaused ? "Resume spoken reply" : "Pause spoken reply"}
                  title={isSpeechPaused ? "Resume spoken reply" : "Pause spoken reply"}
                >
                  {isSpeechPaused ? <FaPlay /> : <FaPause />}
                </button>
              ) : (
                <button
                  onClick={sendMessage}
                  disabled={isSending || !input.trim()}
                  aria-label="Send message"
                  title="Send message"
                >
                  <FaPaperPlane />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
