/**
 * APEX Renderer Engine
 *
 * Fabric.js-based renderer that interprets AML actions and renders them to canvas.
 * Handles instructor avatar (abstract mode), whiteboard elements, equations, and animations.
 */

import { Canvas, Rect, Text, Circle, Line, Group, FabricObject, Path, Polygon } from 'fabric';
import katex from 'katex';
import type {
    AMLAction,
    AMLSequence,
    BoardAction,
    BoardElement,
    InstructorAction,
    AnimateAction,
    ElementAnimation,
    Position,
    StyleProperties,
} from '../aml/types';
import { parseTimestamp } from '../aml/types';

// ============================================================================
// Types
// ============================================================================

export interface RendererConfig {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    onCheckpoint?: (checkpoint: any) => void;
    onSequenceComplete?: () => void;
    onTimeUpdate?: (currentTime: number, duration: number) => void;
    onSpeechStart?: (text: string) => void;
    onSpeechEnd?: () => void;
}

export interface RendererState {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    isSpeaking: boolean;
}

// ============================================================================
// APEX Renderer Class
// ============================================================================

export class APEXRenderer {
    private fabricCanvas: Canvas;
    private config: RendererConfig;
    private state: RendererState;
    private currentSequence: AMLSequence | null = null;
    private startTime: number = 0;
    private rafId: number | null = null;
    private processedActions: Set<string> = new Set();
    private speechSynthesis: SpeechSynthesis | null = null;
    private currentUtterance: SpeechSynthesisUtterance | null = null;
    private elements: Map<string, FabricObject> = new Map();

    // Avatar state
    private avatarGroup: Group | null = null;
    private avatarIndicator: Circle | null = null;

    constructor(config: RendererConfig) {
        this.config = config;
        this.state = {
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            isSpeaking: false,
        };

        // Initialize Fabric.js canvas
        this.fabricCanvas = new Canvas(config.canvas, {
            width: config.width,
            height: config.height,
            backgroundColor: '#1a1c23',
            selection: false,
        });

        // Initialize speech synthesis
        if (typeof window !== 'undefined') {
            this.speechSynthesis = window.speechSynthesis;
        }

        this.setupBackground();
        this.setupAvatar();
    }

    // --------------------------------------------------------------------------
    // Setup
    // --------------------------------------------------------------------------

    private setupBackground(): void {
        // Dark themed background with subtle grid
        const gridSize = 40;
        for (let x = 0; x < this.config.width; x += gridSize) {
            const line = new Line([x, 0, x, this.config.height], {
                stroke: 'rgba(255,255,255,0.03)',
                selectable: false,
                evented: false,
            });
            this.fabricCanvas.add(line);
        }
        for (let y = 0; y < this.config.height; y += gridSize) {
            const line = new Line([0, y, this.config.width, y], {
                stroke: 'rgba(255,255,255,0.03)',
                selectable: false,
                evented: false,
            });
            this.fabricCanvas.add(line);
        }
    }

    private setupAvatar(): void {
        // Abstract avatar - a pulsing circle with voice indicator
        const avatarRadius = 40;
        const avatarX = this.config.width - 80;
        const avatarY = this.config.height - 80;

        // Outer glow
        const outerGlow = new Circle({
            radius: avatarRadius + 10,
            fill: 'rgba(19, 91, 236, 0.2)',
            left: avatarX,
            top: avatarY,
            originX: 'center',
            originY: 'center',
            selectable: false,
        });

        // Main avatar circle
        const mainCircle = new Circle({
            radius: avatarRadius,
            fill: '#135bec',
            left: avatarX,
            top: avatarY,
            originX: 'center',
            originY: 'center',
            selectable: false,
        });

        // Voice indicator (animated when speaking)
        this.avatarIndicator = new Circle({
            radius: 5,
            fill: '#ffffff',
            left: avatarX,
            top: avatarY,
            originX: 'center',
            originY: 'center',
            selectable: false,
        });

        this.avatarGroup = new Group([outerGlow, mainCircle, this.avatarIndicator], {
            left: avatarX,
            top: avatarY,
            selectable: false,
        });

        this.fabricCanvas.add(this.avatarGroup);
    }

    // --------------------------------------------------------------------------
    // Playback Control
    // --------------------------------------------------------------------------

