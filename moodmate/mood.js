function showMood(mood) {
  const vibeBox = document.getElementById("vibe-box");
  const quote = document.getElementById("quote");
  const task = document.getElementById("task");
  const music = document.getElementById("music");
  const body = document.body;

  const moodData = {
    happy: {
      color: "#FFF9C4",
      quote: "You’re glowing today ✨",
      task: "Share a smile with someone!",
      music: "https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC"
    },
    sad: {
      color: "#E1F5FE",
      quote: "It's okay to feel sad 💧",
      task: "Write down 3 nice things about yourself",
      music: "https://open.spotify.com/playlist/37i9dQZF1DX3YSRoSdA634"
    },
    angry: {
      color: "#FFCDD2",
      quote: "Take a breath, you’re stronger than your anger 🔥",
      task: "Do 10 deep breaths or walk for 5 mins",
      music: "https://open.spotify.com/playlist/37i9dQZF1DWXRqgorJj26U"
    },
    tired: {
      color: "#D7CCC8",
      quote: "Rest is productive too 💤",
      task: "Stretch and drink water",
      music: "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ"
    },
    loved: {
      color: "#F8BBD0",
      quote: "You are deeply loved 💖",
      task: "Tell someone you care about them",
      music: "https://open.spotify.com/playlist/37i9dQZF1DXcCnTAt8CfNe"
    }
  };

  const tips = [
    "🌸 Take a water break!",
    "🧘‍♀️ Stretch your arms and smile.",
    "💖 You deserve softness today."
  ];
  document.getElementById("tip").textContent = tips[Math.floor(Math.random() * tips.length)];

  const data = moodData[mood];
  quote.textContent = data.quote;
  task.textContent = data.task;
  music.href = data.music;

  body.style.backgroundColor = data.color;
  vibeBox.classList.remove("hidden");
}
