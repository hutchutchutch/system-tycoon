# "Software as a Service, the game" - React-Ready Landing Page Implementation

## Component Architecture & File Structure

### File Organization
```
src/
├── components/
│   ├── organisms/
│   │   ├── LandingHero/              # NEW - Hero section
│   │   ├── CrisisAlert/              # NEW - Alert bar
│   │   ├── HowItWorks/               # NEW - Process section  
│   │   ├── MissionShowcase/          # NEW - Mission cards
│   │   ├── ImpactDashboard/          # NEW - Stats & progress
│   │   ├── LearningPaths/            # NEW - Skill tracks
│   │   ├── Partners/                 # NEW - Partner logos
│   │   ├── CollaborationFeature/     # NEW - Team features
│   │   ├── Certification/            # NEW - Certificates
│   │   ├── Pricing/                  # NEW - Pricing tiers
│   │   └── FooterCTA/                # NEW - Final call-to-action
│   ├── molecules/
│   │   ├── MissionCard/              # NEW - Individual mission
│   │   ├── LearningTrackCard/        # NEW - Skill path card
│   │   ├── PricingCard/              # NEW - Pricing tier
│   │   ├── ProgressBar/              # NEW - Skill progress
│   │   ├── StatCounter/              # NEW - Animated numbers
│   │   ├── CountdownTimer/           # NEW - Live countdown
│   │   └── AnimatedCounter/          # NEW - Number animations
│   └── pages/
│       └── LandingPage/              # NEW - Main landing page
└── pages/
    └── LandingPage.tsx               # EXISTING - Update imports
```

### Reusable Components Available
- `Button` (src/components/atoms/Button) - Primary/secondary variants
- `Badge` (src/components/atoms/Badge) - Status indicators  
- `Card` (src/components/atoms/Card) - Base card component
- `Progress` (src/components/atoms/Progress) - Progress bars
- `MetricCard` (src/components/molecules/MetricCard) - Stat displays

## Hero Section
**File Path:** `src/components/organisms/LandingHero/LandingHero.tsx`

```jsx
// REUSES: Button, Badge, MetricCard from existing components
import { Button, Badge, MetricCard } from '../../index';

// DEPENDENCIES: Install react-particles, react-simple-maps
// npm install react-particles react-simple-maps

const LandingHero = () => {
  return (
    <section className="hero-section h-screen relative overflow-hidden">
      <AnimatedBackground />
      <Container>
        <HeroContent />
        <div className="flex gap-4 justify-center">
          <Button variant="primary" size="large">
            🚀 Start Your First Mission - Free
          </Button>
          <Button variant="outline" size="large">
            Watch Demo
          </Button>
        </div>
        <SocialProofBar />
        <LiveWorldMap />
      </Container>
    </section>
  );
};

export default LandingHero;
```

### Supporting Components

**File Path:** `src/components/molecules/StatCounter/StatCounter.tsx`
```jsx
// REUSES: Badge component for styling consistency
import { Badge } from '../../atoms/Badge';

interface StatCounterProps {
  icon: string;
  value: number;
  label: string;
  prefix?: string;
  increment?: boolean;
}
```

**File Path:** `src/components/organisms/LandingHero/components/AnimatedBackground.tsx`
```jsx
// Background animation component
// Uses CSS Grid pattern with floating cloud icons
```

**File Path:** `src/components/organisms/LandingHero/components/LiveWorldMap.tsx`
```jsx
// DEPENDENCIES: react-simple-maps or mapbox
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
```

## Crisis Alert Bar
**File Path:** `src/components/organisms/CrisisAlert/CrisisAlert.tsx`

```jsx
// REUSES: Button component for consistent CTA styling
import { Button } from '../../atoms/Button';

const CrisisAlert = () => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Slide down after 3 seconds
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className={`fixed top-0 w-full bg-red-600 text-white p-3 transform transition-transform ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="animate-pulse">⚠️</span>
          <span>URGENT: Flood response system needed in Bangladesh - 2,847 families awaiting help</span>
        </div>
        <Button variant="white" size="small">
          Join Mission →
        </Button>
      </div>
    </div>
  );
};

