export function generateUsername() {
    const adjectives = ["Cool", "Smart", "Brave", "Happy", "Clever",
        "Swift", "Mighty", "Gentle", "Fierce", "Bold",
        "Witty", "Charming", "Sly", "Noble", "Radiant"];
    const animals = ["Lion", "Tiger", "Bear", "Eagle", "Shark",
        "Wolf", "Fox", "Falcon", "Dolphin", "Panda",
        "Giraffe", "Zebra", "Kangaroo", "Otter", "Hawk"];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    return `${adjective}${animal}${Math.floor(Math.random() * 1000)}`;
  }