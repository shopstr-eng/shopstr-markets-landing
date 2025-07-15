# Replit Configuration

## Overview

This is a modern landing page for Shopstr Markets, a permissionless marketplace business built with React and Express.js. The application features a modern tech stack with TypeScript, Tailwind CSS, and shadcn/ui components, showcasing the company's live marketplaces (shopstr.market and milk.market) and their decentralized technology stack.

## System Architecture

### Frontend Architecture

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for development and build processes

### Backend Architecture

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: Hot reload with tsx

### Database Layer

- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema**: Shared schema definitions in TypeScript
- **Migrations**: Drizzle Kit for schema migrations

## Key Components

### Project Structure

```
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utility functions
├── server/               # Express backend
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Database abstraction layer
│   └── vite.ts           # Vite development server integration
├── shared/               # Shared code between frontend and backend
│   └── schema.ts         # Database schema definitions
└── migrations/           # Database migration files
```

### Storage Layer

- **Interface**: `IStorage` provides abstraction for data operations
- **Implementation**: `MemStorage` class for in-memory operations (development)
- **Database Integration**: Ready for PostgreSQL with Drizzle ORM
- **User Management**: Basic user schema with username/password fields

### UI Components

- **Design System**: shadcn/ui components with Radix UI primitives
- **Theming**: CSS variables for light/dark mode support
- **Responsive Design**: Mobile-first approach with Tailwind utilities
- **Icons**: Lucide React icon library

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **API Layer**: Express routes handle requests and validate data
3. **Business Logic**: Storage interface abstracts database operations
4. **Database**: Drizzle ORM manages PostgreSQL interactions
5. **Response**: Typed responses flow back through the stack

## External Dependencies

### Core Dependencies

- **Database**: `@neondatabase/serverless` for PostgreSQL connection
- **ORM**: `drizzle-orm` and `drizzle-kit` for database operations
- **UI**: `@radix-ui/*` components for accessible UI primitives
- **Validation**: `zod` for schema validation with `drizzle-zod`
- **Queries**: `@tanstack/react-query` for server state management

### Development Tools

- **Build**: Vite for fast development and optimized builds
- **TypeScript**: Full type safety across the application
- **ESBuild**: Backend bundling for production deployment
- **Replit Integration**: Custom plugins for Replit environment

## Deployment Strategy

### Development

- **Frontend**: Vite dev server with hot reload
- **Backend**: tsx for TypeScript execution with file watching
- **Database**: Environment-based DATABASE_URL configuration

### Production

- **Frontend**: Static files built with Vite
- **Backend**: Bundled with ESBuild for Node.js execution
- **Database**: PostgreSQL connection via environment variables
- **Static Serving**: Express serves built frontend files

### Build Process

1. Frontend assets compiled with Vite
2. Backend bundled with ESBuild
3. Database migrations applied with Drizzle Kit
4. Single Node.js process serves both frontend and API

## Changelog

