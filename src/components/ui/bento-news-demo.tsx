import {
  AlertCircle,
  Shield,
  Activity,
  TrendingUp,
  Bell,
  Server,
} from "lucide-react";

import { BentoCard, BentoGrid } from "./bento-grid";

const newsFeatures = [
  {
    Icon: AlertCircle,
    name: "Hospital System Failures Surge Nationwide",
    description: "Critical infrastructure outages affecting patient data systems across major medical centers. Emergency protocols activated as IT teams scramble.",
    href: "#",
    cta: "Read full story",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-orange-500/10 to-transparent" />
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-1 lg:col-end-2",
  },
  {
    Icon: Shield,
    name: "Medical Device Network Under Cyber Attack",
    description: "Hackers target connected medical devices in coordinated attack, raising concerns about patient safety.",
    href: "#",
    cta: "Security update",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent" />
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Bell,
    name: "Emergency Services Communication Breakdown",
    description: "911 dispatch systems experiencing widespread technical failures across metropolitan areas.",
    href: "#",
    cta: "View impact",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-transparent" />
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-3",
  },
  {
    Icon: Activity,
    name: "Health Data Breach Affects Millions",
    description: "Major insurance provider confirms unauthorized access to patient records and financial information.",
    href: "#",
    cta: "Check exposure",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-transparent" />
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: TrendingUp,
    name: "Tech Hiring Surge in Healthcare IT",
    description: "Hospitals increase recruitment for system architects and security specialists amid crisis.",
    href: "#",
    cta: "View opportunities",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-blue-500/10 to-transparent" />
    ),
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Server,
    name: "Cloud Migration Disasters Continue",
    description: "Multiple healthcare providers report critical failures during cloud infrastructure transitions.",
    href: "#",
    cta: "Learn more",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-transparent" />
    ),
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-4",
  },
];

function BentoNewsDemo() {
  return (
    <div className="relative w-full">
      <BentoGrid className="lg:grid-rows-3">
        {newsFeatures.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    </div>
  );
}

export { BentoNewsDemo }; 