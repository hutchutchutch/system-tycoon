# ImageComparison Component

An interactive slider component that shows the transition between ProblemVille (nature/green theme) and DataWorld (tech/blue theme).

## Usage

```tsx
import { ImageComparison } from '@/components/molecules/ImageComparison';

function LandingPageHero() {
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <section className="hero-section h-screen">
      <ImageComparison
        initialPosition={50}
        onPositionChange={setSliderPosition}
        showLabels={true}
      />
      
      {/* Additional hero content */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          From Problems to Solutions
        </h1>
        <p className="text-xl text-white/80">
          Drag to explore the transformation
        </p>
      </div>
    </section>
  );
}
```

## Props

- `initialPosition` (number): Initial slider position (0-100), default: 50
- `onPositionChange` (function): Callback when slider moves
- `showLabels` (boolean): Show/hide side labels, default: true
- `leftLabel` (string): Custom label for left side, default: "ProblemVille"
- `rightLabel` (string): Custom label for right side, default: "DataWorld"
- `disabled` (boolean): Disable interaction, default: false
- `className` (string): Additional CSS classes

## Features

- Touch and mouse support
- Smooth dragging interaction
- Animated tech assets on the DataWorld side
- Nature assets on the ProblemVille side
- Customizable labels
- Responsive design
- Accessibility-friendly with proper event handling

## Styling

The component uses Tailwind CSS classes and can be customized via the `className` prop. The component takes the full width and height of its container, so wrap it in a sized element:

```tsx
<div className="w-full h-[500px]">
  <ImageComparison />
</div>
```