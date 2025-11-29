# Design Guidelines: EXIF GPS Metadata Editor

## Design Approach

**Selected Approach**: Design System - Modern Web Application  
**Justification**: This is a utility-focused tool where clarity, efficiency, and usability are paramount. Drawing from Material Design principles with clean, contemporary execution.

**Reference**: Inspired by modern developer tools (Vercel, Linear, Figma) - clean interfaces that prioritize function with subtle visual polish.

## Core Design Elements

### A. Typography
- **Primary Font**: Inter or DM Sans via Google Fonts CDN
- **Headings**: 
  - H1: 32px/2xl, font-weight 700 (page title)
  - H2: 24px/xl, font-weight 600 (section headers)
  - H3: 18px/lg, font-weight 600 (subsections)
- **Body**: 16px/base, font-weight 400
- **Labels**: 14px/sm, font-weight 500
- **Helper Text**: 13px/xs, font-weight 400

### B. Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, and 8 (e.g., p-4, m-6, gap-8)

**Application Structure**:
- Full-height viewport layout (min-h-screen)
- Header: Fixed top bar with logo/title, h-16, px-6
- Main Content: Two-column split (grid lg:grid-cols-2)
  - Left Panel: File upload zone, EXIF form, metadata display
  - Right Panel: Interactive map container
- Both panels: p-6, overflow-y-auto for scroll independence
- Responsive: Stack vertically on mobile (grid-cols-1)

### C. Component Library

**1. File Upload Zone**
- Drag-and-drop area with dashed border (border-2 border-dashed)
- Center-aligned icon (upload cloud icon, 48px)
- Primary text: "Drop your JPG/JPEG here"
- Secondary text: "or click to browse"
- Hover state: subtle background change
- Active upload state: show file name + thumbnail preview

**2. EXIF Metadata Display**
- Card-based layout with subtle border (border rounded-lg p-4)
- Two-column grid for metadata pairs (grid grid-cols-2 gap-3)
- Label-value pairs with clear hierarchy
- Expandable sections for "All EXIF Tags"

**3. Coordinate Input Form**
- Vertical form layout with generous spacing (space-y-4)
- Text inputs with labels above
- Input fields: border rounded-md, px-3 py-2, h-10
- Number inputs for lat/lng/altitude with step values
- Real-time validation indicators

**4. Interactive Map**
- Full container height (h-full, min-h-96)
- Rounded corners (rounded-lg overflow-hidden)
- Custom marker icon with drop shadow
- Zoom controls positioned top-right
- Current location button (bottom-right)

**5. Primary Action Button**
- Rounded-lg, px-6 py-3
- Background: Blue (#3B82F6)
- Text: White, font-weight 600
- Full-width on mobile, auto-width on desktop
- Disabled state with reduced opacity

**6. Download Button**
- Secondary style: outlined variant
- Border-2, rounded-lg, px-6 py-3
- Icon + text layout (download icon on left)

**7. Alert/Status Messages**
- Toast-style notifications (top-right positioning)
- Success: Green background with checkmark icon
- Error: Red background with warning icon
- Auto-dismiss after 4 seconds
- Slide-in animation from right

### D. Interaction States
- Focus rings on all interactive elements (ring-2 ring-offset-2)
- Disabled states: opacity-50 cursor-not-allowed
- Loading states: spinner icon for "Write EXIF Tags" operation
- Hover states: slight scale/shadow changes for buttons

## Visual Hierarchy

**Information Architecture**:
1. Upload area (most prominent when empty)
2. EXIF metadata display (appears after upload)
3. Coordinate editing form (central functionality)
4. Map visualization (equal prominence to form)
5. Action buttons (clear, accessible placement)

## Layout Specifications

**Desktop (≥1024px)**:
- Two-column grid with equal width panels
- Gap between panels: gap-8
- Container max-width: max-w-screen-2xl mx-auto
- Panel padding: p-8

**Tablet (768px-1023px)**:
- Single column stack
- Map height: min-h-[500px]
- Increased bottom spacing between sections

**Mobile (<768px)**:
- Full-width components
- Map: min-h-[400px]
- Touch-optimized input sizes (min-h-12)
- Sticky action buttons at bottom

## No Images Required
This is a functional web application tool - no hero images or marketing imagery needed. All visual interest comes from the map interface, form elements, and clean typography.