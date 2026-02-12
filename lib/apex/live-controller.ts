import { APEXRenderer } from "./renderer";
import { BoardAction } from "../aml/types";

export interface LiveControllerCallbacks {
    logInsight: (args: { type: string; topic: string; observation: string; confidence?: number }) => Promise<void>;
    searchContent: (query: string) => Promise<any>;
    showCheckpoint: (args: { prompt: string; options: string[]; correctAnswer: string }) => void;
}

export class GeminiBoardController {
    private renderer: APEXRenderer;
    private callbacks: LiveControllerCallbacks;

    constructor(renderer: APEXRenderer, callbacks: LiveControllerCallbacks) {
        this.renderer = renderer;
        this.callbacks = callbacks;
    }

    updateCallbacks(callbacks: LiveControllerCallbacks) {
        this.callbacks = callbacks;
    }

    async handleToolCall(toolCall: any): Promise<any> {
        console.log("[GeminiBoardController] Handling tool:", toolCall.name);

        try {
            switch (toolCall.name) {
                case 'updateBoard':
                    const boardAction = toolCall.args as BoardAction;
                    // Ensure 'zone' is at least defaulted if missing, though renderer handles it
                    this.renderer.executeBoardAction(boardAction);
                    return { status: 'success' };

                case 'triggerCheckpoint':
                    this.callbacks.showCheckpoint(toolCall.args);
                    return { status: 'pending_user_input' };

                case 'reportLearningInsight':
                    await this.callbacks.logInsight(toolCall.args);
                    return { status: 'logged' };

                case 'searchCourseMaterial':
                    const results = await this.callbacks.searchContent(toolCall.args.query);
                    return { results };

                default:
                    console.warn("Unknown tool call:", toolCall.name);
                    return { error: 'Unknown tool' };
            }
        } catch (error) {
            console.error("Error executing tool:", error);
            return { error: 'Execution failed', details: error };
        }
    }
}
