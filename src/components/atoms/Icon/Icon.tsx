import React from 'react';
import * as LucideIcons from 'lucide-react';
import { clsx } from 'clsx';
import { IconProps } from './Icon.types';

const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

// Map icon names to Lucide components
const iconMap: Record<string, React.ComponentType<any>> = {
  'server': LucideIcons.Server,
  'database': LucideIcons.Database,
  'globe': LucideIcons.Globe,
  'shield': LucideIcons.Shield,
  'activity': LucideIcons.Activity,
  'arrow-right': LucideIcons.ArrowRight,
  'arrow-left': LucideIcons.ArrowLeft,
  'check': LucideIcons.Check,
  'x': LucideIcons.X,
  'plus': LucideIcons.Plus,
  'minus': LucideIcons.Minus,
  'lock': LucideIcons.Lock,
  'unlock': LucideIcons.Unlock,
  'user': LucideIcons.User,
  'users': LucideIcons.Users,
  'settings': LucideIcons.Settings,
  'play': LucideIcons.Play,
  'pause': LucideIcons.Pause,
  'stop': LucideIcons.Square,
  'refresh': LucideIcons.RefreshCw,
  'download': LucideIcons.Download,
  'upload': LucideIcons.Upload,
  'maximize': LucideIcons.Maximize,
  'minimize': LucideIcons.Minimize,
  'zoom-in': LucideIcons.ZoomIn,
  'zoom-out': LucideIcons.ZoomOut,
  'edit': LucideIcons.Edit,
  'trash': LucideIcons.Trash2,
  'save': LucideIcons.Save,
  'search': LucideIcons.Search,
  'filter': LucideIcons.Filter,
  'chevron-up': LucideIcons.ChevronUp,
  'chevron-down': LucideIcons.ChevronDown,
  'chevron-left': LucideIcons.ChevronLeft,
  'chevron-right': LucideIcons.ChevronRight,
  'menu': LucideIcons.Menu,
  'grid': LucideIcons.Grid,
  'list': LucideIcons.List,
  'alert-circle': LucideIcons.AlertCircle,
  'info': LucideIcons.Info,
  'help-circle': LucideIcons.HelpCircle,
  'star': LucideIcons.Star,
  'heart': LucideIcons.Heart,
  'clock': LucideIcons.Clock,
  'calendar': LucideIcons.Calendar,
  'mail': LucideIcons.Mail,
  'message-circle': LucideIcons.MessageCircle,
  'bell': LucideIcons.Bell,
  'volume': LucideIcons.Volume2,
  'volume-x': LucideIcons.VolumeX,
  'wifi': LucideIcons.Wifi,
  'wifi-off': LucideIcons.WifiOff,
  'battery': LucideIcons.Battery,
  'battery-low': LucideIcons.BatteryLow,
  'cpu': LucideIcons.Cpu,
  'hard-drive': LucideIcons.HardDrive,
  'monitor': LucideIcons.Monitor,
  'smartphone': LucideIcons.Smartphone,
  'cloud': LucideIcons.Cloud,
  'cloud-off': LucideIcons.CloudOff,
  'link': LucideIcons.Link,
  'link-off': LucideIcons.LinkOff,
  'external-link': LucideIcons.ExternalLink,
  'trending-up': LucideIcons.TrendingUp,
  'trending-down': LucideIcons.TrendingDown,
  'bar-chart': LucideIcons.BarChart,
  'pie-chart': LucideIcons.PieChart,
  'terminal': LucideIcons.Terminal,
  'code': LucideIcons.Code,
  'git-branch': LucideIcons.GitBranch,
  'git-commit': LucideIcons.GitCommit,
  'git-merge': LucideIcons.GitMerge,
  'git-pull-request': LucideIcons.GitPullRequest,
  'package': LucideIcons.Package,
  'layers': LucideIcons.Layers,
  'sliders': LucideIcons.Sliders,
  'toggle-left': LucideIcons.ToggleLeft,
  'toggle-right': LucideIcons.ToggleRight,
  'loader': LucideIcons.Loader2,
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color = 'currentColor',
  className,
  'aria-label': ariaLabel,
}) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent
      size={iconSizes[size]}
      color={color}
      className={clsx('icon', `icon--${size}`, className)}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
    />
  );
};