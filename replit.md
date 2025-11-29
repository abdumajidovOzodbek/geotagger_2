# GeoTag Editor - GPS EXIF Metadata Tool

## Overview

GeoTag Editor is a client-side web application for adding, editing, and removing GPS EXIF metadata from JPG/JPEG images. The tool operates entirely in the browser without requiring file uploads to any server, ensuring privacy and speed. Users can drag-and-drop images, view existing EXIF data, manually enter coordinates, use their current location, interactively select locations on a map, and download modified images with updated GPS metadata.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server, providing fast HMR and optimized production builds
- **Wouter** for lightweight client-side routing

**UI Component System**
- **shadcn/ui** component library based on Radix UI primitives (configured as "new-york" style)
- **Tailwind CSS** for utility-first styling with custom design tokens
- CSS variables for theming (light/dark mode support via ThemeProvider)
- Typography: DM Sans, Inter, and other Google Fonts

**State Management**
- **React Hooks** (useState, useCallback, useEffect) for local component state
- **TanStack React Query** (v5) for server state management and caching
- Custom hooks for reusable logic (useToast, useIsMobile)

**Key Libraries**
- **piexifjs**: Client-side EXIF data reading and writing
- **Leaflet**: Interactive map component for coordinate selection
- **file-saver**: Browser file download functionality
- All EXIF processing happens in the browser using piexifjs

### Layout Structure

**Responsive Grid Layout**
- Two-column layout on desktop (lg:grid-cols-2)
- Single column stack on mobile
- Left panel: File upload, coordinate form, EXIF display, action buttons
- Right panel: Interactive map view
- Both panels independently scrollable (overflow-y-auto)

**Component Hierarchy**
- `Header`: App title, theme toggle
- `FileUploader`: Drag-and-drop zone for image selection
- `CoordinateForm`: Manual GPS coordinate input with validation
- `ExifDisplay`: Current EXIF metadata viewer with collapsible sections
- `MapView`: Leaflet-based interactive map with draggable marker
- `ActionButtons`: Write EXIF and Download controls

### Backend Architecture

**Express.js Server** (Node.js)
- Minimal server setup primarily for development and static file serving
- Production build serves static files from dist/public
- Route registration system in place but currently unused (application is fully client-side)

**Storage Interface**
- Abstract IStorage interface defined for potential future server-side features
- In-memory storage implementation (MemStorage) with user management methods
- Currently not utilized as all functionality is client-side

**Build Process**
- TypeScript compilation with esbuild for server code
- Vite for client bundling
- Dependency bundling strategy with allowlist for critical packages to reduce syscalls

### Data Processing Flow

1. **File Upload**: User selects JPG/JPEG via drag-and-drop or file picker
2. **EXIF Reading**: piexifjs extracts metadata from base64-encoded image
3. **State Population**: Coordinates auto-fill from existing GPS data if present
4. **User Interaction**: Edit coordinates manually, use current location, or click/drag map marker
5. **EXIF Writing**: piexifjs writes updated GPS tags to image data
6. **Download**: Modified image saved to user's device via file-saver

### Design System

**Color Tokens**
- HSL-based color system with CSS custom properties
- Primary color: Blue (217° 91% 60%)
- Semantic colors: background, foreground, muted, accent, destructive
- Card and popover variants with dedicated border colors
- Dark mode support via CSS class toggling

**Spacing & Typography**
- Tailwind spacing scale (2, 4, 6, 8 units)
- Custom border radius values (sm: 3px, md: 6px, lg: 9px)
- Font sizes from xs (13px) to 2xl (32px)
- Font weights: 400 (body), 500 (labels), 600 (headings), 700 (titles)

## External Dependencies

### Third-Party Services
- **Google Fonts CDN**: DM Sans, Inter, Architects Daughter, Fira Code, Geist Mono
- **Leaflet Tile Servers**: OpenStreetMap tiles for map rendering
- **Leaflet CSS CDN**: Map styling (version 1.9.4)

### Database
- **PostgreSQL** via Neon serverless driver (@neondatabase/serverless)
- **Drizzle ORM** for type-safe database queries and migrations
- Schema defined in shared/schema.ts with users table
- Currently configured but not actively used (client-side application)

### Package Dependencies
- **UI Framework**: React, React DOM, Wouter
- **UI Components**: Radix UI primitives (27+ component packages)
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer, class-variance-authority, clsx
- **Forms**: React Hook Form, Hookform Resolvers, Zod (validation)
- **Data Fetching**: TanStack React Query
- **EXIF Processing**: piexifjs (client-side)
- **Maps**: Leaflet with TypeScript definitions
- **File Handling**: file-saver
- **Development**: Vite, Replit plugins (cartographer, dev-banner, runtime-error-modal)

### Build & Deployment
- ESBuild for server bundling with selective dependency bundling
- Vite for optimized client-side asset bundling
- TypeScript for type checking across client, server, and shared code
- Module system: ESNext with bundler resolution