export default CrisisAlert;
```

## How It Works Section
**File Path:** `src/components/organisms/HowItWorks/HowItWorks.tsx`

```jsx
// REUSES: Card component as base for step cards
import { Card } from '../../atoms/Card';
import { Badge } from '../../atoms/Badge';

const HowItWorks = () => {
  const steps = [
    {
      icon: <EmailIcon className="w-16 h-16" />,
      title: "Receive Urgent Mission",
      description: "Every mission is based on real challenges from our NGO partners.",
      example: "Hospital in Mumbai overloaded - patient tracking system failing"
    },
    // ... other steps
  ];
  
  return (
    <section className="py-20">
      <h2 className="text-4xl font-bold text-center mb-12">
        From Crisis to Code to Change
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <StepCard key={index} {...step} number={index + 1} />
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
```

**File Path:** `src/components/molecules/StepCard/StepCard.tsx`
```jsx
// REUSES: Card component as base structure
import { Card } from '../../atoms/Card';
import { Badge } from '../../atoms/Badge';

interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  example: string;
  number: number;
}
```

**Animated Icons Setup:**
```bash
# Install Lottie for smooth icon animations
npm install lottie-react
# OR use CSS animations with Heroicons/Lucide
npm install lucide-react
```

## Mission Showcase Section
**File Path:** `src/components/organisms/MissionShowcase/MissionShowcase.tsx`

```jsx
// REUSES: Badge for status indicators, Button for CTAs
import { Badge, Button } from '../../atoms';
import { MissionCard } from '../../molecules/MissionCard';

const MissionShowcase = () => {
  const [filter, setFilter] = useState('all');
  const [missions, setMissions] = useState([]);
  
  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <h2 className="text-4xl font-bold text-center mb-8">
          Choose Your Mission. Make Your Impact.
        </h2>
        
        <FilterBar 
          active={filter} 
          onChange={setFilter}
          options={['all', 'urgent', 'global', 'healthcare', 'education', 'environment']}
        />
        
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {missions.map(mission => (
            <MissionCard key={mission.id} {...mission} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default MissionShowcase;
```

**File Path:** `src/components/molecules/MissionCard/MissionCard.tsx`
```jsx
// REUSES: Card as base, Badge for status/skills, Button for CTA
import { Card } from '../../atoms/Card';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';

interface MissionCardProps {
  title: string;
  partner: string;
  location: string;
  difficulty: number;
  activePlayers: number;
  crisis: string;
  skills: string[];
  status: string;
}

const MissionCard = ({ title, partner, location, difficulty, activePlayers, crisis, skills, status }) => (
  <Card className="hover:shadow-xl transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <Badge variant={status === 'URGENT' ? 'error' : 'default'}>
        {status}
      </Badge>
      <DifficultyStars count={difficulty} />
    </div>
    
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    
    <div className="text-sm text-gray-600 space-y-1 mb-4">
      <p>Partner: {partner}</p>
      <p>Location: {location}</p>
      <p className="flex items-center gap-1">
        <Users className="w-4 h-4" />
        {activePlayers} active players
      </p>
    </div>
    
    <div className="mb-4">
      <h4 className="font-semibold mb-1">The Crisis:</h4>
      <p className="text-sm text-gray-700">{crisis}</p>
    </div>
    
    <div className="mb-6">
      <h4 className="font-semibold mb-1">Skills You'll Learn:</h4>
      <div className="flex flex-wrap gap-1">
        {skills.map(skill => (
          <Badge key={skill} variant="secondary" size="small">
            {skill}
          </Badge>
        ))}
      </div>
    </div>
    
    <Button variant="primary" size="full">
      Join Mission →
    </Button>
  </Card>
);

export default MissionCard;
```

## Impact Dashboard Section
**File Path:** `src/components/organisms/ImpactDashboard/ImpactDashboard.tsx`

```jsx
// REUSES: MetricCard for stats display, Progress for skill bars
import { MetricCard } from '../../molecules/MetricCard';
import { Progress } from '../../atoms/Progress';

const ImpactDashboard = () => {
  const [activeTab, setActiveTab] = useState('personal');
  
  return (
    <section className="py-20">
      <Container>
        <h2 className="text-4xl font-bold text-center mb-8">Your Code in Action</h2>
        
        <TabNavigation 
          tabs={['personal', 'global']}
          active={activeTab}
          onChange={setActiveTab}
        />
        
        {activeTab === 'personal' ? <PersonalImpact /> : <GlobalImpact />}
      </Container>
    </section>
  );
};

export default ImpactDashboard;
```

**File Path:** `src/components/organisms/ImpactDashboard/components/PersonalImpact.tsx`
```jsx
// REUSES: MetricCard for consistent stat display, Progress for skill tracking
import { MetricCard } from '../../../molecules/MetricCard';
import { Progress } from '../../../atoms/Progress';

const PersonalImpact = () => {
  const stats = usePlayerStats();
  
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-2xl font-bold mb-4">Your Developer Journey</h3>
        <div className="space-y-4">
          <MetricCard icon="🎯" label="Missions Completed" value={stats.missions} />
          <MetricCard icon="💚" label="Lives Impacted" value={stats.lives} />
          <MetricCard icon="🏗️" label="Systems Deployed" value={stats.systems} />
          <MetricCard icon="🏆" label="Skills Mastered" value={`${stats.skills}/45`} />
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold mb-4">Skill Progress</h3>
        <div className="space-y-3">
          <Progress label="System Architecture" percent={80} />
          <Progress label="Database Design" percent={60} />
          <Progress label="Cloud Security" percent={50} />
          <Progress label="Performance Optimization" percent={70} />
        </div>
      </div>
    </div>
  );
};

export default PersonalImpact;
```

**Interactive Globe Setup:**
```bash
# Install globe component for impact visualization
npm install react-globe.gl
```

**File Path:** `src/components/organisms/ImpactDashboard/components/ImpactGlobe.tsx`
```jsx
// DEPENDENCIES: react-globe.gl
import Globe from 'react-globe.gl';

const ImpactGlobe = () => {
  const [missions, setMissions] = useState([]);
  
  return (
    <Globe
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      pointsData={missions}
      pointAltitude={0.1}
      pointColor={() => '#00ff00'}
      pointRadius={0.5}
      pointLabel={d => `${d.city}: ${d.impact} people helped`}
    />
  );
};

export default ImpactGlobe;
```

## Learning Path Section
**File Path:** `src/components/organisms/LearningPaths/LearningPaths.tsx`

```jsx
// REUSES: Card as base for track cards, Badge for certifications
import { Card } from '../../atoms/Card';
import { Badge } from '../../atoms/Badge';
import { LearningTrackCard } from '../../molecules/LearningTrackCard';

const LearningPaths = () => {
  const tracks = [
    {
      title: "Disaster Response Developer",
      partner: "AWS Disaster Response Team",
      modules: [
        { name: "Basic Load Balancing", completed: true },
        { name: "Database Replication", completed: true },
        { name: "Auto-scaling Systems", inProgress: true },
        { name: "Geo-distributed Architecture", locked: true },
        { name: "Chaos Engineering", locked: true }
      ],
      certification: "AWS Certified Disaster Response Architect",
      careerPath: "Site Reliability Engineer → Disaster Tech Lead"
    },
    // ... other tracks
  ];
  
  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <h2 className="text-4xl font-bold text-center mb-8">
          Master Real Skills. Earn Real Credentials.
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {tracks.map(track => (
            <LearningTrackCard key={track.title} {...track} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default LearningPaths;
```

**File Path:** `src/components/molecules/LearningTrackCard/LearningTrackCard.tsx`
```jsx
// REUSES: Card as base structure, Badge for certifications
import { Card } from '../../atoms/Card';
import { Badge } from '../../atoms/Badge';

interface LearningTrackCardProps {
  title: string;
  partner: string;
  modules: Array<{
    name: string;
    completed?: boolean;
    inProgress?: boolean;
    locked?: boolean;
  }>;
  certification: string;
  careerPath: string;
}
```

**File Path:** `src/components/molecules/SkillTree/SkillTree.tsx`
```jsx
// Visual skill progression component
const SkillTree = ({ modules }) => (
  <div className="relative">
    {modules.map((module, index) => (
      <div key={index} className="flex items-center mb-4">
        <div className={`
          w-12 h-12 rounded-full flex items-center justify-center
          ${module.completed ? 'bg-green-500' : 
            module.inProgress ? 'bg-yellow-500 animate-pulse' : 
            'bg-gray-300'}
        `}>
          {module.completed ? '✓' : module.inProgress ? '...' : '🔒'}
        </div>
        <div className="ml-4">
          <p className={module.locked ? 'text-gray-400' : ''}>{module.name}</p>
        </div>
      </div>
    ))}
    {/* Connecting lines */}
    <svg className="absolute top-0 left-6 h-full w-px">
      <line x1="0" y1="0" x2="0" y2="100%" stroke="#e5e7eb" strokeWidth="2" />
    </svg>
  </div>
);

export default SkillTree;
```

## Partner Organizations Section
**File Path:** `src/components/organisms/Partners/Partners.tsx`

```jsx
// DEPENDENCIES: Install carousel library
// npm install react-slick slick-carousel

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Partners = () => {
  const [selectedPartner, setSelectedPartner] = useState(null);
  
  return (
    <section className="py-20">
      <Container>
        <h2 className="text-4xl font-bold text-center mb-8">
          Trusted by Organizations Changing the World
        </h2>
        
        <LogoCarousel onPartnerClick={setSelectedPartner} />
        
        {selectedPartner && (
          <CaseStudyModal 
            partner={selectedPartner}
            onClose={() => setSelectedPartner(null)}
          />
        )}
      </Container>
    </section>
  );
};

export default Partners;
```

**File Path:** `src/components/organisms/Partners/components/LogoCarousel.tsx`
```jsx
// DEPENDENCIES: react-slick or embla-carousel-react
import Slider from "react-slick";

const LogoCarousel = ({ onPartnerClick }) => {
  const partners = [
    { id: 'redcross', logo: '/logos/redcross.png', name: 'Red Cross' },
    // ... more partners
  ];
  
  const carouselSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 3 }
      }
    ]
  };
  
  return (
    <Slider {...carouselSettings}>
      {partners.map(partner => (
        <div 
          key={partner.id}
          onClick={() => onPartnerClick(partner)}
          className="px-4 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
        >
          <img src={partner.logo} alt={partner.name} className="h-16 object-contain" />
        </div>
      ))}
    </Slider>
  );
};

export default LogoCarousel;
```

## Collaboration Feature Section
**File Path:** `src/components/organisms/CollaborationFeature/CollaborationFeature.tsx`

```jsx
// REUSES: Card for feature lists
import { Card } from '../../atoms/Card';

const CollaborationFeature = () => {
  return (
    <section className="py-20 bg-blue-50">
      <Container>
        <h2 className="text-4xl font-bold text-center mb-8">
          Never Solve Alone. Multiply Your Impact.
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <FeatureList features={[
              {
                title: "Real-time Collaboration",
                description: "Work together on the same canvas. See teammate cursors, components, and changes instantly.",
                icon: <Users className="w-8 h-8" />
              },
              {
                title: "Mentor Mode",
                description: "Experienced players guide newcomers through complex missions.",
                icon: <GraduationCap className="w-8 h-8" />
              },
              {
                title: "Global Hackathons",
                description: "Join monthly 48-hour challenges with players worldwide.",
                icon: <Globe className="w-8 h-8" />
              }
            ]} />
          </div>
          
          <div className="relative">
            <CollaborationDemo />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CollaborationFeature;
```

**File Path:** `src/components/organisms/CollaborationFeature/components/CollaborationDemo.tsx`
```jsx
// Animated cursors component for demo
const CollaborationDemo = () => {
  // Animated cursors moving on a mini canvas
  const [cursor1Pos, setCursor1Pos] = useState({ x: 100, y: 100 });
  const [cursor2Pos, setCursor2Pos] = useState({ x: 200, y: 150 });
  
  useEffect(() => {
    // Animate cursors
    const interval = setInterval(() => {
      setCursor1Pos(prev => ({
        x: prev.x + Math.sin(Date.now() / 1000) * 2,
        y: prev.y + Math.cos(Date.now() / 1000) * 2
      }));
      setCursor2Pos(prev => ({
        x: prev.x - Math.sin(Date.now() / 1000) * 2,
        y: prev.y - Math.cos(Date.now() / 1000) * 2
      }));
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="bg-gray-900 rounded-lg p-4 relative h-64">
      <div className="absolute inset-0 flex items-center justify-center text-gray-600">
        <div className="text-center">
          <Code className="w-12 h-12 mx-auto mb-2" />
          <p>System Design Canvas</p>
        </div>
      </div>
      
      {/* Animated cursors */}
      <Cursor 
        position={cursor1Pos} 
        color="blue" 
        label="Sarah"
      />
      <Cursor 
        position={cursor2Pos} 
        color="green" 
        label="You"
      />
      
      {/* Sample components */}
      <div className="absolute top-8 left-8 bg-blue-600 text-white px-3 py-2 rounded text-sm">
        Load Balancer
      </div>
      <div className="absolute bottom-8 right-8 bg-green-600 text-white px-3 py-2 rounded text-sm">
        Database
      </div>
    </div>
  );
};

export default CollaborationDemo;
```

## Certification Section
**File Path:** `src/components/organisms/Certification/Certification.tsx`

```jsx
// REUSES: Card for certificate preview, Badge for verification status
import { Card } from '../../atoms/Card';
import { Badge } from '../../atoms/Badge';

const Certification = () => {
  return (
    <section className="py-20">
      <Container>
        <h2 className="text-4xl font-bold text-center mb-8">
          Turn Your Gaming Into a Career
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          <CertificatePreview />
          <CertificationDetails />
        </div>
        
        <HiringPartners />
        <SuccessStories />
      </Container>
    </section>
  );
};

export default Certification;
```

**File Path:** `src/components/organisms/Certification/components/CertificatePreview.tsx`
```jsx
// REUSES: Card as certificate base, Badge for verification
import { Card } from '../../../atoms/Card';
import { Badge } from '../../../atoms/Badge';
import { Button } from '../../../atoms/Button';

const CertificatePreview = () => (
  <Card className="bg-gradient-to-br from-blue-50 to-green-50 p-8 shadow-xl">
    <div className="bg-white p-6 rounded">
      <div className="text-center mb-4">
        <Shield className="w-16 h-16 mx-auto text-blue-600" />
        <h3 className="text-2xl font-bold mt-2">SaaS Impact Developer</h3>
        <p className="text-gray-600">Certified Social Impact Engineer</p>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Certificate ID:</span>
          <span className="font-mono">#SW2A5D8K9</span>
        </div>
        <div className="flex justify-between">
          <span>Issued:</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Blockchain Verified:</span>
          <Badge variant="success" size="small">✓</Badge>
        </div>
      </div>
      
      <Button variant="primary" size="full" className="mt-4">
        Verify Certificate
      </Button>
    </div>
  </Card>
);

export default CertificatePreview;
```

## Pricing Section
**File Path:** `src/components/organisms/Pricing/Pricing.tsx`

```jsx
// REUSES: Card as base for pricing tiers, Button for CTAs, Badge for popular tier
import { Card } from '../../atoms/Card';
import { Button } from '../../atoms/Button';
import { Badge } from '../../atoms/Badge';
import { PricingCard } from '../../molecules/PricingCard';

const Pricing = () => {
  const tiers = [
    {
      name: 'Volunteer',
      price: 0,
      features: [
        '3 missions per month',
        'Basic cloud components',
        'Solo play only',
        'Community forums',
        'Impact tracking'
      ],
      cta: 'Start Free',
      impact: null
    },
    {
      name: 'Responder',
      price: 9.99,
      features: [
        'Unlimited missions',
        'All cloud components',
        'Real-time collaboration',
        'Voice chat',
        'Priority crisis alerts',
        'Certification eligible'
      ],
      cta: 'Upgrade to Responder',
      impact: '10% goes to mission partners',
      popular: true
    },
    {
      name: 'Guardian',
      price: 49,
      features: [
        'Everything in Responder',
        'Custom branded missions',
        'Team analytics dashboard',
        'Direct partner connections',
        'Implementation support',
        'Priority support'
      ],
      cta: 'Contact Sales',
      impact: '25% goes to selected charity',
      isTeam: true
    }
  ];
  
  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <h2 className="text-4xl font-bold text-center mb-8">
          Choose Your Impact Level
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map(tier => (
            <PricingCard key={tier.name} {...tier} />
          ))}
        </div>
        
        <p className="text-center mt-8 text-gray-600">
          <Shield className="w-5 h-5 inline mr-2" />
          100% transparent impact reporting. See exactly how your subscription helps.
        </p>
      </Container>
    </section>
  );
};

export default Pricing;
```

**File Path:** `src/components/molecules/PricingCard/PricingCard.tsx`
```jsx
// REUSES: Card as base, Badge for popular indicator, Button for CTA
import { Card } from '../../atoms/Card';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';

interface PricingCardProps {
  name: string;
  price: number;
  features: string[];
  cta: string;
  impact?: string;
  popular?: boolean;
  isTeam?: boolean;
}

const PricingCard = ({ name, price, features, cta, impact, popular, isTeam }) => (
  <Card className={`relative ${popular ? 'border-2 border-blue-500 transform scale-105' : ''}`}>
    {popular && (
      <Badge variant="primary" className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        Most Popular
      </Badge>
    )}
    
    <div className="text-center mb-6">
      <h3 className="text-xl font-bold">{name}</h3>
      <div className="mt-4">
        <span className="text-4xl font-bold">${price}</span>
        <span className="text-gray-600">/{isTeam ? 'team/month' : 'month'}</span>
      </div>
    </div>
    
    <ul className="space-y-3 mb-6">
      {features.map(feature => (
        <li key={feature} className="flex items-center gap-2">
          <span className="text-green-500">✓</span>
          {feature}
        </li>
      ))}
    </ul>
    
    {impact && (
      <div className="mb-4 p-3 bg-green-50 rounded">
        <p className="text-sm text-green-800">💚 {impact}</p>
      </div>
    )}
    
    <Button 
      variant={popular ? 'primary' : 'outline'} 
      size="full"
    >
      {cta}
    </Button>
  </Card>
);

export default PricingCard;
```

## Footer CTA Section
**File Path:** `src/components/organisms/FooterCTA/FooterCTA.tsx`

```jsx
// REUSES: Button for main CTA
import { Button } from '../../atoms/Button';
import { CountdownTimer } from '../../molecules/CountdownTimer';
import { AnimatedCounter } from '../../molecules/AnimatedCounter';

const FooterCTA = () => {
  const [stats, setStats] = useState({
    activeDevelopers: 2384,
    nextMissionTime: 16997 // seconds
  });
  
  return (
    <section className="py-20 bg-gradient-to-br from-green-600 to-blue-600 text-white">
      <Container>
        <h2 className="text-5xl font-bold text-center mb-4">
          Ready to Code for Good?
        </h2>
        
        <p className="text-xl text-center mb-8 opacity-90">
          Join a global community using technology to solve humanity's greatest challenges.
          Your next line of code could save lives.
        </p>
        
        <div className="flex justify-center gap-8 mb-8">
          <LiveCounter 
            icon="🌍" 
            value={stats.activeDevelopers}
            label="developers solving missions"
          />
          <CountdownTimer 
            icon="⏰"
            seconds={stats.nextMissionTime}
            label="Next urgent mission in"
          />
        </div>
        
        <div className="flex justify-center gap-4">
          <Button variant="white" size="large" className="text-green-600 hover:scale-105 transition-transform">
            🚀 Start Your First Mission - Free
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default FooterCTA;
```

## Utility Components

**File Path:** `src/components/molecules/CountdownTimer/CountdownTimer.tsx`
```jsx
interface CountdownTimerProps {
  seconds: number;
  label: string;
  icon: string;
}

const CountdownTimer = ({ seconds, label, icon }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;
  
  return (
    <div className="text-center">
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span className="font-mono text-2xl">
          {String(hours).padStart(2, '0')}:
          {String(minutes).padStart(2, '0')}:
          {String(secs).padStart(2, '0')}
        </span>
      </div>
      <p className="text-sm opacity-75">{label}</p>
    </div>
  );
};

export default CountdownTimer;
```

**File Path:** `src/components/molecules/AnimatedCounter/AnimatedCounter.tsx`
```jsx
interface AnimatedCounterProps {
  value: number;
  duration?: number;
}

const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start > end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value, duration]);
  
  return <span>{count.toLocaleString()}</span>;
};

export default AnimatedCounter;
```

## Main Landing Page Assembly
**File Path:** `src/pages/LandingPage.tsx` (UPDATE EXISTING)

```jsx
// IMPORT ALL NEW ORGANISMS
import {
  LandingHero,
  CrisisAlert,
  HowItWorks,
  MissionShowcase,
  ImpactDashboard,
  LearningPaths,
  Partners,
  CollaborationFeature,
  Certification,
  Pricing,
  FooterCTA
} from '../components/organisms';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <CrisisAlert />
      <LandingHero />
      <HowItWorks />
      <MissionShowcase />
      <ImpactDashboard />
      <LearningPaths />
      <Partners />
      <CollaborationFeature />
      <Certification />
      <Pricing />
      <FooterCTA />
    </div>
  );
};

export default LandingPage;
```

## Required Dependencies
```bash
# Install all required packages
npm install react-particles react-simple-maps react-slick slick-carousel react-globe.gl lottie-react lucide-react

# CSS imports for slick carousel
# Add to src/index.css or main component:
# import "slick-carousel/slick/slick.css";
# import "slick-carousel/slick/slick-theme.css";
```

## Component Export Updates
**File Path:** `src/components/organisms/index.ts` (UPDATE EXISTING)
```typescript
// ADD ALL NEW EXPORTS
export { default as LandingHero } from './LandingHero/LandingHero';
export { default as CrisisAlert } from './CrisisAlert/CrisisAlert';
export { default as HowItWorks } from './HowItWorks/HowItWorks';
export { default as MissionShowcase } from './MissionShowcase/MissionShowcase';
export { default as ImpactDashboard } from './ImpactDashboard/ImpactDashboard';
export { default as LearningPaths } from './LearningPaths/LearningPaths';
export { default as Partners } from './Partners/Partners';
export { default as CollaborationFeature } from './CollaborationFeature/CollaborationFeature';
export { default as Certification } from './Certification/Certification';
export { default as Pricing } from './Pricing/Pricing';
export { default as FooterCTA } from './FooterCTA/FooterCTA';

// ... existing exports
```

**File Path:** `src/components/molecules/index.ts` (UPDATE EXISTING)
```typescript
// ADD ALL NEW MOLECULE EXPORTS
export { default as MissionCard } from './MissionCard/MissionCard';
export { default as LearningTrackCard } from './LearningTrackCard/LearningTrackCard';
export { default as PricingCard } from './PricingCard/PricingCard';
export { default as ProgressBar } from './ProgressBar/ProgressBar';
export { default as StatCounter } from './StatCounter/StatCounter';
export { default as CountdownTimer } from './CountdownTimer/CountdownTimer';
export { default as AnimatedCounter } from './AnimatedCounter/AnimatedCounter';
export { default as SkillTree } from './SkillTree/SkillTree';

// ... existing exports
```

This implementation guide provides complete file paths, component reuse mappings, and dependency information for building the entire landing page using your existing atomic design system while minimizing redundancy.