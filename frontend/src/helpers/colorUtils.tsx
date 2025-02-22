export function intColorToRGBA(color: number): string {
    // Handle alpha channel
    const alpha = ((color >> 24) & 0xff) / 255;

    // Extract RGB components
    const red = (color >> 16) & 0xff;
    const green = (color >> 8) & 0xff;
    const blue = color & 0xff;

    // If alpha is 1 (or not present), return RGB
    if (alpha === 1 || isNaN(alpha)) {
        return `rgb(${red}, ${green}, ${blue})`;
    }

    // Return RGBA if there's transparency
    return `rgba(${red}, ${green}, ${blue}, ${Math.abs(alpha)})`;
}

// Convert negative integers (two's complement) to positive
export function normalizeColor(color: number): number {
    if (color < 0) {
        color = 0xFFFFFFFF + color + 1;
    }
    return color;
}

export function intColorToHex(color: number): string {
    color = normalizeColor(color);
    return `#${color.toString(16).padStart(6, '0')}`;
}