    async playSequence(sequence: AMLSequence): Promise<void> {
        this.currentSequence = sequence;
        this.processedActions.clear();
        this.state.duration = sequence.duration || this.calculateDuration(sequence);
        this.state.currentTime = 0;
        this.state.isPlaying = true;
        this.startTime = performance.now();

        this.renderLoop();
    }

    pause(): void {
        this.state.isPlaying = false;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        if (this.speechSynthesis && this.currentUtterance) {
            this.speechSynthesis.pause();
        }
    }

    resume(): void {
        if (!this.currentSequence) return;

        this.state.isPlaying = true;
        this.startTime = performance.now() - (this.state.currentTime * 1000);

        if (this.speechSynthesis) {
            this.speechSynthesis.resume();
        }

        this.renderLoop();
    }

    seek(time: number): void {
        this.state.currentTime = Math.max(0, Math.min(time, this.state.duration));
        this.startTime = performance.now() - (this.state.currentTime * 1000);

        // Re-render at new position
        if (this.currentSequence) {
            this.renderAtTime(this.state.currentTime);
        }
    }

    stop(): void {
        this.pause();
        this.state.currentTime = 0;
        this.stopSpeech();
        this.clearWhiteboard();
    }

    getState(): RendererState {
        return { ...this.state };
    }

    // --------------------------------------------------------------------------
    // Render Loop
    // --------------------------------------------------------------------------

    private renderLoop(): void {
        if (!this.state.isPlaying || !this.currentSequence) return;

        const elapsed = (performance.now() - this.startTime) / 1000;
        this.state.currentTime = elapsed;

        // Notify time update
        this.config.onTimeUpdate?.(this.state.currentTime, this.state.duration);

        // Process actions at current time
        for (const action of this.currentSequence.actions) {
            const actionTime = parseTimestamp(action.at);
            const actionKey = `${action.type}-${action.at}`;

            if (actionTime <= elapsed && !this.processedActions.has(actionKey)) {
                this.processedActions.add(actionKey);
                this.processAction(action);
            }
        }

        // Check for checkpoint
        if (this.currentSequence.checkpoint) {
            const checkpointTime = this.state.duration - 2; // 2 seconds before end
            if (elapsed >= checkpointTime && !this.processedActions.has('checkpoint')) {
                this.processedActions.add('checkpoint');
                this.pause();
                this.config.onCheckpoint?.(this.currentSequence.checkpoint);
                return;
            }
        }

        // Check for sequence completion
        if (elapsed >= this.state.duration) {
            this.state.isPlaying = false;
            this.config.onSequenceComplete?.();
            return;
        }

        // Animate avatar
        this.animateAvatar();

        this.rafId = requestAnimationFrame(() => this.renderLoop());
    }

    private renderAtTime(time: number): void {
        // Clear and rebuild state at specific time
        this.clearWhiteboard();
        this.processedActions.clear();

        if (!this.currentSequence) return;

        for (const action of this.currentSequence.actions) {
            const actionTime = parseTimestamp(action.at);
            const actionKey = `${action.type}-${action.at}`;

            if (actionTime <= time) {
                this.processedActions.add(actionKey);
                // Skip speech for seeking
                if (action.type !== 'instructor') {
                    this.processAction(action);
                } else {
                    // Just render board elements, skip speech
                    this.processAction({ ...action, content: { ...(action.content as InstructorAction), speak: '' } });
                }
            }
        }
    }

    // --------------------------------------------------------------------------
    // Live Control (Public API)
    // --------------------------------------------------------------------------

    public executeBoardAction(action: BoardAction): void {
        this.processBoardAction(action);
        this.fabricCanvas.renderAll();
    }

    public clearBoard(): void {
        this.clearWhiteboard();
        this.fabricCanvas.renderAll();
    }

    // --------------------------------------------------------------------------
    // Action Processing
    // --------------------------------------------------------------------------

    private processAction(action: AMLAction): void {
        switch (action.type) {
            case 'instructor':
                this.processInstructorAction(action.content as InstructorAction);
                break;
            case 'board':
                this.processBoardAction(action.content as BoardAction);
                break;
            case 'animate':
                this.processAnimateAction(action.content as AnimateAction);
                break;
            case 'audio':
                // Audio actions (SFX) - not implemented in MVP
                break;
        }

        this.fabricCanvas.renderAll();
    }

