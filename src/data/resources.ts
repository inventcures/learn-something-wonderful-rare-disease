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
    title: "Hunting down my son's killer",
    author: "Matt Might",
    source: "Personal Blog",
    url: "https://matt.might.net/articles/my-sons-killer/",
    type: 'article',
    description: "A CS professor chronicles the diagnostic odyssey for his son Bertrand and the discovery of NGLY1 deficiency."
  },
  {
    id: '2',
    title: "Why I'm Open Sourcing My Baby",
    author: "Rohan & Jen Seth",
    source: "Medium",
    url: "https://medium.com/lydian-accelerator/saving-lydia-62a1c0bdf0fb",
    type: 'article',
    description: "The Seths share their journey developing a treatment for their daughter Lydia."
  },
  {
    id: '3',
    title: "A Prion Love Story",
    author: "Eric & Sonia Vallabh",
    source: "The New Yorker",
    url: "https://www.newyorker.com/books/page-turner/a-prion-love-story",
    type: 'article',
    description: "A couple becomes researchers after Sonia tests positive for a fatal genetic mutation."
  },
  {
    id: '4',
    title: "The Race to Stop a Fatal Brain Disease",
    author: "Eric & Sonia Vallabh",
    source: "Scientific American",
    url: "https://www.scientificamerican.com/article/the-married-researchers-racing-to-stop-prion-disease/",
    type: 'article',
    description: "Two scientists race to find a cure for the disease that threatens one of them."
  },
  {
    id: '5',
    title: "India's Desperate Hunt for a $2 Million Drug",
    author: "New York Times",
    source: "NYT",
    url: "https://www.nytimes.com/2022/04/06/business/india-spinal-muscular-atrophy.html",
    type: 'article',
    description: "The challenges faced by rare disease families in India seeking expensive treatments."
  },
  {
    id: '6',
    title: "Life with a Rare Disease",
    author: "New York Times",
    source: "NYT",
    url: "https://www.nytimes.com/2020/07/07/health/rare-diseases.html",
    type: 'article',
    description: "The day-to-day reality of caring for children with rare diseases."
  },
  {
    id: '7',
    title: "The Transformation of Cystic Fibrosis",
    author: "Sarah Zhang",
    source: "The Atlantic",
    url: "https://www.theatlantic.com/magazine/archive/2024/04/cystic-fibrosis-trikafta-breakthrough-treatment/677471/",
    type: 'article',
    description: "How a breakthrough treatment transformed CF from a death sentence to a manageable condition."
  },
  {
    id: '8',
    title: "Breath From Salt",
    author: "Bijal P. Trivedi",
    source: "Book",
    url: "https://www.amazon.com/Breath-Salt-Deadly-Genetic-Medicine/dp/1948836378",
    type: 'book',
    description: "A Deadly Genetic Disease, a New Era in Science, and the Patients and Families Who Changed Medicine."
  },
  {
    id: '9',
    title: "Chasing My Cure",
    author: "David Fajgenbaum",
    source: "Book",
    url: "https://chasingmycure.com/",
    type: 'book',
    description: "A Doctor's Race to Turn Hope Into Action; the story of how a patient became his own researcher."
  },
  {
    id: '10',
    title: "We the Scientists",
    author: "Amy Dockser Marcus",
    source: "Book",
    url: "https://www.penguinrandomhouse.com/books/606019/we-the-scientists-by-amy-dockser-marcus/",
    type: 'book',
    description: "How a Daring Team of Parents and Doctors Forged a New Path for Medicine."
  },
  {
    id: '11',
    title: "Accepting the Unacceptable",
    author: "Matt Might",
    source: "Bertrand's Blog",
    url: "https://bertrand.might.net/articles/accepting-the-unacceptable/",
    type: 'article',
    description: "Matt Might's reflection on losing his son Bertrand to NGLY1 deficiency."
  },
  {
    id: '12',
    title: "The Algorithm for Precision Medicine",
    author: "Matt Might",
    source: "Bertrand's Blog",
    url: "https://bertrand.might.net/articles/algorithm-for-precision-medicine/",
    type: 'article',
    description: "How computational approaches can accelerate rare disease diagnosis and treatment."
  }
];
