export interface Resource {
  id: string;
  title: string;
  author: string;
  source?: string;
  url: string;
  type: 'article' | 'book' | 'video';
  description?: string;
  year?: string;
  hatTip?: string;
  previewImage?: string;
}

export const resources: Resource[] = [
  {
    id: '1',
    title: "Hunting down my son's killer",
    author: "Matt Might",
    source: "Personal Blog",
    url: "https://matt.might.net/articles/my-sons-killer/",
    type: 'article',
    year: "2012",
    description: "A CS professor chronicles the diagnostic odyssey for his son Bertrand and the discovery of NGLY1 deficiency."
  },
  {
    id: '2',
    title: "Saving Lydia",
    author: "Rohan & Jen Seth",
    source: "Medium",
    url: "https://medium.com/lydian-accelerator/saving-lydia-62a1c0bdf0fb",
    type: 'article',
    year: "2019",
    description: "The Seths share their journey developing a treatment for their daughter Lydia."
  },
  {
    id: '3',
    title: "The Prion Chronicles",
    author: "D.T. Max",
    source: "The New Yorker",
    url: "https://www.newyorker.com/magazine/2021/09/13/the-husband-and-wife-who-tried-to-cure-prion-disease",
    type: 'article',
    year: "2021",
    description: "A couple becomes researchers after Sonia tests positive for a fatal genetic mutation."
  },
  {
    id: '4',
    title: "One of a Kind",
    author: "Seth Mnookin",
    source: "The New Yorker",
    url: "https://www.newyorker.com/magazine/2014/07/21/one-of-a-kind-2",
    type: 'article',
    year: "2014",
    description: "The story of how Matt Might's blog post led to the identification of NGLY1 deficiency."
  },
  {
    id: '5',
    title: "The $2 Million Drug",
    author: "Apoorva Mandavilli",
    source: "New York Times",
    url: "https://www.nytimes.com/2022/04/06/business/india-spinal-muscular-atrophy.html",
    type: 'article',
    year: "2022",
    description: "The challenges faced by rare disease families in India seeking expensive treatments."
  },
  {
    id: '6',
    title: "What It's Like",
    author: "Gina Kolata",
    source: "New York Times",
    url: "https://www.nytimes.com/2020/07/07/health/rare-diseases.html",
    type: 'article',
    year: "2020",
    description: "The day-to-day reality of caring for children with rare diseases."
  },
  {
    id: '7',
    title: "The New Era of CF",
    author: "Sarah Zhang",
    source: "The Atlantic",
    url: "https://www.theatlantic.com/magazine/archive/2024/04/cystic-fibrosis-trikafta-breakthrough-treatment/677471/",
    type: 'article',
    year: "2024",
    description: "How a breakthrough treatment transformed CF from a death sentence to a manageable condition."
  },
  {
    id: '8',
    title: "Breath From Salt",
    author: "Bijal P. Trivedi",
    source: "Book",
    url: "https://www.amazon.com/Breath-Salt-Deadly-Genetic-Medicine/dp/1948836378",
    type: 'book',
    year: "2020",
    description: "A Deadly Genetic Disease, a New Era in Science, and the Patients and Families Who Changed Medicine."
  },
  {
    id: '9',
    title: "Chasing My Cure",
    author: "David Fajgenbaum",
    source: "Book",
    url: "https://chasingmycure.com/",
    type: 'book',
    year: "2019",
    description: "A Doctor's Race to Turn Hope Into Action; the story of how a patient became his own researcher."
  },
  {
    id: '10',
    title: "We the Scientists",
    author: "Amy Dockser Marcus",
    source: "Book",
    url: "https://www.penguinrandomhouse.com/books/606019/we-the-scientists-by-amy-dockser-marcus/",
    type: 'book',
    year: "2023",
    description: "How a Daring Team of Parents and Doctors Forged a New Path for Medicine."
  },
  {
    id: '11',
    title: "Accepting the Unacceptable",
    author: "Matt Might",
    source: "Bertrand's Blog",
    url: "https://bertrand.might.net/articles/accepting-the-unacceptable/",
    type: 'article',
    year: "2020",
    description: "Matt Might's reflection on losing his son Bertrand to NGLY1 deficiency."
  },
  {
    id: '12',
    title: "Precision Medicine",
    author: "Matt Might",
    source: "Bertrand's Blog",
    url: "https://bertrand.might.net/articles/algorithm-for-precision-medicine/",
    type: 'article',
    year: "2015",
    description: "How computational approaches can accelerate rare disease diagnosis and treatment."
  }
];
