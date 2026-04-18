/**
 * Unit tests for geometry-dash-openhands game utility functions
 */

const { 
    getSpikeHitbox, 
    rectCollision, 
    generateLevelObjects,
    distance,
    clamp,
    lerp,
    pointInRect,
    circleRectCollision,
    getPlayerHitbox,
    getOrbHitbox,
    getBlockHitbox,
    getCoinHitbox,
    shouldActivateOrb,
    horizontalDistance
} = require('../game-utils.js');

// ========== getSpikeHitbox TESTS ==========

describe('getSpikeHitbox', () => {
    test('should return correct hitbox for medium spike (default)', () => {
        const obs = { x: 100, y: 200 };
        const hitbox = getSpikeHitbox(obs);
        
        expect(hitbox.x).toBe(100);
        expect(hitbox.y).toBe(200); // 200 + 30 - 30 = 200
        expect(hitbox.w).toBe(30);
        expect(hitbox.h).toBe(30);
    });

    test('should return correct hitbox for small spike', () => {
        const obs = { x: 50, y: 100, size: 'small' };
        const hitbox = getSpikeHitbox(obs);
        
        expect(hitbox.x).toBe(50);
        expect(hitbox.y).toBe(110); // 100 + 30 - 20 = 110
        expect(hitbox.w).toBe(20);
        expect(hitbox.h).toBe(20);
    });

    test('should return correct hitbox for large spike', () => {
        const obs = { x: 200, y: 300, size: 'large' };
        const hitbox = getSpikeHitbox(obs);
        
        expect(hitbox.x).toBe(200);
        expect(hitbox.y).toBe(290); // 300 + 30 - 40 = 290
        expect(hitbox.w).toBe(40);
        expect(hitbox.h).toBe(40);
    });

    test('should use medium size for unknown size', () => {
        const obs = { x: 0, y: 0, size: 'unknown' };
        const hitbox = getSpikeHitbox(obs);
        
        expect(hitbox.w).toBe(30);
        expect(hitbox.h).toBe(30);
    });

    test('should handle spike with no size property', () => {
        const obs = { x: 75, y: 150 };
        const hitbox = getSpikeHitbox(obs);
        
        expect(hitbox.w).toBe(30);
        expect(hitbox.h).toBe(30);
    });
});

// ========== rectCollision TESTS ==========

describe('rectCollision', () => {
    test('should return true when rectangles overlap', () => {
        const a = { x: 0, y: 0, w: 10, h: 10 };
        const b = { x: 5, y: 5, w: 10, h: 10 };
        
        expect(rectCollision(a, b)).toBe(true);
    });

    test('should return false when rectangles only touch edges (no overlap)', () => {
        const a = { x: 0, y: 0, w: 10, h: 10 };
        const b = { x: 10, y: 0, w: 10, h: 10 };
        
        // Rectangles that only touch at edge don't overlap with strict inequality
        expect(rectCollision(a, b)).toBe(false);
    });

    test('should return false when rectangles do not overlap (separated)', () => {
        const a = { x: 0, y: 0, w: 10, h: 10 };
        const b = { x: 20, y: 20, w: 10, h: 10 };
        
        expect(rectCollision(a, b)).toBe(false);
    });

    test('should return false when rectangles are separated horizontally', () => {
        const a = { x: 0, y: 0, w: 10, h: 10 };
        const b = { x: 15, y: 5, w: 10, h: 10 };
        
        expect(rectCollision(a, b)).toBe(false);
    });

    test('should return false when rectangles are separated vertically', () => {
        const a = { x: 0, y: 0, w: 10, h: 10 };
        const b = { x: 5, y: 15, w: 10, h: 10 };
        
        expect(rectCollision(a, b)).toBe(false);
    });

    test('should return true when one rectangle completely contains another', () => {
        const a = { x: 0, y: 0, w: 100, h: 100 };
        const b = { x: 25, y: 25, w: 50, h: 50 };
        
        expect(rectCollision(a, b)).toBe(true);
    });

    test('should return true for zero-width/height rectangles (point)', () => {
        const a = { x: 5, y: 5, w: 0, h: 0 };
        const b = { x: 0, y: 0, w: 10, h: 10 };
        
        // Point at (5,5) is within b
        expect(rectCollision(a, b)).toBe(true);
    });

    test('should handle negative coordinates', () => {
        const a = { x: -10, y: -10, w: 20, h: 20 };
        const b = { x: -5, y: -5, w: 10, h: 10 };
        
        expect(rectCollision(a, b)).toBe(true);
    });

    test('should return false when one rect starts exactly where another ends vertically', () => {
        const a = { x: 0, y: 0, w: 10, h: 10 };
        const b = { x: 0, y: 10, w: 10, h: 10 };
        
        // Rectangles that only touch at edge don't overlap with strict inequality
        expect(rectCollision(a, b)).toBe(false);
    });

    test('should return false when one rect starts exactly where another ends horizontally', () => {
        const a = { x: 0, y: 0, w: 10, h: 10 };
        const b = { x: 10, y: 0, w: 10, h: 10 };
        
        // Rectangles that only touch at edge don't overlap with strict inequality
        expect(rectCollision(a, b)).toBe(false);
    });
});

