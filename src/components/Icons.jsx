const common = {
  viewBox: '0 0 24 24',
  width: '1em',
  height: '1em',
  'aria-hidden': 'true',
  focusable: 'false',
}

const line = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const GitHubIcon = () => (
  <svg {...common} fill="currentColor">
    <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.25 2.87.12 3.17.77.84 1.24 1.92 1.24 3.23 0 4.62-2.8 5.64-5.48 5.94.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.21.7.83.58C20.57 22.29 24 17.8 24 12.5 24 5.87 18.63.5 12 .5z" />
  </svg>
)

export const LinkedInIcon = () => (
  <svg {...common} fill="currentColor">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
)

export const DiscordIcon = () => (
  <svg {...common} fill="currentColor">
    <path d="M20.32 4.37a19.8 19.8 0 0 0-4.89-1.52.07.07 0 0 0-.08.04c-.21.37-.44.86-.6 1.25a18.3 18.3 0 0 0-5.49 0 12.6 12.6 0 0 0-.62-1.25.08.08 0 0 0-.08-.04 19.74 19.74 0 0 0-4.88 1.52.07.07 0 0 0-.04.03C.53 9.05-.32 13.58.1 18.06c0 .02.01.04.03.05a19.9 19.9 0 0 0 5.99 3.03.07.07 0 0 0 .08-.03c.46-.63.88-1.3 1.23-1.99a.08.08 0 0 0-.04-.11c-.65-.25-1.28-.55-1.87-.89a.08.08 0 0 1-.01-.13c.13-.09.25-.19.37-.29a.07.07 0 0 1 .08-.01c3.92 1.79 8.18 1.79 12.06 0a.07.07 0 0 1 .08.01c.12.1.25.2.37.29a.08.08 0 0 1 0 .13c-.6.35-1.22.64-1.87.89a.08.08 0 0 0-.04.11c.36.7.77 1.36 1.22 1.99a.08.08 0 0 0 .09.03 19.84 19.84 0 0 0 6-3.03.08.08 0 0 0 .03-.05c.5-5.18-.84-9.68-3.55-13.66a.06.06 0 0 0-.03-.03zM8.02 15.33c-1.18 0-2.16-1.08-2.16-2.42 0-1.33.96-2.42 2.16-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.34-.96 2.42-2.16 2.42zm7.97 0c-1.18 0-2.15-1.08-2.15-2.42 0-1.33.95-2.42 2.15-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.34-.95 2.42-2.16 2.42z" />
  </svg>
)

export const InstagramIcon = () => (
  <svg {...common} {...line}>
    <rect x="2.8" y="2.8" width="18.4" height="18.4" rx="5.4" />
    <circle cx="12" cy="12" r="4.1" />
    <circle cx="17.3" cy="6.7" r="1.15" fill="currentColor" stroke="none" />
  </svg>
)

export const MailIcon = () => (
  <svg {...common} {...line}>
    <rect x="2.6" y="4.6" width="18.8" height="14.8" rx="3.4" />
    <path d="m3.6 7.4 7.3 5.3a2 2 0 0 0 2.2 0l7.3-5.3" />
  </svg>
)

export const CopyIcon = () => (
  <svg {...common} {...line}>
    <rect x="9" y="9" width="11.4" height="11.4" rx="3" />
    <path d="M15.6 5.8A2.8 2.8 0 0 0 12.9 3.6H6.6A3 3 0 0 0 3.6 6.6v6.3a2.8 2.8 0 0 0 2.2 2.7" />
  </svg>
)

export const CheckIcon = () => (
  <svg {...common} {...line}>
    <path d="m4.8 12.6 4.6 4.6L19.2 7" />
  </svg>
)

export const StarIcon = () => (
  <svg {...common} fill="currentColor">
    <path d="M12 3.1l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.4l6-.8z" />
  </svg>
)

export const ForkIcon = () => (
  <svg {...common} {...line}>
    <circle cx="6.4" cy="5" r="2.4" />
    <circle cx="17.6" cy="5" r="2.4" />
    <circle cx="12" cy="19" r="2.4" />
    <path d="M6.4 7.4v2a3 3 0 0 0 3 3h5.2a3 3 0 0 0 3-3v-2M12 12.4v4.2" />
  </svg>
)

export const ClockIcon = () => (
  <svg {...common} {...line}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M12 7.4V12l3.2 2" />
  </svg>
)

export const ExternalIcon = () => (
  <svg {...common} {...line}>
    <path d="M13.4 4.6h6v6M19.4 4.6 10 14" />
    <path d="M18.4 14.6v3.2a2.6 2.6 0 0 1-2.6 2.6H6.2a2.6 2.6 0 0 1-2.6-2.6V8.2a2.6 2.6 0 0 1 2.6-2.6h3.2" />
  </svg>
)

export const CloseIcon = () => (
  <svg {...common} {...line}>
    <path d="M6.4 6.4l11.2 11.2M17.6 6.4 6.4 17.6" />
  </svg>
)

export const ArrowDownIcon = () => (
  <svg {...common} {...line}>
    <path d="M12 4.8v14.4M6.2 13.4 12 19.2l5.8-5.8" />
  </svg>
)

export const CodeIcon = () => (
  <svg {...common} {...line}>
    <path d="m8.4 8.4-4 3.6 4 3.6M15.6 8.4l4 3.6-4 3.6M13.6 5.6l-3.2 12.8" />
  </svg>
)

export const GlobeIcon = () => (
  <svg {...common} {...line}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M3.6 12h16.8M12 3.4c2.2 2.3 3.4 5.4 3.4 8.6s-1.2 6.3-3.4 8.6c-2.2-2.3-3.4-5.4-3.4-8.6S9.8 5.7 12 3.4z" />
  </svg>
)

export const BookIcon = () => (
  <svg {...common} {...line}>
    <path d="M4 5.4A1.8 1.8 0 0 1 5.8 3.6h4a2.6 2.6 0 0 1 2.2 1.2 2.6 2.6 0 0 1 2.2-1.2h4A1.8 1.8 0 0 1 20 5.4v11a1.8 1.8 0 0 1-1.8 1.8h-4a2.6 2.6 0 0 0-2.2 1.2 2.6 2.6 0 0 0-2.2-1.2h-4A1.8 1.8 0 0 1 4 16.4z" />
    <path d="M12 6v13" />
  </svg>
)

export const SparkIcon = () => (
  <svg {...common} fill="currentColor">
    <path d="M12 2.6l1.5 4.9 4.9 1.5-4.9 1.5L12 15.4l-1.5-4.9L5.6 9l4.9-1.5zM18.6 14.4l.8 2.4 2.4.8-2.4.8-.8 2.4-.8-2.4-2.4-.8 2.4-.8z" />
  </svg>
)

const REGISTRY = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  discord: DiscordIcon,
  instagram: InstagramIcon,
  mail: MailIcon,
}

export function Icon({ name }) {
  const Component = REGISTRY[name] ?? SparkIcon
  return <Component />
}
