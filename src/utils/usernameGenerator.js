export function generateUsername() {
    const adjectives = ["Cool", "Smart", "Brave", "Happy", "Clever"];
    const animals = ["Lion", "Tiger", "Bear", "Eagle", "Shark"];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    return `${adjective}${animal}${Math.floor(Math.random() * 1000)}`;
  }