    private processInstructorAction(action: InstructorAction): void {
        // Update avatar emotion/state
        if (this.avatarGroup && action.emotion) {
            const emotionColors: Record<string, string> = {
                neutral: '#135bec',
                friendly: '#10b981',
                excited: '#f59e0b',
                thoughtful: '#8b5cf6',
                encouraging: '#ec4899',
            };

            // Update color based on emotion
            const mainCircle = this.avatarGroup.getObjects()[1] as Circle;
            if (mainCircle) {
                mainCircle.set('fill', emotionColors[action.emotion] || '#135bec');
            }
        }

        // Speak text using Web Speech API
        if (action.speak) {
            this.speakText(action.speak);
        }

        // Handle gesture (visual feedback)
        if (action.gesture) {
            this.playGesture(action.gesture);
        }

        // Highlight element if specified
        if (action.highlightElement) {
            this.highlightElement(action.highlightElement);
        }
    }

    private processBoardAction(action: BoardAction): void {
        if (action.clear) {
            this.clearWhiteboard();
        }

        for (const element of action.elements) {
            this.addBoardElement(element, action.zone);
        }
    }

    private processAnimateAction(action: AnimateAction): void {
        if (action.target === 'all') {
            this.elements.forEach((obj) => {
                this.animateObject(obj, action.animation);
            });
        } else {
            const obj = this.elements.get(action.target);
            if (obj) {
                this.animateObject(obj, action.animation);
            }
        }
    }

    // --------------------------------------------------------------------------
    // Board Element Rendering
    // --------------------------------------------------------------------------

    private addBoardElement(element: BoardElement, zone?: string): void {
        // Calculate position based on zone
        const position = this.calculatePosition(element.position, zone);
        let fabricObject: FabricObject | null = null;

        switch (element.type) {
            case 'text':
                fabricObject = this.createTextElement(element, position);
                break;
            case 'equation':
                fabricObject = this.createEquationElement(element, position);
                break;
            case 'shape':
                fabricObject = this.createShapeElement(element, position);
                break;
            case 'diagram':
                fabricObject = this.createDiagramElement(element, position);
                break;
            case 'code':
                fabricObject = this.createCodeElement(element, position);
                break;
        }

        if (fabricObject) {
            fabricObject.set({ selectable: false, evented: false });
            this.elements.set(element.id, fabricObject);
            this.fabricCanvas.add(fabricObject);

            // Apply entrance animation
            if (element.animation) {
                this.applyEntranceAnimation(fabricObject, element.animation);
            }
        }
    }

    private calculatePosition(pos: Position, zone?: string): Position {
        const zoneOffsets: Record<string, number> = {
            left: 0,
            center: this.config.width / 3,
            right: (this.config.width * 2) / 3,
            full: 0,
        };

        const xOffset = zoneOffsets[zone || 'center'] || 0;

        return {
            ...pos,
            x: pos.x + xOffset,
        };
    }

    private createTextElement(element: BoardElement, position: Position): FabricObject {
        const content = element.content as { text: string; lines?: string[] };
        const style = element.style || {};

        const text = new Text(content.text || content.lines?.join('\n') || '', {
            left: position.x,
            top: position.y,
            fill: style.fill || '#ffffff',
            fontSize: style.fontSize || 18,
            fontFamily: style.fontFamily || 'Inter, system-ui, sans-serif',
            fontWeight: style.fontWeight || 'normal',
            textAlign: style.textAlign || 'left',
        });

        return text;
    }

    private createEquationElement(element: BoardElement, position: Position): FabricObject {
        const content = element.content as { latex: string };

        // Render LaTeX using KaTeX
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.visibility = 'hidden';
        document.body.appendChild(tempDiv);

        try {
            katex.render(content.latex, tempDiv, {
                throwOnError: false,
                displayMode: true,
            });

            // Convert KaTeX output to Fabric text (simplified approach)
            // For MVP, we display the rendered text content
            const renderedText = tempDiv.innerText;

            const text = new Text(renderedText || content.latex, {
                left: position.x,
                top: position.y,
                fill: element.style?.fill || '#ffffff',
                fontSize: element.style?.fontSize || 24,
                fontFamily: 'KaTeX_Main, Times New Roman, serif',
            });

            return text;
        } finally {
            document.body.removeChild(tempDiv);
        }
    }

