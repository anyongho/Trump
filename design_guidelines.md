# Design Guidelines: Trump Truth Social Analysis Dashboard

## Design Approach

**Selected Approach**: Design System - Material Design with Analytics Dashboard Patterns

**Justification**: This is a data-intensive analytics application where:
- Function and usability are paramount over visual differentiation
- Information density requires proven, scalable patterns
- Users need efficiency in filtering and analyzing large datasets
- Consistency aids in repeated use and data exploration

**Primary Influences**: Material Design for component structure, with inspiration from modern analytics platforms (Mixpanel, Amplitude, Tableau) for data visualization layouts.

## Typography System

**Font Stack**:
- Primary: Inter (via Google Fonts) - excellent readability for data-heavy interfaces
- Monospace: JetBrains Mono - for data values, timestamps, and numerical displays

**Type Scale**:
- Hero/Page Title: text-4xl font-bold (36px) - Dashboard title
- Section Headers: text-2xl font-semibold (24px) - Chart section titles
- Subsection Headers: text-lg font-semibold (18px) - Filter group labels
- Body/Table Text: text-base font-normal (16px) - Primary content
- Metadata/Labels: text-sm font-medium (14px) - Chart labels, table headers
- Helper Text: text-xs font-normal (12px) - Timestamps, tooltips

**Korean Language Support**: Inter has excellent Korean character support; ensure proper line-height (leading-relaxed: 1.625) for readability.

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 8, 12, 16** for consistent rhythm
- Micro spacing (buttons, inputs): p-2, gap-2
- Component spacing: p-4, gap-4, space-y-4
- Section spacing: p-8, gap-8, space-y-8
- Major layout divisions: p-12, gap-12
- Page margins: p-16 (desktop only)

**Grid Structure**:
- Dashboard layout: 12-column grid system
- Filter sidebar: 3 columns (col-span-3) on desktop, full-width on mobile
- Main content area: 9 columns (col-span-9) on desktop
- Chart grid: 2x2 or 3-column layouts using grid-cols-1 md:grid-cols-2 lg:grid-cols-3

**Container Strategy**:
- Max width: max-w-[1920px] for ultra-wide displays
- Standard content: max-w-7xl mx-auto
- Full-bleed charts: w-full for maximum data visibility

## Component Library

### Navigation & Header
**Top Navigation Bar**:
- Fixed height: h-16
- Contains: Logo/title (left), Last Updated timestamp (center), Refresh button + Upload button (right)
- Spacing: px-8 py-4
- Shadow: shadow-sm for subtle elevation

### Filter Panel
**Sidebar Layout**:
- Sticky positioning: sticky top-16
- Background treatment with subtle border
- Grouped filter sections with collapsible accordions
- Spacing between filter groups: space-y-8

**Filter Controls**:
- Date range: Two date input fields with calendar icon
- Sentiment slider: Range slider with numerical value display
- Multi-select dropdowns: Searchable with checkboxes (max-height with scroll)
- Keyword search: Search input with clear button
- Apply/Reset buttons: Full-width, stacked vertically, gap-4

### Data Table
**Structure**:
- Sticky header row with sort indicators
- Alternating row treatment for readability
- Row height: h-12 for standard rows
- Hover state for row selection
- Expandable rows for tweet details (additional h-auto panel)

**Column Widths** (approximate grid):
- Date/Time: 15%
- Content Preview: 35%
- Platform: 10%
- Impact: 12%
- Sentiment: 10%
- Sector: 15%
- Actions: 3%

### Charts & Visualizations
**Chart Container**:
- Consistent padding: p-6
- Title area: mb-4
- Chart area: Responsive aspect ratio (aspect-video for line charts, aspect-square for pie/donut)
- Legend placement: Below chart with gap-4

**Chart Types**:
1. **Sentiment Distribution Histogram**: Full-width, h-80
2. **Time Series Line Chart**: Full-width, h-96 for prominence
3. **Impact Category Bar Chart**: Half-width on desktop, h-80
4. **Sector Frequency Pie Chart**: Half-width on desktop, h-80
5. **Keyword Cloud/Bar**: Full-width, h-64

### Modals & Detail Views
**Tweet Detail Modal**:
- Max width: max-w-3xl
- Padding: p-8
- Header with close button: flex justify-between items-start mb-6
- Content sections with clear hierarchy: space-y-6
- Full tweet text: Leading-relaxed for readability
- Metadata grid: 2-column layout for key-value pairs
- Original URL button: Prominent placement at bottom

### Buttons & Actions
**Button Hierarchy**:
- Primary (Refresh, Apply Filters): px-6 py-2.5 rounded-lg font-medium
- Secondary (Reset, Cancel): px-6 py-2.5 rounded-lg font-medium with border
- Ghost (Icon buttons): p-2 rounded-lg
- Link style (View Details): underline-offset-4

**Icon Integration**:
- Use Material Icons via CDN
- Button icons: w-5 h-5 with mr-2 spacing
- Standalone icons: w-6 h-6

### Data Export Section
**Export Controls**:
- Horizontal layout: flex gap-4
- Export format selector: Radio button group
- Download button: Primary style with download icon
- Placed below filter panel or in header toolbar

## Special Considerations

### Responsive Breakpoints
- Mobile (default): Single column, stacked filters, scrollable table
- Tablet (md: 768px): 2-column chart grid, collapsible filter drawer
- Desktop (lg: 1024px): Full layout with sidebar, 2-3 column charts
- Wide (xl: 1280px): Maximum data visibility, 3-column chart layouts

### Data Density Management
- Use compact tables on mobile (reduce padding, font-size: text-sm)
- Prioritize vertical scrolling over horizontal
- Implement virtual scrolling for tables with 1000+ rows
- Progressive disclosure: Show 50 rows initially with "Load More"

### Loading & Empty States
- Loading skeleton: Match table/chart structure with subtle pulse animation
- Empty state: Centered message with icon, min-h-96
- Error state: Alert component with retry button

### Korean UI Labels
All interface text should be in Korean with clear, professional language:
- Buttons, filters, table headers
- Chart titles and axis labels
- Helper text and tooltips
- Error and success messages

### Performance Optimizations
- Debounce filter inputs (300ms)
- Virtualize long tables (use react-window or similar)
- Lazy load charts below fold
- Memoize expensive filter operations

## Images

This dashboard application **does not require hero images** as it is a data-focused utility tool. The visual focus should be on:
- Data visualizations (charts and graphs)
- Clean, functional interface elements
- No decorative imagery needed

The only image considerations:
- Upload icon for file upload interface
- Empty state illustrations (simple line drawings or icons)
- Logo/branding if applicable (small, header placement)

All imagery should be minimal and functional, supporting the data-first experience rather than creating visual distraction.