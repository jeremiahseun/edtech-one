import { useEffect, useRef, useState, useCallback } from 'react';
import { GeminiLiveClient, GeminiLiveConfig } from '../lib/gemini/live-client';
import { GeminiBoardController, LiveControllerCallbacks } from '../lib/apex/live-controller';
import { APEXRenderer } from '../lib/apex/renderer';
import { floatTo16BitPCM, base64ArrayBuffer, downsampleBuffer } from '../lib/gemini/audio-utils';

export type LiveErrorType = 'connection' | 'microphone' | 'websocket' | null;

export interface LiveError {
    type: LiveErrorType;
    message: string;
}

export function useGeminiLive(
    config: GeminiLiveConfig,
    renderer: APEXRenderer | null,
    controllerCallbacks: LiveControllerCallbacks
) {
    const [isConnected, setIsConnected] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [error, setError] = useState<LiveError | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);

    const clientRef = useRef<GeminiLiveClient | null>(null);
    const controllerRef = useRef<GeminiBoardController | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const isMutedRef = useRef(false); // Ref for closure access in processor

    // Initialize Controller when renderer is available
    useEffect(() => {
        if (renderer && !controllerRef.current) {
            controllerRef.current = new GeminiBoardController(renderer, controllerCallbacks);
        } else if (controllerRef.current) {
            controllerRef.current.updateCallbacks(controllerCallbacks);
        }
    }, [renderer, controllerCallbacks]);

    const connect = useCallback(async () => {
        if (clientRef.current) return;

        setIsConnecting(true);
        setError(null);

        try {
            const client = new GeminiLiveClient(config);

            client.on('open', () => setIsConnected(true));

            client.on('close', () => {
                setIsConnected(false);
                stopRecording();
            });

            client.on('error', (err: any) => {
                console.error('[GeminiLive] Error:', err);
                setError({
                    type: 'websocket',
                    message: err?.message || 'WebSocket connection error'
                });
            });

            client.on('audio', async (data: { data: string, mimeType: string }) => {
                playAudioChunk(data.data);
            });

            client.on('tool', async (toolCall: any) => {
                if (controllerRef.current && toolCall.functionCalls) {
                    const responses = [];
                    for (const call of toolCall.functionCalls) {
                        const result = await controllerRef.current.handleToolCall({
                            name: call.name,
                            args: call.args
                        });
                        responses.push(result);
                    }
                    client.sendToolResponse(toolCall.functionCalls.map((c: any) => ({ functionCall: c })), responses);
                }
            });

            client.on('interrupted', () => {
                // TODO: Track active source nodes and stop them.
            });

            await client.connect();
            clientRef.current = client;
        } catch (err: any) {
            console.error('[GeminiLive] Connection failed:', err);
            setError({
                type: 'connection',
                message: err?.message || 'Failed to connect to Gemini Live API'
            });
        } finally {
            setIsConnecting(false);
        }
    }, [config]);

    const disconnect = useCallback(() => {
        if (clientRef.current) {
            clientRef.current.disconnect();
            clientRef.current = null;
        }
        stopRecording();
        setIsConnected(false);
    }, []);

    const startRecording = useCallback(async () => {
        if (!clientRef.current || isRecording) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            setError(null); // Clear any previous mic errors

            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            audioContextRef.current = audioContext;

            const source = audioContext.createMediaStreamSource(stream);
            inputSourceRef.current = source;

            // bufferSize: 4096 (approx 256ms at 16k), 2048 (128ms)
            // ScriptProcessor is deprecated but widely supported for simple cases. AudioWorklet is better practice.
            // Using 2048 buffer size
            const processor = audioContext.createScriptProcessor(2048, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
                // Check mute state via ref (closures capture stale state)
                if (isMutedRef.current) return;

                const inputData = e.inputBuffer.getChannelData(0);
                // Input is already 16kHz because we requested context at 16kHz
                // Convert Float32 to Int16 PCM
                const pcmBuffer = floatTo16BitPCM(inputData);
                const base64 = base64ArrayBuffer(pcmBuffer);

                if (clientRef.current) {
                    clientRef.current.sendAudioChunk(base64);
                }
            };

            source.connect(processor);
            processor.connect(audioContext.destination);

            setIsRecording(true);
        } catch (err: any) {
            console.error("Failed to start recording", err);

            // Detect permission denied specifically
            const isPermissionDenied = err?.name === 'NotAllowedError' ||
                err?.name === 'PermissionDeniedError' ||
                err?.message?.includes('Permission denied');

            setError({
                type: 'microphone',
                message: isPermissionDenied
                    ? 'Microphone access denied. Please allow microphone access in your browser settings.'
                    : 'Failed to access microphone. Please check your audio settings.'
            });
        }
    }, [isRecording]);

    const stopRecording = useCallback(() => {
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }
        if (inputSourceRef.current) {
            inputSourceRef.current.disconnect();
            inputSourceRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        setIsRecording(false);
    }, []);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            isMutedRef.current = !prev;
            return !prev;
        });
    }, []);

    // Helper: Play inbound audio
    const audioQueueRef = useRef<AudioContext | null>(null);

    const playAudioChunk = async (base64: string) => {
        if (!audioQueueRef.current) {
            audioQueueRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 }); // Gemini usually sends 24k
        }
        const ctx = audioQueueRef.current;

        // Base64 -> ArrayBuffer -> Int16 (assuming standard Gemini output, verify if it's Float32?)
        // Docs say input is 16k PCM. Output is usually 24k PCM.

        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // Convert Int16 bytes to Float32 for Web Audio API
        const int16Array = new Int16Array(bytes.buffer);
        const float32Array = new Float32Array(int16Array.length);
        for (let i = 0; i < int16Array.length; i++) {
            float32Array[i] = int16Array[i] / 32768.0;
        }

        const audioBuffer = ctx.createBuffer(1, float32Array.length, 24000);
        audioBuffer.copyToChannel(float32Array, 0);

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);

        // Schedule playback
        // simple queue logic
        const now = ctx.currentTime;
        // ensure we schedule slightly in future if queue ran out, or append if running
        const startTime = Math.max(now, nextStartTimeRef.current);
        source.start(startTime);

        nextStartTimeRef.current = startTime + audioBuffer.duration;
    };

    // Clear error function
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        isConnected,
        isConnecting,
        isRecording,
        isMuted,
        error,
        connect,
        disconnect,
        startRecording,
        stopRecording,
        toggleMute,
        clearError
    };
}
