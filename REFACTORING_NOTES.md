## Commit 1: Remove Unnecessary Hooks from UserProfile Component

### Implementation Details

**File Modified:** `src/containers/UserProfile/index.tsx`

**Changes Made:**
- ✅ Removed `useMemo`, `useCallback` imports
- ✅ Replaced `userName` useMemo with direct inline calculation
- ✅ Replaced `handleClick` useCallback with regular function declaration
- ✅ Replaced `displayName` useMemo with direct ternary operator
- ✅ Replaced `userInitials` useMemo with inline helper function
- ✅ Replaced `handleNameClick` useCallback with regular function
- ✅ Added explanatory comments for each change

### Testing Results

**Manual Testing:**
- ✅ Component renders at `/user-profile` without errors
- ✅ User profile displays correctly (name, display name, initials)
- ✅ Counter button increments on click
- ✅ Log Name button logs to console correctly
- ✅ No console errors or warnings

**Linting Results:**
- ✅ UserProfile component passes lint check (zero errors)
- ℹ️ Pre-existing lint errors in other files (TicketDetail, TicketFilters) - to be fixed in later commits

**Browser Testing:**
- ✅ Profile loads after ~1 second (React Query loading)
- ✅ All interactive elements respond correctly
- ✅ No performance issues or re-render loops

## Commit 2: Fix TicketList Circular Dependencies and Derived State

### Implementation Details

**Files Modified:**
- `src/containers/TicketList/index.tsx` (component)
- `src/containers/TicketList/hooks/useTicketList.ts` (hook)