```
Changelog:
- July 05, 2025. Initial setup
- July 05, 2025. Updated branding to "Shopstr Markets" with custom color scheme (shopstr yellow #fcd34d and shopstr purple #a438ba)
- July 05, 2025. Added new Marketplaces section showcasing shopstr.market and milk.market
- July 05, 2025. Updated copyright notice to "Shopstr Markets Inc."
- July 05, 2025. Added SEO meta tags and Open Graph properties
- July 06, 2025. Replaced globe emojis with Shopstr logo throughout the site
- July 06, 2025. Integrated Shopstr logo into 3D rotating elements and floating animations
- July 06, 2025. Updated button styles with custom gradient backgrounds based on context (purple/yellow gradients)
- July 06, 2025. Added comprehensive custom color palette to Tailwind config
- July 10, 2025. Updated all main CTA buttons to route to marketplaces section for consistent user flow
- July 10, 2025. Improved button text visibility with darker yellow color (text-yellow-600)
- July 10, 2025. Updated technology section with circular orbit animation for Bitcoin, Nostr, and Cashu logos
- July 10, 2025. Removed Shopstr integration section and replaced with globe icon for global accessibility
- July 10, 2025. Reduced section spacing throughout the page for better visual flow
- July 10, 2025. Restored original section spacing (py-24) to match pre-circular motion layout
- July 10, 2025. Implemented dynamic navbar that changes text color based on background (bright on dark sections, regular on light sections)
- July 10, 2025. Updated "Get Started Free" button in CTA section to match yellow gradient styling of other buttons
- July 10, 2025. Converted navigation to mobile-friendly hamburger menu with color-changing functionality applied to menu icon
- July 10, 2025. Added mobile menu state management with proper open/close functionality and smooth transitions
- July 10, 2025. Implemented scroll-based navbar visibility that slides away when scrolling down and reappears when scrolling up
- July 10, 2025. Implemented responsive navigation with full-screen mobile menu overlay and desktop navigation layout
- July 10, 2025. Added scroll prevention when mobile menu is open and mobile-only hamburger menu
- July 10, 2025. Desktop navigation features centered menu items and right-aligned "Get Started" button
- July 10, 2025. Fixed "Get Started" button text to always be white and never change with navbar color transitions
- July 10, 2025. Updated footer sections (Product, Company, Support) to be horizontally aligned with consistent spacing
- July 10, 2025. Fixed mobile footer layout to display sections horizontally aligned in three columns
- July 10, 2025. Updated footer text to use "permissionless" instead of "decentralized" for consistency with brand messaging
- July 10, 2025. Simplified copyright notice by removing "building the future of free trade" text
- July 10, 2025. Updated GitHub logo link to route to https://github.com/shopstr-eng
- July 10, 2025. Replaced Twitter logo with X logo and updated link to route to https://x.com/_shopstr
- July 10, 2025. Added Nostr icon before X icon in footer, routing to https://njump.me/npub15dc33fyg3cpd9r58vlqge2hh8dy6hkkrjxkhluv2xpyfreqkmsesesyv6e
- July 10, 2025. Moved GitHub icon to be before Nostr icon in footer (order: GitHub, Nostr, X)
- July 10, 2025. Replaced nostr ostrich icon with new black transparent nostr icon in footer
- July 10, 2025. Increased size of nostr icon to be slightly bigger than other social media icons
- July 10, 2025. Further increased nostr icon size to w-8 h-8 and reduced X icon size to w-5 h-5 for better visual hierarchy
- July 10, 2025. Fixed vertical alignment of social media icons using flexbox to ensure all icons are centered regardless of size
- July 10, 2025. Added Privacy Policy page with same navbar and footer as main page, accessible from footer link
- July 10, 2025. Implemented accordion-style privacy policy content using shadcn/ui components
- July 10, 2025. Added Terms of Service page with same navbar and footer as main page, accessible from footer link
- July 10, 2025. Implemented accordion-style terms of service content with 11 sections covering platform rules and user agreements
- July 10, 2025. Completed migration from shadcn/ui to NextUI v2.2.9 component library
- July 10, 2025. Updated all Button components to use NextUI syntax with 'as' prop instead of 'asChild'
- July 10, 2025. Converted Card components from CardContent to CardBody throughout the application
- July 10, 2025. Updated Accordion components to use NextUI's variant="bordered" with title prop structure
- July 11, 2025. Updated mobile navbar to dynamically change background: white when hamburger menu is open, transparent when closed
- July 12, 2025. Fixed "Get Started" button text color to always be white using !text-white across all pages while other navbar items remain dynamic
- July 12, 2025. Updated "More Marketplaces Coming Soon" text from "we're continuously expanding" to "we're planning on expanding"
- July 12, 2025. Updated "Stay Updated" button to route to the same njump nostr link as the nostr icon in footer
- July 12, 2025. Updated footer: removed "About" link from Product section and changed "About" to "Mission" in Company section across all pages
- July 12, 2025. Removed "Our Mission: " text from mission section header, now reads "Making Markets Free 🕊️"
- July 12, 2025. Commented out "Blog" and "Careers" links in footer Company section across all pages
- July 12, 2025. Commented out "Help Center" and "Community" links in footer Support section across all pages
- July 12, 2025. Implemented hybrid footer design: restored original footer structure (logo, description, Product/Company/Support sections) with new bottom section featuring horizontal layout with FAQ/Terms/Privacy links, inline social icons (GitHub, Nostr, X), and simplified copyright notice
- July 12, 2025. Removed FAQ component from footer bottom section, now only contains Terms/Privacy links with social icons and copyright
- July 12, 2025. Added commented-out routes for future use: /blog and /careers in Company section, /help and /community in Support section above FAQ across all pages
- July 12, 2025. Changed mail emoji (📧) to 🤙 emoji in "Stay Updated" button
- July 12, 2025. Fixed navbar consistency across all pages: removed excessive top margin (pt-24) and standardized navbar structure to match home page
- July 12, 2025. Updated FAQ, Terms of Service, and Privacy Policy pages to use consistent navbar with proper layout and navigation structure
- July 12, 2025. Fixed content area spacing by adding py-16 padding to all informational pages for better visual hierarchy
- July 12, 2025. Updated all navigation links to say "Mission" instead of "About" across all pages for consistent messaging
- July 12, 2025. Standardized "Get Started" button design across all pages to use purple-to-yellow gradient instead of purple-only design for visual consistency
- July 12, 2025. Fixed mobile dropdown menu text colors to always use dark gray (text-gray-700) instead of changing based on background, ensuring consistent readability
- July 12, 2025. Updated FAQ page footer styling to match Terms of Service and Privacy Policy pages exactly, using consistent bg-card, text-foreground, and text-muted-foreground classes
- July 12, 2025. Updated accordion components across all pages (FAQ, Terms of Service, Privacy Policy) with improved styling including custom classNames for better hover effects, proper padding, and enhanced visual appearance
- July 13, 2025. Refactored navbar and footer into independent components (Navbar.tsx and Footer.tsx) to eliminate code duplication across all pages
- July 13, 2025. Updated all pages (home, FAQ, terms of service, privacy policy) to use the new Navbar and Footer components for better maintainability
- July 13, 2025. Cleaned up page-specific state management by moving all navbar functionality (scroll behavior, mobile menu, color changes) into the Navbar component
- July 13, 2025. Standardized page structure with consistent isHomePage prop for navbar behavior across different page types
- July 13, 2025. Updated navbar to be truly adaptive with proper text color logic: see-through with dark text on white backgrounds and light text on dark backgrounds
- July 13, 2025. Changed FAQ page "Contact Support 🤙" button to "Contact 🤙" while maintaining the same njump link functionality
- July 13, 2025. Made "Shopstr Markets" text in navbar clickable, routing to homepage in both desktop and mobile views
- July 13, 2025. Centered the "Making Markets Free" section on large screens with improved layout and readability
- July 13, 2025. Fixed text alignment in mission section to be properly centered on all screen sizes while maintaining readability for bullet points and quote
- July 13, 2025. Fixed yellow background in milk.market card to properly fill the entire card on large screens by moving gradient from nested div to Card component
- July 13, 2025. Updated milk.market card to use white background with black text, black title, and black button for clean minimalist aesthetic
- July 13, 2025. Updated shopstr.market card to use gradient-bg background (same as hero section), yellow title and button, white text for consistency
- July 13, 2025. Changed marketplace card titles: "shopstr.market" to "Shopstr" and "milk.market" to "Milk Market" for cleaner presentation
- July 13, 2025. Updated Shopstr card to use light gray background (#f5f5f5) with purple title and button, black text for improved contrast
- July 13, 2025. Replaced shopping cart emoji with Shopstr logo (shopstr-2000x2000.png) in Shopstr marketplace card
- July 13, 2025. Replaced milk glass emoji with milk market icon (milk-market_1752448686068.png) in Milk Market card
- July 13, 2025. Fixed accordion functionality on FAQ, Terms of Service, and Privacy Policy pages by adding selectionMode="multiple" and unique keys
- July 14, 2025. Updated Footer Contact link to route to njump Nostr profile (same as Nostr icon) for consistent contact method
- July 14, 2025. Removed accordion components from FAQ, Terms of Service, and Privacy Policy pages - content now displays directly without collapsible sections
- July 14, 2025. Updated FAQ content to match official Shopstr documentation with streamlined sections (General Information, Payments, Selling, Account & Privacy, Customer Experience)
- July 14, 2025. Updated Terms of Service content to match official Shopstr documentation with focus on permissionless marketplace nature and decentralized platform responsibilities
- July 14, 2025. Updated Privacy Policy content to match official Shopstr documentation with emphasis on minimal data collection and user privacy control in permissionless systems
- July 15, 2025. Added .well-known/nostr.json file for Nostr protocol NIP-05 identifier support, enabling domain-based verification at /.well-known/nostr.json endpoint
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```