    private createShapeElement(element: BoardElement, position: Position): FabricObject {
        const content = element.content as { shape: string; points?: Array<{ x: number; y: number }> };
        const style = element.style || {};

        switch (content.shape) {
            case 'rectangle':
                return new Rect({
                    left: position.x,
                    top: position.y,
                    width: position.width || 100,
                    height: position.height || 50,
                    fill: style.fill || 'transparent',
                    stroke: style.stroke || '#135bec',
                    strokeWidth: style.strokeWidth || 2,
                });

            case 'circle':
                return new Circle({
                    left: position.x,
                    top: position.y,
                    radius: (position.width || 50) / 2,
                    fill: style.fill || 'transparent',
                    stroke: style.stroke || '#135bec',
                    strokeWidth: style.strokeWidth || 2,
                });

            case 'line':
                return new Line([
                    position.x, position.y,
                    position.x + (position.width || 100), position.y + (position.height || 0)
                ], {
                    stroke: style.stroke || '#135bec',
                    strokeWidth: style.strokeWidth || 2,
                });

            case 'arrow':
                return this.createArrow(position, style);

            case 'polygon':
                if (content.points) {
                    return new Polygon(content.points, {
                        left: position.x,
                        top: position.y,
                        fill: style.fill || 'transparent',
                        stroke: style.stroke || '#135bec',
                        strokeWidth: style.strokeWidth || 2,
                    });
                }
                return new Rect({ left: position.x, top: position.y, width: 50, height: 50 });

            default:
                return new Rect({
                    left: position.x,
                    top: position.y,
                    width: 50,
                    height: 50,
                    fill: 'transparent',
                    stroke: '#135bec',
                });
        }
    }

    private createArrow(position: Position, style: StyleProperties): FabricObject {
        const endX = position.x + (position.width || 100);
        const endY = position.y + (position.height || 0);

        // Arrow line
        const line = new Line([position.x, position.y, endX, endY], {
            stroke: style.stroke || '#135bec',
            strokeWidth: style.strokeWidth || 2,
        });

        // Arrow head
        const angle = Math.atan2(endY - position.y, endX - position.x);
        const headLength = 15;

        const headPath = `M ${endX} ${endY} L ${endX - headLength * Math.cos(angle - Math.PI / 6)} ${endY - headLength * Math.sin(angle - Math.PI / 6)} M ${endX} ${endY} L ${endX - headLength * Math.cos(angle + Math.PI / 6)} ${endY - headLength * Math.sin(angle + Math.PI / 6)}`;

        const head = new Path(headPath, {
            stroke: style.stroke || '#135bec',
            strokeWidth: style.strokeWidth || 2,
            fill: 'transparent',
        });

        return new Group([line, head]);
    }

    private createDiagramElement(element: BoardElement, position: Position): FabricObject {
        const content = element.content as {
            diagramType: string;
            nodes: Array<{ id: string; label: string; position: Position; style?: StyleProperties }>;
            edges: Array<{ from: string; to: string; label?: string; style?: StyleProperties }>;
        };

        const objects: FabricObject[] = [];

        // Create nodes
        const nodePositions = new Map<string, Position>();
        for (const node of content.nodes) {
            const nodePos = {
                x: position.x + node.position.x,
                y: position.y + node.position.y,
            };
            nodePositions.set(node.id, nodePos);

            // Node circle
            const circle = new Circle({
                left: nodePos.x,
                top: nodePos.y,
                radius: 30,
                fill: node.style?.fill || 'rgba(19, 91, 236, 0.2)',
                stroke: node.style?.stroke || '#135bec',
                strokeWidth: 2,
                originX: 'center',
                originY: 'center',
            });
            objects.push(circle);

            // Node label
            const label = new Text(node.label, {
                left: nodePos.x,
                top: nodePos.y,
                fontSize: 14,
                fill: '#ffffff',
                originX: 'center',
                originY: 'center',
            });
            objects.push(label);
        }

        // Create edges
        for (const edge of content.edges) {
            const fromPos = nodePositions.get(edge.from);
            const toPos = nodePositions.get(edge.to);
            if (fromPos && toPos) {
                const line = new Line([fromPos.x, fromPos.y, toPos.x, toPos.y], {
                    stroke: edge.style?.stroke || 'rgba(255,255,255,0.3)',
                    strokeWidth: edge.style?.strokeWidth || 1,
                });
                objects.unshift(line); // Add behind nodes
            }
        }

        return new Group(objects);
    }

