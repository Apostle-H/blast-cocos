import { Vec2 } from 'cc'; 

export function numberInBounds(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
}

export function vec2InBounds(value: Vec2, min: Vec2, max: Vec2): boolean {
    return value.x >= min.x && value.y >= min.y && value.x <= max.x && value.y <= max.y;
}