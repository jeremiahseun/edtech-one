import { base64ArrayBuffer } from "./audio-utils";

const GEMINI_WS_URL = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent";

export type GeminiLiveConfig = {
    apiKey: string;
    model: string;
    systemInstruction?: string;
    tools?: any[];
    responseModalities?: ("audio" | "text")[];
};

type EventCallback = (data: any) => void;

export class GeminiLiveClient {
    private ws: WebSocket | null = null;
    private config: GeminiLiveConfig;
    private listeners: Record<string, EventCallback[]> = {};

    constructor(config: GeminiLiveConfig) {
        this.config = config;
    }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            const url = `${GEMINI_WS_URL}?key=${this.config.apiKey}`;
            this.ws = new WebSocket(url);

            this.ws.onopen = () => {
                console.log("[GeminiLive] Connected");
                this.sendSetup();
                this.emit('open', null);
                resolve();
            };

            this.ws.onmessage = (event) => {
                this.handleMessage(event.data);
            };

            this.ws.onclose = (event) => {
                console.log("[GeminiLive] Disconnected", event.code, event.reason);
                this.emit('close', event);
            };

            this.ws.onerror = (error) => {
                console.error("[GeminiLive] Error", error);
                this.emit('error', error);
                reject(error);
            };
        });
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    sendAudioChunk(base64Audio: string) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        const msg = {
            realtime_input: {
                media_chunks: [
                    {
                        mime_type: "audio/pcm;rate=16000",
                        data: base64Audio
                    }
                ]
            }
        };
        this.ws.send(JSON.stringify(msg));
    }

    sendToolResponse(toolCalls: any[], responses: any[]) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        const msg = {
            tool_response: {
                function_responses: responses.map((resp, i) => ({
                    name: toolCalls[i].functionCall.name,
                    id: toolCalls[i].functionCall.id || undefined, // Bidi API might not strictly use IDs yet, but good practice
                    response: { result: resp }
                }))
            }
        };
        this.ws.send(JSON.stringify(msg));
    }

    sendText(text: string) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        const msg = {
            client_content: {
                turns: [{
                    role: "user",
                    parts: [{ text }]
                }],
                turn_complete: true
            }
        };
        this.ws.send(JSON.stringify(msg));
    }

    on(event: string, callback: EventCallback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
        return () => this.off(event, callback);
    }

    off(event: string, callback: EventCallback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    private emit(event: string, data: any) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }

    private sendSetup() {
        if (!this.ws) return;

        const setupMsg = {
            setup: {
                model: this.config.model,
                generation_config: {
                    response_modalities: this.config.responseModalities || ["audio"],
                    speech_config: {
                        voice_config: { prebuilt_voice_config: { voice_name: "Puck" } }
                    }
                },
                system_instruction: this.config.systemInstruction ? {
                    parts: [{ text: this.config.systemInstruction }]
                } : undefined,
                tools: this.config.tools ? this.config.tools : undefined
            }
        };

        console.log("[GeminiLive] Sending setup:", setupMsg);
        this.ws.send(JSON.stringify(setupMsg));
    }

    private async handleMessage(data: any) {
        let msg;
        try {
            let textData: string;
            if (data instanceof Blob) {
                // WebSocket sends Blob in browser, need to read as text
                textData = await data.text();
            } else {
                textData = data as string;
            }
            msg = JSON.parse(textData);
        } catch (e) {
            console.error("[GeminiLive] Failed to parse message", e);
            return;
        }

        if (msg.serverContent) {
            const content = msg.serverContent;

            if (content.turnComplete) {
                this.emit('turn_complete', null);
            }

            if (content.interrupted) {
                this.emit('interrupted', null);
            }

            if (content.modelTurn) {
                for (const part of content.modelTurn.parts) {
                    if (part.text) {
                        this.emit('text', part.text);
                    }
                    if (part.inlineData) {
                        // Assuming audio/pcm;rate=24000 usually
                        this.emit('audio', {
                            data: part.inlineData.data,
                            mimeType: part.inlineData.mimeType
                        });
                    }
                    if (part.executableCode) {
                        // Not handling code execution for now
                    }
                }
            }
        }

        if (msg.toolCall) {
            this.emit('tool', msg.toolCall);
        }
    }
}
