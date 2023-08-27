import citations from './citations.json';

function getRandomCitation() {
  // Zufälliges Zitat auswählen
  const randomIndex = Math.floor(Math.random() * citations.length);
  const randomCitation = citations[randomIndex];

  // Zitat zurückgeben
  return randomCitation;
}

export default getRandomCitation;
