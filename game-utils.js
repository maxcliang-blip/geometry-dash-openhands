/**
 * Game utility functions for geometry-dash-openhands
 * These are pure functions extracted from the main game for testability
 */

/**
 * Calculate spike hitbox based on spike size
 * @param {Object} obs - Spike obstacle object
 * @param {string} obs.size - Size of spike: 'small', 'medium', or 'large'
 * @param {number} obs.x - X position of spike
 * @param {number} obs.y - Y position of spike
 * @returns {Object} Hitbox with x, y, w, h properties
 */
function getSpikeHitbox(obs) {
    const sizes = { small: 20, medium: 30, large: 40 };
    const size = sizes[obs.size] || 30;
    return { x: obs.x, y: obs.y + 30 - size, w: size, h: size };
}

/**
 * Check if two rectangles collide (AABB collision)
 * @param {Object} a - First rectangle {x, y, w, h}
 * @param {Object} b - Second rectangle {x, y, w, h}
 * @returns {boolean} True if rectangles overlap
 */
function rectCollision(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

/**
 * Generate level objects based on pattern
 * @param {string} pattern - Level pattern name
 * @param {string} color - Block color
 * @param {number} canvasHeight - Canvas height for base Y calculation
 * @returns {Array} Array of game objects
 */
function generateLevelObjects(pattern, color, canvasHeight = 500) {
    const objects = [];
    const baseY = canvasHeight - 100;

    // Ground blocks
    for (let i = 0; i < 50; i++) {
        objects.push({ type: 'block', x: i * 200, y: baseY, w: 200, h: 60, color: color });
    }

    switch(pattern) {
        case 'easy1':
            // Simple rhythm pattern
            for (let i = 1; i < 20; i++) {
                if (i % 3 === 0) {
                    objects.push({ type: 'spike', x: i * 400 + 200, y: baseY - 30, dir: 'up', size: 'medium' });
                }
            }
            break;
        case 'easy2':
            // Basic jumps
            for (let i = 1; i < 20; i++) {
                if (i % 2 === 0) {
                    objects.push({ type: 'orb', x: i * 350 + 100, y: baseY - 100 });
                }
            }
            break;
        case 'medium1':
            // Spike patterns
            for (let i = 1; i < 25; i++) {
                objects.push({ type: 'spike', x: i * 300 + 150, y: baseY - 30, dir: 'up', size: 'medium' });
                if (i % 4 === 0) {
                    objects.push({ type: 'orb', x: i * 300 + 50, y: baseY - 100 });
                }
            }
            break;
        case 'medium2':
            // Block platforms with spikes
            for (let i = 1; i < 25; i++) {
                objects.push({ type: 'block', x: i * 350, y: i % 2 === 0 ? baseY - 80 : baseY, w: 100, h: 30 });
                objects.push({ type: 'spike', x: i * 350 + 200, y: baseY - 30, dir: 'up', size: 'small' });
            }
            break;
        case 'medium3':
            // Mixed obstacles
            for (let i = 1; i < 25; i++) {
                if (i % 3 === 0) {
                    objects.push({ type: 'spike', x: i * 320, y: baseY - 30, dir: 'up', size: 'large' });
                } else {
                    objects.push({ type: 'spike', x: i * 320, y: baseY - 30, dir: 'up', size: 'small' });
                }
                if (i % 5 === 0) {
                    objects.push({ type: 'orb', x: i * 320 + 80, y: baseY - 120 });
                }
            }
            break;
        case 'hard1':
            // Triple spikes
            for (let i = 1; i < 30; i++) {
                objects.push({ type: 'spike', x: i * 250, y: baseY - 30, dir: 'up', size: 'medium' });
                objects.push({ type: 'spike', x: i * 250 + 25, y: baseY - 30, dir: 'up', size: 'medium' });
                if (i % 3 === 0) {
                    objects.push({ type: 'block', x: i * 250 - 50, y: baseY - 80, w: 80, h: 20 });
                }
            }
            break;
        case 'hard2':
            // Orbs with precision
            for (let i = 1; i < 30; i++) {
                objects.push({ type: 'orb', x: i * 280, y: baseY - 100 });
                objects.push({ type: 'spike', x: i * 280 + 140, y: baseY - 30, dir: 'up', size: 'small' });
                objects.push({ type: 'spike', x: i * 280 + 165, y: baseY - 30, dir: 'up', size: 'small' });
            }
            break;
        case 'hard3':
            // Finger dash style - quick jumps
            for (let i = 1; i < 35; i++) {
                objects.push({ type: 'orb', x: i * 200, y: baseY - 80 });
                if (i % 2 === 0) {
                    objects.push({ type: 'block', x: i * 200 + 50, y: baseY - 50, w: 60, h: 15 });
                }
                objects.push({ type: 'spike', x: i * 200 + 100, y: baseY - 30, dir: 'up', size: 'small' });
            }
            break;
        case 'harder1':
            // Intense
            for (let i = 1; i < 40; i++) {
                objects.push({ type: 'spike', x: i * 180, y: baseY - 30, dir: 'up', size: 'medium' });
                if (i % 2 === 0) {
                    objects.push({ type: 'spike', x: i * 180 + 20, y: baseY - 30, dir: 'up', size: 'small' });
                }
                if (i % 4 === 0) {
                    objects.push({ type: 'orb', x: i * 180 + 90, y: baseY - 100 });
                }
            }
            break;
        case 'hardest':
            // Expert
            for (let i = 1; i < 50; i++) {
                if (i % 3 === 0) {
                    objects.push({ type: 'spike', x: i * 150, y: baseY - 30, dir: 'up', size: 'large' });
                } else if (i % 3 === 1) {
                    objects.push({ type: 'spike', x: i * 150, y: baseY - 30, dir: 'up', size: 'medium' });
                    objects.push({ type: 'spike', x: i * 150 + 25, y: baseY - 30, dir: 'up', size: 'medium' });
                } else {
                    objects.push({ type: 'spike', x: i * 150, y: baseY - 30, dir: 'up', size: 'small' });
                    objects.push({ type: 'spike', x: i * 150 + 15, y: baseY - 30, dir: 'up', size: 'small' });
                    objects.push({ type: 'spike', x: i * 150 + 30, y: baseY - 30, dir: 'up', size: 'small' });
                }
                if (i % 5 === 0) {
                    objects.push({ type: 'orb', x: i * 150 + 75, y: baseY - 120 });
                }
            }
            break;
    }

    return objects;
}

/**
 * Calculate distance between two points
 * @param {number} x1 - First point x
 * @param {number} y1 - First point y
 * @param {number} x2 - Second point x
 * @param {number} y2 - Second point y
 * @returns {number} Distance
 */
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/**
 * Clamp a number between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation between two values
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
function lerp(start, end, t) {
    return start + (end - start) * t;
}

/**
 * Check if a point is inside a rectangle
 * @param {number} px - Point x
 * @param {number} py - Point y
 * @param {Object} rect - Rectangle {x, y, w, h}
 * @returns {boolean} True if point is inside
 */
function pointInRect(px, py, rect) {
    return px >= rect.x && px <= rect.x + rect.w && py >= rect.y && py <= rect.y + rect.h;
}

/**
 * Check if a circle intersects with a rectangle
 * @param {Object} circle - Circle {x, y, r}
 * @param {Object} rect - Rectangle {x, y, w, h}
 * @returns {boolean} True if they intersect
 */
function circleRectCollision(circle, rect) {
    const closestX = clamp(circle.x, rect.x, rect.x + rect.w);
    const closestY = clamp(circle.y, rect.y, rect.y + rect.h);
    const distX = circle.x - closestX;
    const distY = circle.y - closestY;
    return (distX * distX + distY * distY) < (circle.r * circle.r);
}

/**
 * Calculate player hitbox
 * @param {Object} player - Player object
 * @returns {Object} Hitbox {x, y, w, h}
 */
function getPlayerHitbox(player) {
    return {
        x: player.x,
        y: player.y,
        w: 40, // CONFIG.PLAYER_SIZE
        h: 40
    };
}

/**
 * Calculate orb hitbox
 * @param {Object} orb - Orb object
 * @returns {Object} Hitbox {x, y, w, h}
 */
function getOrbHitbox(orb) {
    return {
        x: orb.x + 10,
        y: orb.y + 10,
        w: 40,
        h: 40
    };
}

/**
 * Calculate block hitbox
 * @param {Object} block - Block object
 * @returns {Object} Hitbox {x, y, w, h}
 */
function getBlockHitbox(block) {
    return {
        x: block.x,
        y: block.y,
        w: block.w,
        h: block.h
    };
}

/**
 * Calculate coin hitbox
 * @param {Object} coin - Coin object
 * @returns {Object} Hitbox {x, y, w, h}
 */
function getCoinHitbox(coin) {
    const size = coin.size || 20;
    return {
        x: coin.x - size/2,
        y: coin.y - size/2,
        w: size,
        h: size
    };
}

/**
 * Check if player should jump based on orb
 * @param {Object} player - Player object
 * @param {Object} orb - Orb object
 * @returns {boolean} True if player should jump
 */
function shouldActivateOrb(player, orb) {
    const orbHitbox = getOrbHitbox(orb);
    const playerHitbox = getPlayerHitbox(player);
    return rectCollision(playerHitbox, orbHitbox);
}

/**
 * Calculate horizontal distance between two objects
 * @param {Object} a - First object
 * @param {Object} b - Second object
 * @returns {number} Horizontal distance
 */
function horizontalDistance(a, b) {
    return Math.abs(a.x - b.x);
}

module.exports = { 
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
};