    private createCodeElement(element: BoardElement, position: Position): FabricObject {
        const content = element.content as { code: string; language: string; highlightLines?: number[] };

        // Simple code block rendering
        const lines = content.code.split('\n');
        const lineHeight = 20;

        const objects: FabricObject[] = [];

        // Background
        const bg = new Rect({
            left: position.x - 10,
            top: position.y - 10,
            width: (position.width || 400) + 20,
            height: lines.length * lineHeight + 20,
            fill: 'rgba(0,0,0,0.5)',
            rx: 8,
            ry: 8,
        });
        objects.push(bg);

        // Code lines
        lines.forEach((line, i) => {
            const isHighlighted = content.highlightLines?.includes(i + 1);

            if (isHighlighted) {
                const highlight = new Rect({
                    left: position.x - 5,
                    top: position.y + i * lineHeight - 2,
                    width: (position.width || 400) + 10,
                    height: lineHeight + 4,
                    fill: 'rgba(19, 91, 236, 0.2)',
                });
                objects.push(highlight);
            }

            const text = new Text(line, {
                left: position.x,
                top: position.y + i * lineHeight,
                fill: isHighlighted ? '#fbbf24' : '#e5e5e5',
                fontSize: 14,
                fontFamily: 'JetBrains Mono, Menlo, Monaco, monospace',
            });
            objects.push(text);
        });

        return new Group(objects);
    }

    // --------------------------------------------------------------------------
    // Animations
    // --------------------------------------------------------------------------

    private applyEntranceAnimation(obj: FabricObject, animation: ElementAnimation): void {
        const duration = animation.duration || 500;
        const originalOpacity = obj.opacity || 1;
        const originalLeft = obj.left || 0;
        const originalTop = obj.top || 0;

        switch (animation.type) {
            case 'fadeIn':
                obj.set('opacity', 0);
                this.animateProperty(obj, 'opacity', 0, originalOpacity, duration);
                break;

            case 'slideIn':
                const slideOffset = 50;
                const direction = animation.direction || 'left';
                const startX = direction === 'right' ? originalLeft + slideOffset : originalLeft - slideOffset;
                const startY = direction === 'bottom' ? originalTop + slideOffset : originalTop - slideOffset;

                obj.set({ opacity: 0, left: startX, top: startY });
                this.animateProperty(obj, 'opacity', 0, originalOpacity, duration);
                this.animateProperty(obj, 'left', startX, originalLeft, duration);
                this.animateProperty(obj, 'top', startY, originalTop, duration);
                break;

            case 'pop':
                obj.set({ scaleX: 0, scaleY: 0, opacity: 0 });
                this.animateProperty(obj, 'scaleX', 0, 1, duration);
                this.animateProperty(obj, 'scaleY', 0, 1, duration);
                this.animateProperty(obj, 'opacity', 0, originalOpacity, duration);
                break;

            case 'typewriter':
                // For text elements, reveal character by character
                if (obj instanceof Text) {
                    const fullText = obj.text || '';
                    obj.set('text', '');
                    this.typewriterEffect(obj, fullText, duration);
                }
                break;

            case 'draw':
                // For shapes, animate stroke
                obj.set('opacity', 0);
                this.animateProperty(obj, 'opacity', 0, originalOpacity, duration);
                break;
        }
    }

