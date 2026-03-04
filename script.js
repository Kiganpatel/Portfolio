const chain = document.getElementById('pull-chain');
const cord = document.querySelector('.cord');

let isDragging = false;
let hasToggled = false;

// Physics Limits
const RESTING_LENGTH = 120; // Normal cord size
const MAX_STRETCH = 200;    // Absolute limit of how far you can pull it
const TRIGGER_POINT = 180;  // How far down you pull before the lights switch

chain.addEventListener('pointerdown', (e) => {
    isDragging = true;
    hasToggled = false;
    
    // Permanently remove idle swing on first touch
    chain.classList.remove('idle-swing'); 
    
    // Remove springy transitions so it tracks the mouse instantly
    chain.style.transition = 'none'; 
    cord.style.transition = 'none'; 
    
    chain.setPointerCapture(e.pointerId);
});

chain.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    
    // Get the exact anchor point at the ceiling (unaffected by rotation)
    const anchorX = chain.offsetLeft + (chain.offsetWidth / 2);
    const anchorY = chain.offsetTop;
    
    // Calculate distance from ceiling to mouse
    const dx = e.clientX - anchorX;
    const dy = e.clientY - anchorY;
    
    // 1. ANGLE: Point the chain directly at the mouse
    const angle = -Math.atan2(dx, dy) * (180 / Math.PI);
    
    // 2. STRETCH: Calculate physical distance, subtracting the knob height
    let dist = Math.hypot(dx, dy);
    let newCordHeight = dist - 35; 
    
    // Clamp the limits so it doesn't stretch infinitely or shrink
    if (newCordHeight < RESTING_LENGTH) newCordHeight = RESTING_LENGTH;
    if (newCordHeight > MAX_STRETCH) newCordHeight = MAX_STRETCH;

    // Apply the math to the chain
    chain.style.transform = `rotate(${angle}deg)`;
    cord.style.height = `${newCordHeight}px`;

    // Trigger the Light Switch
    if (newCordHeight >= TRIGGER_POINT && !hasToggled) {
        document.body.classList.toggle('light-theme');
        hasToggled = true; 
        if (navigator.vibrate) navigator.vibrate(50); // Small buzz on mobile
    }
});

chain.addEventListener('pointerup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    
    // Add satisfying spring-back bounce
    chain.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    cord.style.transition = 'height 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    // Snap back to resting state
    chain.style.transform = `rotate(0deg)`;
    cord.style.height = `${RESTING_LENGTH}px`;
    
    chain.releasePointerCapture(e.pointerId);
});