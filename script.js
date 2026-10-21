// Array of vibrant background gradient pairs
const gradients = [
  ['#4a00e0', '#8e2de2'],
  ['#ff416c', '#ff4b2b'],
  ['#00b09b', '#96c93d'],
  ['#2c3e50', '#3498db'],
  ['#f7797d', '#FBD786'],
  ['#8A2387', '#E94057'],
  ['#00b4db', '#0083b0'],
  ['#11998e', '#38ef7d']
];

// Local fallback quote collection in case API fails
const fallbackQuotes = [
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Success" },
  { quote: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "Life" },
  { quote: "Spread love everywhere you go. Let no one ever come to you without leaving happier.", author: "Mother Teresa", category: "Kindness" },
  { quote: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "Mindset" },
  { quote: "It always seems impossible until it's done.", author: "Nelson Mandela", category: "Motivation" },
  { quote: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "Wisdom" }
];

// DOM Elements
const quoteText = document.getElementById('text');
const quoteAuthor = document.getElementById('author');
const categoryBadge = document.getElementById('category');
const newQuoteBtn = document.getElementById('new-quote');
const tweetBtn = document.getElementById('tweet-quote');
const tumblrBtn = document.getElementById('tumblr-quote');
const copyBtn = document.getElementById('copy-btn');
const speakBtn = document.getElementById('speak-btn');
const toast = document.getElementById('toast');

let currentQuote = '';
let currentAuthor = '';

// Fetch quote from API with fallback
async function fetchQuote() {
  try {
    // Fade out text during fetch
    quoteText.style.opacity = '0';
    quoteAuthor.style.opacity = '0';

    const response = await fetch('https://dummyjson.com/quotes/random');
    if (!response.ok) throw new Error('API Unavailable');
    
    const data = await response.json();
    updateUI(data.quote, data.author, "Inspiration");
  } catch (error) {
    // Pick random fallback quote
    const random = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    updateUI(random.quote, random.author, random.category);
  }
}

// Update UI and change theme dynamically
function updateUI(quote, author, category) {
  currentQuote = quote;
  currentAuthor = author;

  setTimeout(() => {
    quoteText.textContent = quote;
    quoteAuthor.textContent = author;
    categoryBadge.textContent = category;

    // Fade back in
    quoteText.style.opacity = '1';
    quoteAuthor.style.opacity = '1';

    // Update social links
    const encodedQuote = encodeURIComponent(`"${quote}" - ${author}`);
    tweetBtn.setAttribute('href', `https://twitter.com/intent/tweet?text=${encodedQuote}`);
    tumblrBtn.setAttribute('href', `https://www.tumblr.com/widgets/share/tool?posttype=quote&caption=${encodeURIComponent(author)}&content=${encodeURIComponent(quote)}&canonicalUrl=https%3A%2F%2Fwww.tumblr.com`);

    // Change background theme colors
    changeTheme();
  }, 300);
}

// Random Gradient Theme Switcher
function changeTheme() {
  const [color1, color2] = gradients[Math.floor(Math.random() * gradients.length)];
  
  document.body.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
  document.documentElement.style.setProperty('--bg-primary', color1);
  document.documentElement.style.setProperty('--bg-secondary', color2);
}

// Copy Quote to Clipboard
copyBtn.addEventListener('click', () => {
  const textToCopy = `"${currentQuote}" — ${currentAuthor}`;
  navigator.clipboard.writeText(textToCopy).then(() => {
    showToast('Quote copied to clipboard!');
  });
});

// Text-to-Speech (Web Speech API)
speakBtn.addEventListener('click', () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Stop any active speech
    const utterance = new SpeechSynthesisUtterance(`${currentQuote} by ${currentAuthor}`);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  } else {
    showToast('Speech synthesis not supported on this browser.');
  }
});

// Show Toast Notification
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// Event Listeners
newQuoteBtn.addEventListener('click', fetchQuote);

// Initial Load
document.addEventListener('DOMContentLoaded', fetchQuote);
