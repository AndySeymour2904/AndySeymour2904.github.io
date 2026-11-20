// Shared content for every design option. Edit once, all designs update.
window.CV = {
  name: 'Andy Seymour',
  title: 'Software Engineer',
  location: 'London, UK',
  now: 'Strategy development, Gambit Research',
  summary: "Software engineer with twelve years in production systems. At Gambit Research I write trading strategies in C++ and Python. I joined to lead the data team and moved through internal tools before that. Before Gambit I spent four years at IBM building integration products, and started on flight software at BAE Systems.",
  short: 'I write trading strategies in C++ and Python at Gambit Research. Previously data team lead, IBM and BAE Systems.',
  email: 'aseymour917@gmail.com',
  links: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/andy-seymour-86a24ab1/' },
    { label: 'GitHub', url: 'https://github.com/AndySeymour2904' },
    { label: 'Stack Overflow', url: 'https://stackoverflow.com/users/1911439/andrew-seymour' },
  ],
  jobs: [
    { company: 'Gambit Research', place: 'London', from: 2019, to: null, roles: [
      { title: 'Strategy Development', tags: ['C++', 'Python'], text: 'Coding the trading strategies in C++ and Python.' },
      { title: 'Tools', tags: [], text: 'Internal software for the trading and research teams.' },
      { title: 'Data Team Lead', tags: ['Spark', 'Hadoop', 'Python', 'React', 'AWS'], text: 'Led the data team. Owned the ETL pipelines and brought new data sources onto the platform. Built web tools for analysts and helped technical and non-technical staff work with large datasets in HDFS.' },
    ] },
    { company: 'IBM', place: 'Hursley', from: 2015, to: 2019, roles: [
      { title: 'Frontend Developer, Cloud Integration Platform', tags: ['React', 'Redux', 'Node'], text: 'Rebuilt UIs and UX as the product moved from on-premise to SaaS and PaaS. Worked across several squads on tight deadlines and pushed for pair programming and a cleaner front-end architecture.' },
      { title: 'Full Stack Developer, App Connect', tags: ['React', 'Angular', 'Node'], text: 'Full-stack work across several microservices. Introduced UI testing to the department and shipped complex features in an award-winning UI alongside the design team.' },
      { title: 'Software Developer, MQ', tags: ['C', 'Angular'], text: 'Features and open-source integration in a large, multi-platform C codebase.' },
    ] },
    { company: 'BAE Systems', place: 'Warton', from: 2014, to: 2015, roles: [
      { title: 'Software Engineer', tags: ['Ada', 'C++'], text: 'Display systems and controls for the Eurofighter Typhoon, and the vehicle health management system for the F‑35. Safety-critical code written to an exact specification and rigorously tested.' },
    ] },
  ],
  skills: [
    { group: 'Languages', items: 'C++, Python, TypeScript, JavaScript, SQL, C, Ada' },
    { group: 'Data', items: 'Spark, Hadoop / HDFS, Kafka, pandas, ETL pipelines' },
    { group: 'Web', items: 'React, Node, Next.js, Preact, Redux' },
    { group: 'Infrastructure', items: 'AWS, Cloudflare Workers, Docker, Kubernetes, CI/CD, Linux' },
  ],
  projects: [
    { name: 'FPL Outlook', url: 'https://fploutlook.com', host: 'fploutlook.com', img: '../img/fpl.jpg', text: 'Fantasy Premier League planner: projections, odds and line-ups from five data sources.' },
    { name: "What's Live", url: 'https://whatslive.guide', host: 'whatslive.guide', img: '../img/whatslive.jpg', text: 'Every live sport on UK TV in one calendar, merged from listings, fixtures and EPG data.' },
    { name: 'TOPIK Trainer', url: 'https://topiktrainer.com', host: 'topiktrainer.com', img: '../img/topik.jpg', text: 'Korean reading exam practice on 480 past-paper questions, with sync and mock tests.' },
  ],
  education: { degree: 'MSc Mathematics, First Class', school: 'University of Leicester', note: 'Four module prizes' },
}

// Tiny helpers shared by the designs
window.h = (tag, attrs = {}, ...kids) => {
  const n = document.createElement(tag)
  for (const k in attrs) {
    if (k === 'class') n.className = attrs[k]
    else if (k === 'html') n.innerHTML = attrs[k]
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), attrs[k])
    else if (attrs[k] != null) n.setAttribute(k, attrs[k])
  }
  for (const c of kids.flat(Infinity)) if (c != null && c !== false) n.append(c.nodeType ? c : document.createTextNode(c))
  return n
}
window.years = j => `${j.from} – ${j.to ?? 'now'}`
