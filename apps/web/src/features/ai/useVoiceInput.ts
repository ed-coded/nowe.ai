"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";

// The Web Speech API has no official TS lib entry — minimal local typing
// for just what this hook uses, instead of reaching for `any`.
interface SpeechRecognitionResultLike {
  transcript: string;
}
interface SpeechRecognitionEventLike extends Event {
  results: { [index: number]: { [index: number]: SpeechRecognitionResultLike } };
}
interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

interface UseVoiceInputOptions {
  onResult: (transcript: string) => void;
}

function getConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

// Support never changes after the page loads, so there's nothing to subscribe
// to — but useSyncExternalStore's getServerSnapshot is guaranteed to be used
// for SSR *and* the first client render, so the capability check can never
// disagree with what the server rendered (unlike reading it during render).
function subscribe() {
  return () => {};
}
function getClientSnapshot() {
  return getConstructor() !== null;
}
function getServerSnapshot() {
  return false;
}

/** Real browser speech-to-text (no backend) — feature-detected with a graceful no-op fallback. */
export function useVoiceInput({ onResult }: UseVoiceInputOptions) {
  const isSupported = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const start = useCallback(() => {
    const Ctor = getConstructor();
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) onResult(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [onResult]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isSupported, isListening, start, stop };
}