// ========== generateLevelObjects TESTS ==========

describe('generateLevelObjects', () => {
    test('should generate ground blocks for any pattern', () => {
        const objects = generateLevelObjects('easy1', '#ff6b6b', 500);
        
        // Should have 50 ground blocks
        const groundBlocks = objects.filter(obj => obj.type === 'block' && obj.y === 400);
        expect(groundBlocks.length).toBe(50);
    });

    test('should generate easy1 pattern with rhythm spikes', () => {
        const objects = generateLevelObjects('easy1', '#ff6b6b', 500);
        
        const spikes = objects.filter(obj => obj.type === 'spike');
        // i % 3 === 0 for i from 1-19: i = 3, 6, 9, 12, 15, 18 = 6 spikes
        expect(spikes.length).toBe(6);
    });

    test('should generate easy2 pattern with orbs', () => {
        const objects = generateLevelObjects('easy2', '#4ecdc4', 500);
        
        const orbs = objects.filter(obj => obj.type === 'orb');
        // i % 2 === 0 for i from 1-19: i = 2, 4, 6, 8, 10, 12, 14, 16, 18 = 9 orbs
        expect(orbs.length).toBe(9);
    });

    test('should generate medium1 pattern with spikes and orbs', () => {
        const objects = generateLevelObjects('medium1', '#a855f7', 500);
        
        const spikes = objects.filter(obj => obj.type === 'spike');
        // 24 spikes (one per iteration)
        expect(spikes.length).toBe(24);
        
        const orbs = objects.filter(obj => obj.type === 'orb');
        // i % 4 === 0 for i from 1-24: i = 4, 8, 12, 16, 20, 24 = 6 orbs
        expect(orbs.length).toBe(6);
    });

    test('should generate medium2 pattern with alternating block heights', () => {
        const objects = generateLevelObjects('medium2', '#f97316', 500);
        
        const blocks = objects.filter(obj => obj.type === 'block' && obj.y !== 400);
        // Only even iterations (12 times) create elevated blocks
        expect(blocks.length).toBe(12);
        
        const spikes = objects.filter(obj => obj.type === 'spike');
        expect(spikes.length).toBe(24);
    });

    test('should generate medium3 pattern with mixed obstacles', () => {
        const objects = generateLevelObjects('medium3', '#3b82f6', 500);
        
        const spikes = objects.filter(obj => obj.type === 'spike');
        expect(spikes.length).toBe(24);
        
        // Check for both large and small spikes
        const largeSpikes = spikes.filter(s => s.size === 'large');
        expect(largeSpikes.length).toBe(8); // i % 3 === 0 for i=1-24: 3,6,9,12,15,18,21,24 = 8
        
        const orbs = objects.filter(obj => obj.type === 'orb');
        // i % 5 === 0 for i=1-24: 5,10,15,20 = 4
        expect(orbs.length).toBe(4);
    });

    test('should generate hard1 pattern with triple spikes', () => {
        const objects = generateLevelObjects('hard1', '#ef4444', 500);
        
        const spikes = objects.filter(obj => obj.type === 'spike');
        // 2 spikes per iteration for 29 iterations = 58, plus platform blocks
        expect(spikes.length).toBe(58);
    });

    test('should generate hard2 pattern with orbs and spikes', () => {
        const objects = generateLevelObjects('hard2', '#14b8a6', 500);
        
        const orbs = objects.filter(obj => obj.type === 'orb');
        expect(orbs.length).toBe(29);
        
        const spikes = objects.filter(obj => obj.type === 'spike');
        // 2 spikes per iteration = 58
        expect(spikes.length).toBe(58);
    });

    test('should generate hard3 pattern with quick jumps', () => {
        const objects = generateLevelObjects('hard3', '#f59e0b', 500);
        
        const orbs = objects.filter(obj => obj.type === 'orb');
        expect(orbs.length).toBe(34);
        
        const spikes = objects.filter(obj => obj.type === 'spike');
        expect(spikes.length).toBe(34);
    });

    test('should generate harder1 pattern', () => {
        const objects = generateLevelObjects('harder1', '#ec4899', 500);
        
        const spikes = objects.filter(obj => obj.type === 'spike');
        // 39 iterations with 1-2 spikes each = ~58 spikes
        expect(spikes.length).toBeGreaterThan(50);
        
        const orbs = objects.filter(obj => obj.type === 'orb');
        // i % 4 === 0 for i=1-39: 4,8,12,16,20,24,28,32,36 = 9 orbs
        expect(orbs.length).toBe(9);
    });

    test('should generate hardest pattern with expert obstacles', () => {
        const objects = generateLevelObjects('hardest', '#dc2626', 500);
        
        const spikes = objects.filter(obj => obj.type === 'spike');
        // Complex pattern, should have many spikes
        expect(spikes.length).toBeGreaterThan(80);
    });

    test('should return empty array for unknown pattern', () => {
        const objects = generateLevelObjects('unknown_pattern', '#ffffff', 500);
        
        // Should still have 50 ground blocks
        const blocks = objects.filter(obj => obj.type === 'block');
        expect(blocks.length).toBe(50);
        
        // No additional objects
        expect(objects.length).toBe(50);
    });

    test('should use custom canvas height for baseY calculation', () => {
        const objects = generateLevelObjects('easy1', '#ff6b6b', 600);
        
        // baseY = 600 - 100 = 500
        const groundBlocks = objects.filter(obj => obj.type === 'block' && obj.y === 500);
        expect(groundBlocks.length).toBe(50);
    });
});

