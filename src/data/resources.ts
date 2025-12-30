export interface Resource {
  id: string;
  title: string;
  author: string;
  source?: string;
  url: string;
  type: 'article' | 'book' | 'video';
  description?: string;
}

export const resources: Resource[] = [
  {
    id: '1',
    title: "Hunting down my son’s killer",
    author: "Matt Might",
    url: "https://matt.might.net/articles/my-sons-killer/",
    type: 'article',
    description: "The story of discovering NGLY1 deficiency."
  },
  {
    id: '2',
    title: "Saving Lydia",
    author: "Rohan & Jen Seth",
    url: "https://www.statnews.com/2019/12/10/saving-lydia-antisense-oligonucleotide-rare-disease/",
    type: 'article',
    description: "A customized treatment for a single patient."
  },
  {
    id: '3',
    title: "A Prion Love Story",
    author: "Eric & Sonia Vallabh",
    url: "https://www.newyorker.com/magazine/2020/06/01/a-prion-love-story",
    type: 'article',
    description: "Racing against time to cure a fatal genetic disease."
  },
  {
    id: '4',
    title: "Challenges faced by rare disease families in India",
    author: "New York Times",
    url: "https://www.nytimes.com/", 
    type: 'article',
    description: "Search for specific article on NYT about Indian rare disease families."
  },
  {
    id: '5',
    title: "Day-to-day reality of caring for children with rare diseases",
    author: "New York Times",
    url: "https://www.nytimes.com/",
    type: 'article',
    description: "Detailed account of the daily struggles and triumphs."
  },
  {
    id: '6',
    title: "The CF breakthrough",
    author: "The Atlantic",
    url: "https://www.theatlantic.com/science/archive/2020/11/cystic-fibrosis-cure/616935/",
    type: 'article',
    description: "How Vertex Pharmaceuticals changed the game for Cystic Fibrosis."
  },
  {
    id: '7',
    title: "Breath From Salt",
    author: "Bijal P. Trivedi",
    url: "https://www.amazon.com/Breath-Salt- deadly-Genetic-Science/dp/1948836378",
    type: 'book',
    description: "A Deadly Genetic Disease, a New Era in Science, and the Patients and Families Who Changed Medicine."
  },
  {
    id: '8',
    title: "Chasing My Cure",
    author: "David Fajgenbaum",
    url: "https://chasingmycure.com/",
    type: 'book',
    description: "A Doctor's Race to Turn Hope Into Action."
  },
  {
    id: '9',
    title: "We the Scientists",
    author: "Amy Dockser Marcus",
    url: "https://www.penguinrandomhouse.com/books/606019/we-the-scientists-by-amy-dockser-marcus/",
    type: 'book',
    description: "How a Daring Team of Parents and Doctors Forged a New Path for Medicine."
  }
];
