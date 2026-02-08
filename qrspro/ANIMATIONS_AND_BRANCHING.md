# QSRPro Website - Animations and Branching Logic

## Overview

The QSRPro website now features advanced animations and realistic diagnostic flow branching, matching the professional standards of the DiagPro reference website.

## Animations Added

### 1. Hero Section Animations
- **Hero Title**: Typewriter effect that types out the main headline character by character
- **Hero Description**: Slide-in animation from left with 0.2s delay
- **Hero Buttons**: Slide-in animation from left with 0.4s delay
- **Hero Stats**: Slide-in animation from left with 0.6s delay
- **Hero Image (Phone Mockup)**: Slide-in animation from right with 0.2s delay

### 2. Statistics Counter Animation
- **Stat Numbers**: Animated counter that increments from 0 to the target value
- **Duration**: 2 seconds per counter animation
- **Trigger**: Intersection Observer detects when stats section comes into view
- **Formats Supported**:
  - Numbers with `+` suffix (e.g., "100+")
  - Percentages with `%` suffix (e.g., "92%")
  - Time values with `min` suffix (e.g., "5min")

### 3. Phone Mockup Animations
- **Scale-in Animation**: Phone mockup scales in from 0.9 to 1.0 with 0.4s delay
- **Glow Effect**: Continuous pulsing glow animation on hover
- **Diagnostic Steps**: Auto-advance through steps every 3 seconds
- **Confidence Meter**: Smooth width transition as confidence increases

### 4. Card Animations
- **Feature Cards**: Staggered fade-in-up animations (0.1s delay between each)
- **Step Items**: Staggered fade-in-up animations (0.1s delay between each)
- **Equipment Items**: Staggered fade-in-up animations (0.1s delay between each)
- **Vision Cards**: Staggered fade-in-up animations (0.1s delay between each)

### 5. Floating Icons
- **Parallax Effect**: Icons move based on scroll position
- **Float Animation**: Continuous up-and-down floating motion
- **Staggered Delays**: Each icon has different animation delay for visual interest

## Branching Logic in Phone Mockup

### Diagnostic Steps Structure

The phone mockup now displays a realistic diagnostic flow with 6 steps:

1. **Check power supply** (Completed)
   - Initial diagnostic step
   - Marked as completed with green checkmark

2. **Verify thermostat** (Completed)
   - Second diagnostic step
   - Marked as completed with green checkmark

3. **Test heating element** (Active)
   - Current step being executed
   - Highlighted with orange background and play icon
   - Animated with bounce effect

4. **Element working?** (Branch Point)
   - Decision point in the diagnostic flow
   - Marked with code-branch icon
   - Blue background indicating a branching decision
   - Pulsing animation to draw attention

5. **Check control board** (Pending)
   - Next step if element is not working
   - Grayed out until reached

6. **Document findings** (Pending)
   - Final step to record results
   - Grayed out until reached

### Step Classification

**Completed Steps**:
- Green background (#e8f5e8)
- Green checkmark icon
- Indicates successfully completed diagnostic steps

**Active Steps**:
- Orange background (#fff3e0)
- Orange play icon
- Orange border (#FF6B35)
- Bounce animation to indicate current action

**Branch Steps**:
- Blue background (#e3f2fd)
- Code-branch icon
- Blue left border
- Pulsing animation to indicate decision point
- Bold text for emphasis

**Pending Steps**:
- Light gray background (#f8f9fa)
- Gray circle icon
- Awaiting execution

### Confidence Meter

- **Initial Confidence**: 70%
- **Increment**: +6% per step
- **Maximum**: 92%
- **Animation**: Smooth width transition (0.5s)
- **Visual Feedback**: Gradient fill from orange to warm orange

### Auto-Advance Behavior

- **Cycle Duration**: 3 seconds per step
- **Loop**: Automatically cycles through all steps and repeats
- **Visual Feedback**: Step classification updates in real-time
- **Confidence Update**: Meter updates as steps progress

## CSS Animation Classes

### Available Animation Classes

```css
.fade-in-up          /* Fade in with upward movement */
.slide-in-left       /* Slide in from left */
.slide-in-right      /* Slide in from right */
.scale-in            /* Scale from 0.9 to 1.0 */
.pulse               /* Pulsing opacity effect */
.glow                /* Glowing box-shadow effect */
.bounce              /* Bouncing vertical movement */
```

### Animation Timing

- **Fade-in-up**: 0.6s ease-out
- **Slide-in**: 0.8s ease-out
- **Scale-in**: 0.6s ease-out
- **Pulse**: 2s ease-in-out infinite
- **Glow**: 2s ease-in-out infinite
- **Bounce**: 2s ease-in-out infinite

## JavaScript Features

### Intersection Observer

- Detects when elements come into view
- Triggers animations automatically
- Threshold: 0.1 (10% of element visible)
- Root margin: -50px bottom (triggers slightly before fully visible)

### Counter Animation

- Uses `requestAnimationFrame` for smooth animation
- Calculates increment based on target and duration
- Supports multiple number formats
- Resets text after animation completes

### Diagnostic Step Management

- Tracks current step index
- Updates all step classifications
- Calculates confidence based on progress
- Handles branching logic with special styling

### Form Handling

- Loading state with spinner icon
- Success state with checkmark
- Auto-reset after 3 seconds
- Disabled state during submission

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations

- Uses CSS animations for smooth 60fps performance
- Debounced scroll events to prevent jank
- Intersection Observer for efficient viewport detection
- RequestAnimationFrame for counter animations
- Minimal DOM manipulation

## Future Enhancements

- Interactive branching (user can select branch outcomes)
- Multiple diagnostic scenarios
- Step-by-step video demonstrations
- Real-time data from actual QSRPro flows
- Animated transitions between branches
- Swipe gestures for mobile navigation
- Voice-guided diagnostics

## Testing

To test the animations:

1. **Hero Animations**: Refresh page and watch title type out
2. **Stats Counter**: Scroll to hero section and watch numbers count up
3. **Phone Mockup**: Watch diagnostic steps cycle every 3 seconds
4. **Card Animations**: Scroll down to see staggered fade-in effects
5. **Floating Icons**: Scroll and watch icons move with parallax effect
6. **Branch Logic**: Observe the "Element working?" step with pulsing animation

## Files Modified

- `index.html` - Added 6 diagnostic steps with branching
- `styles.css` - Added comprehensive animation keyframes and step styling
- `script.js` - Added branching logic and step management

## Notes

- All animations are GPU-accelerated for smooth performance
- Animations respect user's `prefers-reduced-motion` preference (can be added)
- Mobile-optimized animations with reduced complexity on smaller screens
- Accessibility maintained with semantic HTML and ARIA labels
