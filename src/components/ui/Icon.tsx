import {
  Award,
  BadgeCheck,
  BookOpen,
  Bot,
  Braces,
  Briefcase,
  Bug,
  Building,
  Calendar,
  ClipboardCheck,
  CodeXml,
  FileSearch,
  FileText,
  FlaskConical,
  GitBranch,
  Globe,
  GraduationCap,
  Languages,
  Layers,
  ListChecks,
  Mail,
  MapPin,
  MapPinned,
  MessageSquare,
  Network,
  Phone,
  ReceiptText,
  Repeat,
  Rocket,
  ScanSearch,
  Search,
  ShieldCheck,
  ShoppingBag,
  SquareKanban,
  Target,
  ThumbsUp,
  Timer,
  TrendingUp,
  Umbrella,
  Users,
  Workflow,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react'
import type { IconName } from '@/types/content'

/**
 * Maps the icon keys used in `src/data/*` to icon components, which keeps the
 * content files free of UI imports. To offer a new icon to content, add its
 * key to `IconName` (types/content.ts) and map it here.
 */
const icons: Record<IconName, LucideIcon> = {
  award: Award,
  'badge-check': BadgeCheck,
  'book-open': BookOpen,
  bot: Bot,
  braces: Braces,
  briefcase: Briefcase,
  bug: Bug,
  building: Building,
  calendar: Calendar,
  'clipboard-check': ClipboardCheck,
  code: CodeXml,
  'file-search': FileSearch,
  'file-text': FileText,
  flask: FlaskConical,
  'git-branch': GitBranch,
  globe: Globe,
  'graduation-cap': GraduationCap,
  kanban: SquareKanban,
  languages: Languages,
  layers: Layers,
  'list-checks': ListChecks,
  mail: Mail,
  'map-pin': MapPin,
  'map-pinned': MapPinned,
  'message-square': MessageSquare,
  network: Network,
  phone: Phone,
  receipt: ReceiptText,
  repeat: Repeat,
  rocket: Rocket,
  'scan-search': ScanSearch,
  search: Search,
  'shield-check': ShieldCheck,
  'shopping-bag': ShoppingBag,
  target: Target,
  'thumbs-up': ThumbsUp,
  timer: Timer,
  'trending-up': TrendingUp,
  umbrella: Umbrella,
  users: Users,
  workflow: Workflow,
}

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: IconName
}

/** Renders a content icon by key. Icons are decorative, so they are hidden from screen readers. */
export function Icon({ name, size = 20, strokeWidth = 1.75, ...props }: IconProps) {
  const Component = icons[name]
  return <Component aria-hidden="true" focusable="false" size={size} strokeWidth={strokeWidth} {...props} />
}
