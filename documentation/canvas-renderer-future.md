# Future: Custom Canvas-Based Equation Renderer

This document outlines how to build a custom canvas-based LaTeX/equation renderer for APEX, replacing KaTeX for maximum control and visual consistency.

---

## Why Custom Canvas Renderer?

| KaTeX (Current) | Custom Canvas (Future) |
|-----------------|------------------------|
| DOM-based, separate from whiteboard | Native canvas integration |
| Fixed styling | Full visual control |
| Limited animations | Smooth draw animations |
| Extra dependency | Zero runtime deps |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Equation Renderer                   │
├─────────────────────────────────────────────────────┤
│  Parser          │   Layout Engine   │   Painter    │
│  (LaTeX → AST)   │   (Box Model)     │   (Canvas)   │
└─────────────────────────────────────────────────────┘
```

### 1. Parser (LaTeX → AST)

Convert LaTeX strings to an Abstract Syntax Tree:

```typescript
interface MathNode {
  type: 'number' | 'symbol' | 'operator' | 'fraction' | 'sqrt' | 'matrix' | 'group';
  value?: string;
  children?: MathNode[];
  superscript?: MathNode;
  subscript?: MathNode;
}

// Example: "\frac{a}{b}" →
{
  type: 'fraction',
  children: [
    { type: 'symbol', value: 'a' },  // numerator
    { type: 'symbol', value: 'b' }   // denominator
  ]
}
```

**Recommended approach**: Use an existing LaTeX parser like `latex-parser` or `mathjs` and transform its output.

### 2. Layout Engine (Box Model)

Calculate positions using a TeX-inspired box model:

```typescript
interface Box {
  width: number;
  height: number;
  depth: number;  // below baseline
  x: number;
  y: number;
  children?: Box[];
  draw: (ctx: CanvasRenderingContext2D) => void;
}

function layoutFraction(num: Box, denom: Box): Box {
  const width = Math.max(num.width, denom.width) + 10;
  const height = num.height + denom.height + 8; // gap for fraction bar

  return {
    width,
    height,
    depth: denom.height + 4,
    x: 0,
    y: 0,
    children: [num, denom],
    draw(ctx) {
      // Draw fraction bar
      ctx.fillRect(this.x, this.y + num.height + 2, width, 2);
      // Position and draw children
      num.x = this.x + (width - num.width) / 2;
      num.y = this.y;
      denom.x = this.x + (width - denom.width) / 2;
      denom.y = this.y + num.height + 6;
    }
  };
}
```

### 3. Painter (Canvas Rendering)

Render boxes to canvas with animations:

```typescript
class EquationPainter {
  private ctx: CanvasRenderingContext2D;
  private currentT: number = 0;

  async drawAnimated(box: Box, duration: number): Promise<void> {
    const startTime = performance.now();

    return new Promise(resolve => {
      const animate = () => {
        const elapsed = performance.now() - startTime;
        this.currentT = Math.min(elapsed / duration, 1);

        this.ctx.clearRect(box.x, box.y, box.width, box.height);
        this.drawPartial(box, this.currentT);

        if (this.currentT < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      animate();
    });
  }

  private drawPartial(box: Box, t: number): void {
    // Reveal effect - draw strokes progressively
    this.ctx.save();
    this.ctx.globalAlpha = t;
    box.draw(this.ctx);
    this.ctx.restore();
  }
}
```

---

## Supported Elements (Priority Order)

### Phase 1 (MVP)
- Basic operators: `+ - × ÷ =`
- Fractions: `\frac{a}{b}`
- Superscripts/subscripts: `x^2`, `x_i`
- Greek letters: `\alpha`, `\beta`, etc.
- Square roots: `\sqrt{x}`

### Phase 2
- Matrices: `\begin{matrix}...\end{matrix}`
- Integrals: `\int_{a}^{b}`
- Summations: `\sum_{i=0}^{n}`
- Limits: `\lim_{x \to 0}`

### Phase 3
- Multi-line equations
- Alignment: `\begin{align}...\end{align}`
- Boxed/colored expressions

---

## Font Handling

For professional math rendering, use a math font:

```typescript
// Load STIX Two Math or Computer Modern
const mathFont = new FontFace('STIXTwoMath', 'url(/fonts/STIXTwoMath.woff2)');
await mathFont.load();
document.fonts.add(mathFont);

// In painter
ctx.font = '24px STIXTwoMath';
ctx.fillText('∫', x, y);  // Proper integral symbol
```

---

## Integration with APEX

```typescript
// In BoardAction handler
async renderEquation(element: BoardElement): Promise<void> {
  const ast = parseLatex(element.content.latex);
  const box = layoutAST(ast);

  // Position on Fabric.js canvas
  box.x = element.position.x;
  box.y = element.position.y;

  // Animated reveal matching instructor speech
  await this.painter.drawAnimated(box, 1500);
}
```

---

## Estimated Effort

| Phase | Time | Deliverable |
|-------|------|-------------|
| Parser | 1 week | LaTeX → AST for basic expressions |
| Layout | 2 weeks | Box model, fractions, scripts |
| Painter | 1 week | Canvas drawing + animations |
| Polish | 1 week | Font loading, edge cases |

**Total: ~5 weeks** for production-ready custom renderer.

---

## Recommendation

Use **KaTeX for MVP**, then migrate to custom canvas renderer when:
1. Visual consistency with whiteboard is critical
2. You need "handwriting" animation effects
3. Bundle size from KaTeX becomes a concern

The custom approach gives complete control but requires significant investment. Start with KaTeX, plan migration for v2.