// ========== distance TESTS ==========

describe('distance', () => {
    test('should calculate distance between two points', () => {
        expect(distance(0, 0, 3, 4)).toBe(5);
    });

    test('should return 0 for same point', () => {
        expect(distance(5, 5, 5, 5)).toBe(0);
    });

    test('should handle negative coordinates', () => {
        expect(distance(-3, -4, 0, 0)).toBe(5);
    });

    test('should handle horizontal distance', () => {
        expect(distance(0, 0, 10, 0)).toBe(10);
    });

    test('should handle vertical distance', () => {
        expect(distance(0, 0, 0, 10)).toBe(10);
    });
});

// ========== clamp TESTS ==========

describe('clamp', () => {
    test('should return value when within range', () => {
        expect(clamp(5, 0, 10)).toBe(5);
    });

    test('should return min when value is below range', () => {
        expect(clamp(-5, 0, 10)).toBe(0);
    });

    test('should return max when value is above range', () => {
        expect(clamp(15, 0, 10)).toBe(10);
    });

    test('should handle equal min and max', () => {
        expect(clamp(5, 5, 5)).toBe(5);
    });

    test('should handle negative range', () => {
        expect(clamp(0, -10, -5)).toBe(-5);
        expect(clamp(-15, -10, -5)).toBe(-10);
    });
});

// ========== lerp TESTS ==========

describe('lerp', () => {
    test('should return start when t is 0', () => {
        expect(lerp(10, 20, 0)).toBe(10);
    });

    test('should return end when t is 1', () => {
        expect(lerp(10, 20, 1)).toBe(20);
    });

    test('should return midpoint when t is 0.5', () => {
        expect(lerp(10, 20, 0.5)).toBe(15);
    });

    test('should extrapolate when t is greater than 1', () => {
        expect(lerp(10, 20, 2)).toBe(30);
    });

    test('should extrapolate when t is negative', () => {
        expect(lerp(10, 20, -1)).toBe(0);
    });
});

// ========== pointInRect TESTS ==========

describe('pointInRect', () => {
    test('should return true when point is inside rect', () => {
        expect(pointInRect(5, 5, { x: 0, y: 0, w: 10, h: 10 })).toBe(true);
    });

    test('should return true when point is on edge', () => {
        expect(pointInRect(0, 0, { x: 0, y: 0, w: 10, h: 10 })).toBe(true);
        expect(pointInRect(10, 10, { x: 0, y: 0, w: 10, h: 10 })).toBe(true);
    });

    test('should return false when point is outside rect', () => {
        expect(pointInRect(15, 5, { x: 0, y: 0, w: 10, h: 10 })).toBe(false);
        expect(pointInRect(5, 15, { x: 0, y: 0, w: 10, h: 10 })).toBe(false);
    });

    test('should return false when point is outside (below)', () => {
        expect(pointInRect(5, -1, { x: 0, y: 0, w: 10, h: 10 })).toBe(false);
    });
});

