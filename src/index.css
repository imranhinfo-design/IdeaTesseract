@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Playfair Display", ui-serif, Georgia, serif;
}

body {
  @apply bg-slate-100 text-gray-900 font-sans;
}

@keyframes moveGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animated-bg {
  background: linear-gradient(-45deg, #000000, #1e3a8a, #facc15);
  background-size: 400% 400%;
  animation: moveGradient 15s ease infinite;
}

@keyframes moveBlue {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30vw, 20vh) scale(1.2); }
  66% { transform: translate(-10vw, 40vh) scale(0.8); }
  100% { transform: translate(0, 0) scale(1); }
}

@keyframes moveYellow {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-30vw, -20vh) scale(1.2); }
  66% { transform: translate(20vw, -40vh) scale(0.8); }
  100% { transform: translate(0, 0) scale(1); }
}

@keyframes floatCard {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

.animate-move-blue {
  animation: moveBlue 15s ease-in-out infinite alternate;
}

.animate-move-yellow {
  animation: moveYellow 18s ease-in-out infinite alternate;
}

.animate-float-card {
  animation: floatCard 6s ease-in-out infinite;
}
