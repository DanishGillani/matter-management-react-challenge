# Detailed Task Breakdown

This document provides more specific guidance on what to refactor in each component.

## Task 1: UserProfile Component (`containers/UserProfile/`)

**Issues:**
- Multiple unnecessary `useMemo` hooks for simple string operations
- Unnecessary `useCallback` for handlers that don't need memoization
- Premature optimization

**What to do:**
- Remove `useMemo` for `userName`, `displayName`, `userInitials` (simple string operations)
- Remove `useCallback` for `handleClick` and `handleNameClick` (not passed to memoized components)
- Keep only optimizations that provide actual benefits
- Add comments explaining why you removed each one

## Task 2: TicketList Component (`containers/TicketList/`)

**Issues:**
- Circular dependencies between `useEffect` hooks
- Side effects that should use React Query callbacks (`onSuccess`)
- Unnecessary `useEffect` for derived state (notification count)

**What to do:**
- Fix circular dependencies (Effects 3 and 4 create a loop)
- Move success handling to React Query `onSuccess` callback instead of `useEffect`
- Calculate `notificationCount` directly in render (derived state)
- Remove unnecessary `refetch()` call in `useEffect` (React Query handles this automatically)

## Task 3: TicketsPage Component (`containers/TicketsPage/`)

**Issues:**
- Unnecessary `useMemo` for `memoizedSearchQuery` (just a string transformation)
- Unnecessary `useCallback` for all handlers (not passed to memoized components)
- Unnecessary `useMemo` for `filteredTickets` (filtering/sorting should be in query params or computed in render)
- Circular `useEffect` dependency (triggers `refetch` based on query result)
- Unnecessary `useEffect` for URL param sync (could use `useEffect` with proper dependencies or `useParams` directly)
- Unnecessary `useMemo` for `selectedTicket` (simple `.find()` operation)
- Unnecessary `useEffect` for ticket detail success (should use `onSuccess` callback)
- Query keys not using centralized factory

**What to do:**
- Remove all unnecessary `useMemo` and `useCallback`
- Move filtering/sorting to query params (let the API handle it) OR compute in render if client-side filtering is needed
- Fix circular `useEffect` dependency
- Use React Query `onSuccess` callback instead of `useEffect` for side effects
- Set up centralized query key factory
- Extract shareable hooks

## Task 4: Query Keys (`containers/TicketList/_api/queryKeys.ts`)

**Issues:**
- Not using centralized query key factory pattern
- Not type-safe
- Scattered across different files

**What to do:**
- Create a centralized query key factory (similar to `react-query-key-manager`)
- Make it type-safe with TypeScript
- Use it consistently across all components
- Structure keys hierarchically (e.g., `['tickets', 'list', { status }]`)

## Task 5: TicketFilters Component (`containers/TicketFilters/`)

**Issues:**
- Uses Redux for local component state
- Redux is not even installed (intentional - to force removal)

**What to do:**
- Remove Redux usage completely
- Replace with React `useState` for local state
- Consider using URL params if the filter state should be shareable (bonus)
- Remove the Redux slice file

## Task 6: File Organization

**Current structure:**
```
src/
  containers/
    TicketsPage/
    TicketList/
    UserProfile/
    TicketFilters/
  components/
  utils/
```

**Target structure:**
```
src/
  pages/
    tickets/
      index.tsx (main tickets page)
      [ticketId]/
        index.tsx (ticket detail page)
  components/
    tickets/
      TicketList.tsx
      TicketCard.tsx
      TicketDetail.tsx
      TicketFilters.tsx
  hooks/
    tickets/
      useTicketList.ts
      useTicketDetail.ts
      useTicketFilters.ts
  api/
    tickets/
      queryKeys.ts (centralized)
      queries.ts
  utils/
```

**What to do:**
- Move all `containers/` to `pages/` directory
- Organize by feature (tickets, users, etc.)
- Extract shareable hooks to `hooks/` directory
- Extract shareable components to `components/` directory
- Create centralized API directory with query keys and query functions
- Follow Next.js-style routing structure

## General Guidelines

1. **Only optimize what needs optimizing**: Don't add `useMemo`/`useCallback` "just in case"
2. **Use React Query callbacks**: Prefer `onSuccess`, `onError` over `useEffect` for query side effects
3. **Derived state**: Calculate in render, don't store in state
4. **Query keys**: Centralized, type-safe, hierarchical
5. **File organization**: Clear, navigable, follows modern patterns
6. **Documentation**: Explain your decisions in `REFACTORING_NOTES.md`

## Bonus Points

- Use URL params for shareable state (filters, selected ticket)
- Add proper TypeScript types throughout
- Add error boundaries
- Add loading states
- Consider accessibility improvements
- Add tests (if time permits)
