BrowserWindow (Organism)
  │
  ├── chrome
  │   ├── BrowserHeader (Molecule)
  │   │   ├── windowControls (left - macOS style)
  │   │   │   ├── close button
  │   │   │   ├── minimize button
  │   │   │   └── maximize button
  │   │   │
  │   │   ├── tabs
  │   │   │   ├── tabList
  │   │   │   │   ├── BrowserTab (Atom) - Email Tab
  │   │   │   │   │   ├── browserTab__content
  │   │   │   │   │   │   ├── browserTab__icon
  │   │   │   │   │   │   │   ├── favicon (mail.png) OR
  │   │   │   │   │   │   │   ├── Icon (globe) OR
  │   │   │   │   │   │   │   └── spinner (loading)
  │   │   │   │   │   │   │
  │   │   │   │   │   │   ├── browserTab__title
  │   │   │   │   │   │   │   └── "Email - System Tycoon"
  │   │   │   │   │   │   │
  │   │   │   │   │   │   ├── browserTab__modified (●)
  │   │   │   │   │   │   │   └── [shows for unsaved drafts]
  │   │   │   │   │   │   │
  │   │   │   │   │   │   └── browserTab__notification
  │   │   │   │   │   │       └── [red dot for new emails]
  │   │   │   │   │   │
  │   │   │   │   │   └── browserTab__close
  │   │   │   │   │       └── Icon (x)
  │   │   │   │   │
  │   │   │   │   ├── BrowserTab (Atom) - Dashboard Tab
  │   │   │   │   ├── BrowserTab (Atom) - Other Tabs...
  │   │   │   │   └── [more tabs...]
  │   │   │   │
  │   │   │   └── newTab button
  │   │   │       └── Icon (plus)
  │   │   │
  │   │   ├── bookmarks
  │   │   │   ├── bookmark button
  │   │   │   │   ├── Icon (bookmark icon)
  │   │   │   │   ├── bookmarkTitle
  │   │   │   │   └── notificationDot
  │   │   │   └── [more bookmarks...]
  │   │   │
  │   │   └── windowControls (right - Windows style)
  │   │       ├── minimize button
  │   │       ├── maximize button
  │   │       └── close button
  │   │
  │   └── controls
  │       └── addressBarContainer
  │           └── BrowserAddressBar (Molecule)
  │               ├── navigation
  │               │   ├── back button
  │               │   │   └── Icon (arrow-left)
  │               │   ├── forward button
  │               │   │   └── Icon (arrow-right)
  │               │   ├── refresh button
  │               │   │   └── Icon (refresh)
  │               │   └── home button
  │               │       └── Icon (grid)
  │               │
  │               ├── addressContainer
  │               │   ├── inputWrapper
  │               │   │   ├── input field OR
  │               │   │   └── urlDisplay
  │               │   │       └── "https://mail.systemtycoon.com/inbox"
  │               │   │
  │               │   └── bookmark button
  │               │       └── Icon (star)
  │               │
  │               └── controls
  │                   └── settings button
  │                       └── Icon (settings)
  │
  └── content
      └── [Email Inbox Component - rendered when email tab is active]
          ├── Email List
          ├── Email Preview Pane
          ├── Compose Dialog
          └── Folder Navigation

  Key for Email Inbox Tab:
  - ● = Modified indicator (unsaved draft)
  - 🔴 = Notification dot (new emails)
  - 📧 = Email favicon
  - ⚡ = Loading spinner
  - ✕ = Close button

  Email Tab States:
  Email Tab (Active with notifications):
  ┌─────────────────────────────────┐
  │ 📧 Email - System Tycoon (3) 🔴 ✕ │
  └─────────────────────────────────┘

  Email Tab (Loading):
  ┌─────────────────────────────────┐
  │ ⚡ Email - System Tycoon      ✕ │
  └─────────────────────────────────┘

  Email Tab (With unsaved draft):
  ┌─────────────────────────────────┐
  │ 📧 Email - System Tycoon   ● 🔴 ✕ │
  └─────────────────────────────────┘



Based on my analysis of the Browser Tab component structure and how it
  would display an email inbox, here's the nesting hierarchy and objects
  included:

  Browser Tab Component Nesting Structure for Email Inbox

  Top Level: BrowserWindow (Organism)

  Objects included:
  - activeTab: string (current active tab ID)
  - tabs: Array of BrowserTab objects
  - onTabChange: function to handle tab switching
  - onTabClose: function to handle tab closing
  - bookmarks: Array of bookmark objects
  - children: React content for the active tab

  Level 2: BrowserHeader (Molecule)

  Objects included:
  - tabs: Array of BrowserTabProps objects
  - activeTabIndex: number (index of active tab)
  - onTabSelect: function for tab selection
  - onTabClose: function for tab closing
  - bookmarks: Array of bookmark objects with:
    - id: string
    - title: string
    - url: string
    - icon: string (optional)
    - hasNotification: boolean
    - onClick: function
  - windowControls: macOS/Windows style controls (minimize, maximize, close)

  Level 3: BrowserAddressBar (Molecule)

  Objects included:
  - url: string (current page URL)
  - loading: boolean
  - secure: boolean (HTTPS indicator)
  - canGoBack/canGoForward: boolean navigation states
  - navigation handlers: functions for back, forward, refresh, home
  - onUrlChange: function for URL input changes
  - onNavigate: function for navigation
  - bookmark controls: bookmark state and handler

  Level 4: BrowserTab (Atom) - For Email Inbox

  Objects included:
  - title: "Email - System Tycoon" (displayed text)
  - url: "https://mail.systemtycoon.com/inbox" (email URL)
  - active: boolean (whether this tab is selected)
  - favicon: string (email icon, e.g., "/mail.png")
  - loading: boolean (when loading emails)
  - modified: boolean (for unsaved drafts)
  - hasNotification: boolean (for new emails indicator)
  - onClick: function to switch to email tab
  - onClose: function to close email tab
  - showClose: boolean (whether X button shows)

  Email Inbox Specific Objects:

  When displaying the email inbox, the BrowserTab would contain:
  - Icon container with either:
    - Email favicon image
    - Default globe icon
    - Loading spinner (when fetching emails)
  - Title span: "Email" or "Inbox (3)" (with unread count)
  - Notification indicator: Red dot for new emails
  - Modified indicator: Dot for unsaved drafts
  - Close button: X icon to close email tab

  Tab Content Area:

  The actual email inbox content would be rendered in the
  BrowserWindow.content area as a separate component, typically containing:
  - Email list
  - Email preview pane
  - Compose dialog
  - Folder navigation

  The BrowserTab itself only handles the tab UI, while the email interface
  renders in the content area when that tab is active.