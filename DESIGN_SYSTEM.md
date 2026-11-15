# James Chugh Portfolio — Design System & Reverse Engineering Specification

Reverse engineered from **[https://www.jameschugh.com/](https://www.jameschugh.com/)** using REA methodology.

---

## 1. Design Tokens & Palette

### Light Mode (Default)
| Token | Value | Role |
| :--- | :--- | :--- |
| `--paper` | `#FFF8EC` | Primary background canvas |
| `--paper-2` | `#FFF1D9` | Warm secondary surface background |
| `--ink` | `#13233A` | Primary typography & high-contrast elements |
| `--ink-2` | `#4B5D72` | Secondary/muted body and metadata text |
| `--line` | `rgba(19, 35, 58, 0.14)` | Subtle dividers and grid boundaries |
| `--sky` | `#2F7FD8` | Brand accent blue & theme color |
| `--sky-2` | `#9FD3FF` | Sky gradient highlight |
| `--sun` | `#FFD23F` | Golden yellow highlight & glow |
| `--coral` | `#FF6B4A` | Warm coral accent |
| `--grass` | `#4F9E4A` | Natural lush green |
| `--lilac` | `#B7A2FF` | Soft purple highlight |
| `--card` | `#FFFDF7` | Card surface color |

### Dark Mode (`[data-theme="dark"]`)
- Activated by `#themeBtn` or system preference.
- Uses circular `viewTransition` expansion clip-path radiating outward from the switch button.
- Inverse ink and deep nighttime landscape backdrop.

### Shadows
- `--shadow`: `0 30px 70px -24px rgba(19, 35, 58, 0.38), 0 2px 8px rgba(19, 35, 58, 0.08)`
- `--shadow-sm`: `0 10px 24px -12px rgba(19, 35, 58, 0.35)`

---

## 2. Typography & Fonts

Imported directly from Google Fonts:
- **`Bricolage Grotesque`**: Used for headers, body text, and primary UI (`--sans`).
- **`Geist`**: Clean geometric sans-serif for UI numbers, stats, and badges (`--geist`).
- **`Gaegu`**: Playful handwritten style for margin notes, arrows, and personal touches (`--hand`).
- **`Anton`**: Ultra-bold display font for impact numbers and hero moments.
- **`Mrs Saint Delafield`**: Elegant cursive calligraphy for signatures and personal signoffs.

---

## 3. Motion & Physics Curves

- **Smooth Easing**: `cubic-bezier(.22, 1, .36, 1)`
- **Spring Bounce**: `cubic-bezier(.34, 1.56, .64, 1)`
- **Smooth Scrolling Engine**: [Lenis](https://github.com/darkroomengineering/lenis) v1.1.13 initialized with custom inertia and anchor scroll listeners.
- **Scroll Observation**: `IntersectionObserver` toggles `.offscreen` and triggers highlight sweeps.

---

## 4. Interactive Components & Micro-Interactions

1. **Ambient Flock Simulation**:
   - Custom canvas Boids algorithm rendering birds that flap, glide, and steer across the valley header.
2. **"Music on the Hill" Generative Synthesizer**:
   - Real-time Web Audio API ambient engine with:
     - Pentatonic tuning (`A4`, `C5`, `D5`, `E5`, `G5`, `A5`, `C6`)
     - Biquad lowpass filter (`3400 Hz`, `Q: 0.3`)
     - Algorithmic convolution reverb impulse response
     - Generative note timing and organic pitch drifts
3. **Tactile Sound Effects (SFX)**:
   - ElevenLabs-recorded haptic audio clips:
     - `click.wav`
     - `hover.wav`
     - `close.wav`
     - `pin.mp3`
     - `bell.mp3`
     - `toggle.wav`
4. **Diorama Journey**:
   - Pinned vertical scroll chapter walk (NSUT, Traum, OYO, MMT, EazyDiner, etc.).
5. **Interactive Desk & Notes**:
   - Draggable paper notes and polaroids with momentum and rotation.
6. **The Lost Room (404 Experience)**:
   - Interactive brass bell with ringing animation and sound.
   - Dynamic flashlight cursor overlay in dark mode (`--mx`, `--my` pointer tracking).
