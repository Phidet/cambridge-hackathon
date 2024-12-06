/* Neuphonic Limited, 2024 */

import { useEffect, useRef, useState } from 'react';

export type WebSocketResponse = {
  data: {
    text: string;
    audio: string;
    sampling_rate: number | null;
  };
  agent_id: string;
  conversation_id: string;
  type: 'user' | 'assistant';
  completed?: boolean;
};

export type Message = {
  role: 'user' | 'assistant';
  text: string;
  completed?: boolean;
};

export const status = [
  'connected',
  'connecting',
  'disconnected',
] as const;
export type Status = (typeof status)[number];

export const languageIds = ['en', 'es'] as const;
export type LanguageId = (typeof languageIds)[number];

const neuphonicAPI = 'wss://eu-west-1.api.neuphonic.com';
const API_KEY = '<YOUR API KEY HERE>';

function createBuffer(
  buffer: ArrayBuffer,
  context: AudioContext,
  samplingRate: number = 44100
) {
  const array = new Int16Array(buffer);
  var array_2 = Array(array.length);
  for (var i = 0, length = array.length; i < length; i++) {
    array_2[i] = array[i] / 32768;
  }
  const buffer1 = context.createBuffer(
    1,
    buffer.byteLength / 2,
    samplingRate
  );
  buffer1.getChannelData(0).set(array_2);
  return buffer1;
}

function base64ToArrayBuffer(base64: string) {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i));
  }

  const byteArray = new Uint8Array(byteArrays).buffer;

  return byteArray;
}

export function useAgent(
  agentId: string,
  languageId: LanguageId,
  bufferDelay: number = 0.1
) {
  const ws = useRef<WebSocket>();
  const [connect, setConnect] = useState(false);
  const mediaStream = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState('Not connected');
  const [transcript, setTranscript] = useState<Message[]>([]);
  const [speaking, setSpeaking] = useState(false);

  const stopRecording = () => {
    if (ws.current && ws.current.readyState == ws.current.OPEN)
      ws.current.close();
    if (mediaStream.current) {
      mediaStream.current
        .getTracks()
        .forEach((track) => track.stop());
    }
    setStatus('Not connected');
    setConnect(false);
  };

  useEffect(() => {
    if (!agentId || !connect) {
      return;
    }

    let duration = 0;

    navigator.mediaDevices
      .getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
      .then((stream) => {
        mediaStream.current = stream;
        ws.current = new WebSocket(
          `wss://eu-west-1.api.neuphonic.com/listen/${agentId}/${languageId}?` +
            new URLSearchParams({
              api_key: 'YOUR API KEY HERE',
            })
        );
        var audioCtx = new AudioContext();
        const mediaRecorder = new MediaRecorder(stream);
        ws.current!.onopen = () => {
          setStatus('Connected');
          mediaRecorder.addEventListener(
            'dataavailable',
            async (event) => {
              if (
                event.data.size > 0 &&
                ws.current!.readyState == 1
              ) {
                ws.current!.send(event.data);
              }
            }
          );
          mediaRecorder.start(100);
        };

        ws.current!.onmessage = (message: MessageEvent<string>) => {
          const received = JSON.parse(
            message.data
          ) as WebSocketResponse;
          if (received) {
            if (received.data && received.data.text !== null) {
              const text = received.data.text;
              setTranscript((prev) => {
                if (received.type === prev[0]?.role) {
                  prev[0].text = prev[0].text + ` ${text}`;
                  prev[0].completed = received.completed;
                  return [...prev];
                } else if (text === '') {
                  return prev;
                } else {
                  return [
                    {
                      role: received.type,
                      text: text,
                      completed: received.completed,
                    },
                    ...prev,
                  ];
                }
              });
            }
            if (received.data && received.data.audio !== null) {
              const byteArray = base64ToArrayBuffer(
                received.data.audio
              );

              var track = audioCtx.createBufferSource();
              track.buffer = createBuffer(
                byteArray,
                audioCtx,
                received.data.sampling_rate ?? 44100
              );

              track.connect(audioCtx.destination);
              if (duration == 0)
                duration = audioCtx.currentTime + 0.0;
              duration = Math.max(audioCtx.currentTime, duration);
              track.start(duration);
              duration += track.buffer.duration;
              setSpeaking(true);
              track.onended = () => {
                if (audioCtx.currentTime >= duration) {
                  setSpeaking(false);
                }
              };
            }
            if (received.type === 'user') {
              // Reset audio duration for new sentences
              void audioCtx.close();
              duration = 0;
              setSpeaking(false);
              audioCtx = new AudioContext();
            }
          }
        };
        ws.current.onclose = () => {
          console.log({
            event: 'onclose',
          });
        };

        ws.current.onerror = (error: Event) => {
          setStatus('Error');
          console.log({
            event: 'onerror',
            error,
          });
        };
      });

    return () => {
      stopRecording();
    };
  }, [agentId, connect]);

  return {
    transcript,
    status,
    connect,
    speaking,
    setConnect,
    stopRecording,
  };
}