    private animateProperty(
        obj: FabricObject,
        property: string,
        from: number,
        to: number,
        duration: number
    ): void {
        const startTime = performance.now();

        const animate = () => {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = this.easeOutCubic(progress);
            const value = from + (to - from) * eased;

            obj.set(property as keyof FabricObject, value);
            this.fabricCanvas.renderAll();

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    private typewriterEffect(textObj: Text, fullText: string, duration: number): void {
        const charDelay = duration / fullText.length;
        let currentIndex = 0;

        const type = () => {
            if (currentIndex < fullText.length) {
                textObj.set('text', fullText.slice(0, currentIndex + 1));
                this.fabricCanvas.renderAll();
                currentIndex++;
                setTimeout(type, charDelay);
            }
        };

        type();
    }

    private animateObject(obj: FabricObject, animation: any): void {
        const duration = animation.duration || 500;

        switch (animation.type) {
            case 'highlight':
                // Pulse effect
                const originalOpacity = obj.opacity || 1;
                this.animateProperty(obj, 'opacity', originalOpacity, 0.5, duration / 2);
                setTimeout(() => {
                    this.animateProperty(obj, 'opacity', 0.5, originalOpacity, duration / 2);
                }, duration / 2);
                break;

            case 'shake':
                const originalLeft = obj.left || 0;
                const shakeAmount = 5;
                let shakeCount = 0;

                const shake = () => {
                    if (shakeCount < 6) {
                        const offset = shakeCount % 2 === 0 ? shakeAmount : -shakeAmount;
                        obj.set('left', originalLeft + offset);
                        this.fabricCanvas.renderAll();
                        shakeCount++;
                        setTimeout(shake, 50);
                    } else {
                        obj.set('left', originalLeft);
                        this.fabricCanvas.renderAll();
                    }
                };
                shake();
                break;

            case 'move':
                if (animation.to) {
                    if (animation.to.x !== undefined) {
                        this.animateProperty(obj, 'left', obj.left || 0, animation.to.x, duration);
                    }
                    if (animation.to.y !== undefined) {
                        this.animateProperty(obj, 'top', obj.top || 0, animation.to.y, duration);
                    }
                }
                break;
        }
    }

    private easeOutCubic(t: number): number {
        return 1 - Math.pow(1 - t, 3);
    }

    // --------------------------------------------------------------------------
    // Speech
    // --------------------------------------------------------------------------

    private speakText(text: string): void {
        if (!this.speechSynthesis) return;

        this.stopSpeech();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;

        utterance.onstart = () => {
            this.state.isSpeaking = true;
            this.config.onSpeechStart?.(text);
        };

        utterance.onend = () => {
            this.state.isSpeaking = false;
            this.config.onSpeechEnd?.();
        };

        this.currentUtterance = utterance;
        this.speechSynthesis.speak(utterance);
    }

    private stopSpeech(): void {
        if (this.speechSynthesis) {
            this.speechSynthesis.cancel();
        }
        this.state.isSpeaking = false;
    }

    // --------------------------------------------------------------------------
    // Avatar Animation
    // --------------------------------------------------------------------------

    private animateAvatar(): void {
        if (!this.avatarIndicator || !this.avatarGroup) return;

        // Pulse when speaking
        if (this.state.isSpeaking) {
            const time = performance.now() / 200;
            const scale = 1 + 0.3 * Math.sin(time);
            this.avatarIndicator.set({ scaleX: scale, scaleY: scale });
        } else {
            this.avatarIndicator.set({ scaleX: 1, scaleY: 1 });
        }

        this.fabricCanvas.renderAll();
    }

    private playGesture(gesture: string): void {
        // Visual feedback for gestures
        if (!this.avatarGroup) return;

        switch (gesture) {
            case 'wave':
            case 'nod':
                // Quick bounce animation
                const originalTop = this.avatarGroup.top || 0;
                this.animateProperty(this.avatarGroup, 'top', originalTop, originalTop - 10, 150);
                setTimeout(() => {
                    this.animateProperty(this.avatarGroup!, 'top', originalTop - 10, originalTop, 150);
                }, 150);
                break;

            case 'thinking':
                // Slow pulse
                this.animateProperty(this.avatarGroup, 'scaleX', 1, 1.1, 500);
                this.animateProperty(this.avatarGroup, 'scaleY', 1, 1.1, 500);
                setTimeout(() => {
                    this.animateProperty(this.avatarGroup!, 'scaleX', 1.1, 1, 500);
                    this.animateProperty(this.avatarGroup!, 'scaleY', 1.1, 1, 500);
                }, 500);
                break;
        }
    }

    private highlightElement(elementId: string): void {
        const element = this.elements.get(elementId);
        if (element) {
            this.animateObject(element, { type: 'highlight', duration: 1000 });
        }
    }

    // --------------------------------------------------------------------------
    // Utilities
    // --------------------------------------------------------------------------

    private clearWhiteboard(): void {
        // Remove all elements except avatar and background
        this.elements.forEach((obj) => {
            this.fabricCanvas.remove(obj);
        });
        this.elements.clear();
    }

    private calculateDuration(sequence: AMLSequence): number {
        let maxTime = 0;
        for (const action of sequence.actions) {
            const time = parseTimestamp(action.at);
            if (action.type === 'instructor') {
                const instructor = action.content as InstructorAction;
                const wordCount = instructor.speak.split(/\s+/).length;
                const speechDuration = (wordCount / 150) * 60; // ~150 words per minute
                maxTime = Math.max(maxTime, time + speechDuration);
            } else {
                maxTime = Math.max(maxTime, time + 2); // Default 2 second action
            }
        }
        return maxTime + 5; // Add buffer at end
    }

    // --------------------------------------------------------------------------
    // Cleanup
    // --------------------------------------------------------------------------

    destroy(): void {
        this.stop();
        this.fabricCanvas.dispose();
    }
}
