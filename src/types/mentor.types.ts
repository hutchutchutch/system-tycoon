export interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  contribution: string;
  avatar: string;
  expertise: string[];
  message: string;
  toastMessage: string;
}

export const mentors: Mentor[] = [
  {
    id: 'jeff-dean',
    name: 'Jeff Dean',
    title: 'Senior Fellow',
    company: 'Google',
    contribution: 'Scaled Google\'s Infrastructure',
    avatar: '👨‍💻',
    expertise: ['Distributed Systems', 'Infrastructure', 'Performance'],
    message: `Here's what I've learned after years at Google: we've already solved the hardest technical problems. Scale? Solved. Distributed systems? Solved. Real-time processing? Solved.

But right now, there's a teacher using spreadsheets that crash with 200 students. A food bank coordinator using text messages to manage deliveries. A health worker tracking disease outbreaks on paper.

These people are solving real problems that matter. They just need someone to connect them with the right technical solutions. The same patterns that power Google can transform a local food network or community health system.

That's where you come in - as the bridge between proven solutions and the people who need them.`,
    toastMessage: 'Check out today\'s news - each story is someone trying to make a difference. Find one that resonates with you and reach out. I\'ll be here if you need guidance.'
  },
  {
    id: 'grace-hopper',
    name: 'Grace Hopper',
    title: 'Computer Scientist',
    company: 'US Navy',
    contribution: 'Created the First Compiler',
    avatar: '👩‍💻',
    expertise: ['Programming Languages', 'Accessibility', 'Education'],
    message: `The most important thing about computers isn't the technology - it's making them useful to people who aren't computer experts.

I spent my career translating between machines and humans. Today, we have incredible tools, but they're locked away behind complexity. There's a nurse who could save lives with better data tracking. A social worker who could help more families with proper case management. A teacher who could personalize learning for every student.

They don't need to understand compilers or assembly language. They need someone who can take existing solutions and make them accessible. Someone who speaks both languages - technology and humanity.

That's your opportunity - to be the translator who brings powerful tools to the people doing important work.`,
    toastMessage: 'Look at today\'s heroes - each one is doing vital work with inadequate tools. You can change that. Pick someone whose mission speaks to you.'
  },
  {
    id: 'barbara-liskov',
    name: 'Barbara Liskov',
    title: 'Institute Professor',
    company: 'MIT',
    contribution: 'Pioneered Data Abstraction',
    avatar: '👩‍🏫',
    expertise: ['Software Engineering', 'Abstraction', 'System Design'],
    message: `My life's work has been about hiding complexity behind simple interfaces. The principle is this: users shouldn't need to understand how something works to use it effectively.

Right now, there's a disaster relief coordinator manually tracking supplies across multiple sites. A mental health organization using paper forms that take weeks to process. A conservation group counting endangered animals in notebooks.

We have the technology to solve these problems elegantly. Cloud databases, real-time sync, automated workflows - all proven solutions. What's missing is someone to wrap that complexity in an interface these heroes can actually use.

You can be that person - the one who takes sophisticated technology and makes it invisible, so the real work can shine through.`,
    toastMessage: 'Each story in today\'s news represents complexity that shouldn\'t exist. Find one where you can make the technology invisible and let the mission take center stage.'
  },
  {
    id: 'werner-vogels',
    name: 'Werner Vogels',
    title: 'CTO',
    company: 'Amazon',
    contribution: 'Built AWS',
    avatar: '🏗️',
    expertise: ['Cloud Architecture', 'Scalability', 'Reliability'],
    message: `"You build it, you run it" - that's been my philosophy at Amazon. But what happens when the people solving critical problems can't build or run complex systems?

I see organizations doing incredible work - tracking missing children, coordinating organ donations, managing community gardens - all on systems held together with spreadsheets and hope. One crash, one mistake, and critical data is lost.

AWS has solved these problems at massive scale. The same patterns that keep Amazon running can protect a food bank's inventory system or a clinic's patient records. The technology exists, tested and proven.

What we need are builders who understand both the technology and the human need. People who can implement rock-solid solutions for those too busy saving the world to become engineers.`,
    toastMessage: 'Today\'s news shows people pushing unreliable systems to their limits. Choose someone whose critical work deserves bulletproof infrastructure.'
  },
  {
    id: 'leslie-lamport',
    name: 'Leslie Lamport',
    title: 'Computer Scientist',
    company: 'Microsoft Research',
    contribution: 'Solved Distributed Consensus',
    avatar: '🔬',
    expertise: ['Distributed Systems', 'Formal Methods', 'Reliability'],
    message: `I've spent decades thinking about what happens when distributed systems fail. The answer? They fail in predictable ways, which means we can design around those failures.

But right now, there's a volunteer network coordinator losing track of who's available when their spreadsheet corrupts. A donation platform going offline during critical fundraising hours. A patient advocacy group whose database crashes just disappeared three months of testimonials.

These aren't new problems. We've solved them in banking, in aerospace, in tech giants. The algorithms exist. The patterns are proven. What's missing is implementation for the organizations that need them most.

You can bridge that gap - taking the same principles that keep financial systems running and applying them to protect the data of those doing humanitarian work.`,
    toastMessage: 'Every story today involves data that can\'t afford to be lost. Pick one where you can apply proven reliability patterns to protect critical work.'
  }
];