export function useTTS(
  languageId: LanguageId,
  speed: number,
  temperature: number
) {
  const ws = useRef<WebSocket>();
  const [connect, setConnect] = useState(false);
  const [status, setStatus] = useState<Status>('disconnected');
  const [speaking, setSpeaking] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext>();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  let duration = 0;

  const disconnectAgent = () => {
    if (ws.current) {
      ws.current.close();
    }
    setConnect(false);
    audioContext?.close();
  };

  const connectAgent = () => {
    setConnect(true);
    setStatus('connecting');
  };

  const sendText = (text: string) => {
    if (ws.current && ws.current.readyState == ws.current.OPEN) {
      ws.current.send(text);
    }
  };

  const stopSpeaking = () => {
    audioContext?.close();
    duration = 0;
    setSpeaking(false);
    let audioCtx = new AudioContext();
    setAudioContext(audioCtx);
    if (ws.current) {
      ws.current.close();
    }
  };

  useEffect(() => {
    if (!connect) {
      if (ws.current) {
        ws.current.close();
      }
      return;
    }

    ws.current = new WebSocket(
      `${neuphonicAPI}/speak/en?` +
        new URLSearchParams({
          api_key: API_KEY,
          speed: speed.toString(),
          temperature: temperature.toString(),
        })
    );

    ws.current.onopen = () => {
      setStatus('connected');
    };

    ws.current.onclose = () => {
      setStatus('disconnected');
      setConnect(false);
      console.log({
        event: 'onclose',
      });
    };

    ws.current.onerror = (error: Event) => {
      console.log({
        event: 'onerror',
        error,
      });
    };

    const audioCtx = new AudioContext();
    setAudioContext(audioCtx);

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect, speed, temperature]);

  useEffect(() => {
    if (!ws.current) {
      return;
    }
    if (!audioContext) {
      return;
    }

    ws.current!.onmessage = (message: MessageEvent<string>) => {
      const data = JSON.parse(message.data) as WebSocketResponse;
      if (data) {
        const byteArray = base64ToArrayBuffer(data.data.audio);

        var track = audioContext.createBufferSource();
        // var track = audioContext.createMediaElementSource(audio);
        track.buffer = createBuffer(
          byteArray,
          audioContext,
          data.data.sampling_rate ?? 44100
        );

        track.connect(audioContext.destination);
        if (duration == 0) duration = audioContext.currentTime + 0.0;
        duration = Math.max(audioContext.currentTime, duration);
        track.start(duration);
        duration += track.buffer.duration;
        setSpeaking(true);
        track.onended = () => {
          if (audioContext.currentTime >= duration) {
            setSpeaking(false);
          }
        };
        return;
      }
    };
  }, [ws.current, connect, audioContext, audio]);

  return {
    speaking,
    status,
    disconnectAgent,
    connectAgent,
    sendText,
    stopSpeaking,
  };
}
