ClimaSense Design Tokens
"Color is not just decoration — it communicates mood, urgency, and clarity."

🌈 Color System Overview
ClimaSense uses a weather-responsive palette with clear, friendly tones. Each color has purpose: brand identity, readability, emotional cues, and accessibility.

✅ Brand & Primary Colors
Purpose Name Hex Role
Primary Green green-700 #2e7d32 Main UI theme (nav, buttons)
Accent Green-Gold lime-300 #a0d468 Highlights, icons, pills
Modal Background gray-50 #f8f9fa Clean canvas for overlays
Hover Shadow black-10 rgba(0, 0, 0, 0.1) Subtle depth effect

🌤️ Weather-Driven Accent Colors
These dynamically change based on the weather condition.

Weather Color Name Hex Usage
Sunny Sun Yellow #ffeb3b Hero BG, weather icon glow
Rainy Rain Blue #4fc3f7 BG animation (raindrops), icons
Snowy Snow White #e1f5fe Card BG, snow animation
Cloudy Gray Cloud #90a4ae Muted background, text
Thunderstorm Purple Bolt #9575cd Alerts, status ribbons
Night Midnight #263238 Background gradient at night

🔘 UI Element Colors
Element Color Description
Buttons (Active) #2e7d32 Green with hover transitions
Temperature Pills #a0d468 Glow when active
Text (Primary) #212121 Main content
Text (Secondary) #666666 Labels, hints
Card Background #ffffff Contrast for forecasts
Modal Text #333333 Clear legibility

🧠 Accessibility & Contrast
ClimaSense adheres to WCAG AA contrast standards. Key focus areas:

Sufficient contrast between text and background.

Hover states clearly distinguishable.

Darker shades for night mode (future consideration).

🌀 Example SCSS Tokens
scss
Copy
Edit
$color-primary: #2e7d32;
$color-accent: #a0d468;
$color-modal-bg: #f8f9fa;
$color-text: #212121;
$color-pill: #a0d468;
$color-sun: #ffeb3b;
$color-rain: #4fc3f7;
$color-cloud: #90a4ae;