// ========== circleRectCollision TESTS ==========

describe('circleRectCollision', () => {
    test('should return true when circle center is inside rect', () => {
        expect(circleRectCollision({ x: 5, y: 5, r: 2 }, { x: 0, y: 0, w: 10, h: 10 })).toBe(true);
    });

    test('should return true when circle overlaps corner', () => {
        expect(circleRectCollision({ x: 10, y: 10, r: 2 }, { x: 0, y: 0, w: 10, h: 10 })).toBe(true);
    });

    test('should return false when circle is far from rect', () => {
        expect(circleRectCollision({ x: 20, y: 20, r: 2 }, { x: 0, y: 0, w: 10, h: 10 })).toBe(false);
    });

    test('should return false when circle edge touches rect', () => {
        expect(circleRectCollision({ x: 12, y: 5, r: 2 }, { x: 0, y: 0, w: 10, h: 10 })).toBe(false);
    });
});

// ========== getPlayerHitbox TESTS ==========

describe('getPlayerHitbox', () => {
    test('should return hitbox with fixed size', () => {
        const player = { x: 100, y: 200 };
        const hitbox = getPlayerHitbox(player);
        
        expect(hitbox.x).toBe(100);
        expect(hitbox.y).toBe(200);
        expect(hitbox.w).toBe(40);
        expect(hitbox.h).toBe(40);
    });
});

// ========== getOrbHitbox TESTS ==========

describe('getOrbHitbox', () => {
    test('should return centered hitbox', () => {
        const orb = { x: 100, y: 200 };
        const hitbox = getOrbHitbox(orb);
        
        expect(hitbox.x).toBe(110);
        expect(hitbox.y).toBe(210);
        expect(hitbox.w).toBe(40);
        expect(hitbox.h).toBe(40);
    });
});

// ========== getBlockHitbox TESTS ==========

describe('getBlockHitbox', () => {
    test('should return same dimensions as block', () => {
        const block = { x: 100, y: 200, w: 50, h: 30, color: '#ff0000' };
        const hitbox = getBlockHitbox(block);
        
        expect(hitbox.x).toBe(100);
        expect(hitbox.y).toBe(200);
        expect(hitbox.w).toBe(50);
        expect(hitbox.h).toBe(30);
    });
});

// ========== getCoinHitbox TESTS ==========

describe('getCoinHitbox', () => {
    test('should use default size when not specified', () => {
        const coin = { x: 100, y: 200 };
        const hitbox = getCoinHitbox(coin);
        
        expect(hitbox.x).toBe(90);
        expect(hitbox.y).toBe(190);
        expect(hitbox.w).toBe(20);
        expect(hitbox.h).toBe(20);
    });

    test('should use custom size when specified', () => {
        const coin = { x: 100, y: 200, size: 30 };
        const hitbox = getCoinHitbox(coin);
        
        expect(hitbox.x).toBe(85);
        expect(hitbox.y).toBe(185);
        expect(hitbox.w).toBe(30);
        expect(hitbox.h).toBe(30);
    });
});

// ========== shouldActivateOrb TESTS ==========

describe('shouldActivateOrb', () => {
    test('should return true when player overlaps orb', () => {
        const player = { x: 100, y: 200 };
        const orb = { x: 105, y: 205 }; // Within collision distance
        
        expect(shouldActivateOrb(player, orb)).toBe(true);
    });

    test('should return false when player is far from orb', () => {
        const player = { x: 100, y: 200 };
        const orb = { x: 200, y: 200 };
        
        expect(shouldActivateOrb(player, orb)).toBe(false);
    });
});

// ========== horizontalDistance TESTS ==========

describe('horizontalDistance', () => {
    test('should calculate horizontal distance', () => {
        const a = { x: 100 };
        const b = { x: 150 };
        
        expect(horizontalDistance(a, b)).toBe(50);
    });

    test('should return 0 for same x position', () => {
        const a = { x: 100 };
        const b = { x: 100 };
        
        expect(horizontalDistance(a, b)).toBe(0);
    });

    test('should return absolute value', () => {
        const a = { x: 150 };
        const b = { x: 100 };
        
        expect(horizontalDistance(a, b)).toBe(50);
    });
});