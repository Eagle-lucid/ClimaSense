//
ClimaSense Architecture 🌦️💬
"Weather that speaks to you"

🌐 Core Philosophy
Mission: Transform weather data into delightful, humanized interactions.
Key Principles:

Conversational UI: Feels like chatting with a meteorologist friend

Dynamic Personality: UI adapts tone/animations to weather conditions

Progressive Disclosure: Hide complexity behind intuitive interactions

🧱 Interactive Layers

1. Hero Section (Living Weather Hub)
   Design:

Dynamic Background:

css
/_ Animated weather states _/
.hero--rain { background: url('rain-bg.jpg') + animated raindrops; }
.hero--sunny { gradient fade from #a0d468 to #2e7d32; }
Weather Buddy Text:

js
const messages = {
heatwave: "Stay cool! Today’s high of 34°C calls for hydration.",  
 windy: "Hold onto your hat! Gusts up to 40km/h today."
};
Micro-Interaction:

scss
/_ Card "breathing" effect _/
@keyframes pulse {
0% { transform: scale(0.98); }
50% { transform: scale(1.02); }
100% { transform: scale(0.98); }
} 2. Forecast Systems
Component Behavior Tech Specs
Hourly Touch-scrollable timeline scroll-snap-type: x mandatory
Daily Expandable cards → Side modal transform: translateX(110%)
Modal Contextual tips + AQI health advice backdrop-filter: blur(4px)
Interaction Flow:

Code
graph LR
A[Daily Card Click] --> B[Slide-In Modal]
B --> C[Blur Main UI]
C --> D[Show Weather Tips]

🎨 Design Language
Color & Motion
Purpose Color Animation
Primary Action #2e7d32 (Green) Button press "squish" (scale 0.95)
Warning #dc3545 (Red) Shake horizontally (±5px)
Data Viz #a0d468 (Accent) Path drawing (SVG line animation)
Copywriting Rules
Tone: Warm, concise, actionable

"Rain starts at 3PM — perfect café weather ☕"

Length: ≤140 characters (fits mobile screens)

Variables: Always include:

js
`UV ${index} → ${safetyTip}` // e.g., "UV 8 → Seek shade after 10AM"

⚙️ Technical Implementation
State Management
jsx
// Centralized weather state
const [weather, setWeather] = useState({
current: null,
forecast: [],
aqi: null,
units: 'metric', // or 'imperial'
location: 'Auto' // or user-defined
});
Performance
Lazy Load:

jsx
const ForecastList = lazy(() => import('./ForecastList'));
Image Optimization:

bash

# Convert assets to WebP

vite-imagetools --input assets/images --output src/assets/optimized

📜 Best Practices
Component Isolation:

Each weather condition (RainCard, SunCard) has its own SCSS module

Accessibility:

prefers-reduced-motion support for animations

Aria-live for dynamic message updates

Error Handling:

js
const errorMessages = {
404: "Hmm, we can’t find that city. Try nearby?",  
 500: "Our weather radar is glitching — try again soon!"
};