**Changes Made:**
- ✅ Removed circular useEffect dependencies (Effects 3 & 4)
- ✅ Converted notificationCount from state → derived state (calculated in render)
- ✅ Removed unnecessary refetch() effect
- ✅ Kept single effect for success logging (doesn't cause circular dependency)
- ✅ Added TypeScript return type to useTicketList queryFn
- ✅ Added explanatory comments

**Lines Changed:**
- TicketList/index.tsx: Reduced from 70+ lines with 5 effects → 48 lines with 1 effect
- useTicketList.ts: Added Promise<Ticket[]> return type

### The Problem (Before)

**Circular Dependency Loop:**
- User selects ticket
- Effect 3 runs: increment notificationCount state
- Effect 4 watches notificationCount, sees it > 5
- Effect 4 auto-selects first ticket
- selectedTicketId changes
- Go back to step 2 → Infinite Loop! 🔄

### The Solution (After)

**Derived State (No Loop):**
- Component renders with tickets data
- notificationCount calculated: tickets?.filter(t => !t.read).length
- Single effect logs success message (doesn't update state)
- No state updates = no circular dependencies

### Testing Results

**Lint Check:**
- ✅ TicketList component passes lint (zero errors)
- ✅ TypeScript compilation successful

**Manual Testing:**
- ✅ Component renders at `/ticket-list` without errors
- ✅ 3 tickets display correctly
- ✅ Notification count shows correct unread count (2)
- ✅ Filter dropdown works ("all", "open", "closed")
- ✅ Ticket selection updates border styling
- ✅ Success message logs once per filter change in console
- ✅ No infinite loop warnings
- ✅ No circular dependency issues

**Browser DevTools:**
- ✅ Console shows "Tickets loaded successfully! Total: X" message
- ✅ Message appears once or twice max (not repeatedly)
- ✅ No errors or warnings

### Key Learning Points

1. **Derived State > Stored State**: Calculate in render, don't store
2. **Single Source of Truth**: notificationCount comes from tickets data, not separate state
3. **Effects Cause Loops**: When one effect updates state watched by another effect
4. **React Query Handles Refetch**: When queryKey changes, React Query automatically refetches

### Alternative Approaches Considered

| Approach | Why Rejected |
|----------|-------------|
| Keep notificationCount in state with useCallback | Still required effect to sync state |
| Use useCallback to memoize filter | Doesn't solve circular dependency problem |
| Implement useReducer | Overkill for this simple state |
| Use Zustand/Redux | Too heavy for local component state |


## Commit 3: Refactor TicketsPage Component - Remove Unnecessary Optimizations

### Implementation Details

**File Modified:** `src/containers/TicketsPage/index.tsx`

**Changes Made:**
- ✅ Removed `useMemo` for `memoizedSearchQuery` (simple string operations)
- ✅ Removed all `useCallback` handlers (not passed to memoized components)
- ✅ Removed `useMemo` for `filteredTickets` (API handles filtering)
- ✅ Removed circular `useEffect` that triggered `refetch()`
- ✅ Simplified URL param sync to single effect
- ✅ Removed unused `selectedTicket` useMemo
- ✅ Removed ticket detail success logging effect

**Lines Changed:**
- Reduced from 130+ lines → 95 lines
- Removed 4 useMemo + 4 useCallback instances
- Changed from 7+ hooks → 2 effects

### The Problem (Before)

**Unnecessary Optimizations:**
- useMemo for memoizedSearchQuery: String trim/lowercase operations are cheap
- useCallback for handlers: Passed to non-memoized components (no benefit)
- useMemo for filteredTickets: API already filters (duplicating work)
- Circular refetch effect: React Query auto-refetches on queryKey change

### The Solution (After)

**Clean and Simple:**
- Remove all unnecessary memoization hooks
- Let React Query handle caching
- Let API handle filtering
- Direct event handlers without useCallback

**Benefits:**
- 27% less code
- 82% fewer hooks (11 → 2)
- Simpler, easier to maintain
- Better performance

### Testing Results

**Lint Check:**
- ✅ TicketsPage component passes lint (zero errors)
- ✅ TypeScript compilation successful

**Manual Testing:**
- ✅ Component renders at `/tickets` without errors
- ✅ Search input responds instantly
- ✅ Filter and sort work correctly
- ✅ Ticket selection shows detail on right
- ✅ URL params work - `/tickets/1` auto-selects
- ✅ No infinite loops or re-renders

### Key Learning Points

1. **API Already Optimized** - Don't duplicate filtering/sorting
2. **Not All Optimizations Help** - Remove complexity without benefit
3. **React Query Caches** - Don't memoize results it already caches
4. **Only Memoize When Needed** - If passed to React.memo components

### Alternative Approaches Considered

| Approach | Why Rejected |
|----------|-------------|
| Keep useMemo for filteredTickets | API already filters, redundant work |
| Use useCallback on handlers | Components aren't memoized, won't prevent re-renders |
| Keep circular refetch effect | React Query handles this automatically |
| Keep useMemo for memoizedSearchQuery | String operations negligible cost |

## Commit 4: Centralize and Type-Safe Query Keys

### Implementation Details

**Files Created:**
- `src/api/tickets/queryKeys.ts` (NEW - centralized query key factory)

**Files Modified:**
- `src/containers/TicketList/hooks/useTicketList.ts`
- `src/containers/UserProfile/hooks/useGetUserProfile.ts`
- `src/containers/TicketsPage/index.tsx`

**Files Deleted:**
- `src/containers/TicketList/_api/queryKeys.ts` (OLD - replaced)

**Changes Made:**
- ✅ Created centralized query key factory
- ✅ Implemented hierarchical, type-safe structure
- ✅ Updated all hooks to use centralized keys
- ✅ Updated TicketsPage to use centralized keys
- ✅ Deleted old scattered query keys

### The Problem (Before)

- Query keys scattered in multiple files
- Inconsistent naming and structure
- Hard to find and refactor queries
- Limited type safety

### The Solution (After)

- Single centralized factory at src/api/tickets/queryKeys.ts
- Hierarchical, type-safe key structure
- All hooks use same factory
- Easy to refactor entire app at once

### Testing Results

**Lint Check:**
- ✅ All components pass lint (zero errors)
- ✅ TypeScript compilation successful

**Manual Testing:**
- ✅ `/user-profile` loads correctly
- ✅ `/ticket-list` loads correctly
- ✅ `/tickets` loads correctly
- ✅ Search, filter, sort work
- ✅ Ticket detail loads
- ✅ No console errors



