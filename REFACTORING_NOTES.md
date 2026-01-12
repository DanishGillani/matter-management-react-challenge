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

