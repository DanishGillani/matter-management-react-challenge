# Senior Frontend Engineer - Take Home Assessment

## Overview

This assessment is designed to evaluate your ability to work with legacy codebases, refactor technical debt, and establish modern frontend patterns. You'll be working with intentionally messy code that reflects real-world challenges we face daily.

## What We're Testing

1. **Code Organization & Architecture**: Can you structure code in a maintainable way?
2. **React Best Practices**: Do you understand when (and when NOT) to use hooks?
3. **Refactoring Skills**: Can you clean up technical debt without breaking functionality?
4. **React Query Expertise**: Can you set up proper query key management and data fetching patterns?
5. **Problem-Solving**: Can you identify and fix performance issues and anti-patterns?

## The Task

You'll be refactoring multiple components in a **Ticket Management** feature that has accumulated technical debt over time. The code works, but it's messy, hard to maintain, and has several anti-patterns.

### Components to Refactor

The assessment includes several components with different issues:

1. **`containers/TicketsPage/`** - Main ticket page with multiple issues:
   - Unnecessary `useMemo` and `useCallback`
   - Circular `useEffect` dependencies
   - Poor React Query key management

2. **`containers/TicketList/`** - Ticket list component:
   - Circular `useEffect` dependencies
   - Side effects that should use React Query callbacks
   - Unnecessary `useEffect` for derived state

3. **`containers/UserProfile/`** - User profile component:
   - Excessive `useMemo` and `useCallback` usage
   - Premature optimizations

4. **`containers/TicketFilters/`** - Filter component:
   - Uses Redux for local state (should use React state or URL params)

5. **`containers/TicketList/_api/queryKeys.ts`** - Query keys:
   - Not using centralized query key factory
   - Not type-safe

### Your Mission

1. **Refactor the file structure** to follow modern patterns (pages directory, proper separation of concerns)
2. **Clean up React hooks** - remove unnecessary `useMemo`, `useCallback`, and `useEffect` usage
3. **Set up React Query properly** - implement centralized query key management and proper data fetching patterns
4. **Remove Redux** - replace Redux usage with React state or URL params where appropriate
5. **Fix performance issues** - identify and resolve unnecessary re-renders and circular dependencies
6. **Document your decisions** - explain why you made certain choices

## Getting Started

See **[QUICK_START.md](./QUICK_START.md)** for detailed setup instructions.

Quick start:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port)

**Note**: The `TicketFilters` component will show errors because Redux is intentionally not installed. This is part of the assessment - you need to remove Redux usage.

## Current State (What's Wrong)

The codebase has several issues:

- ❌ Files are scattered in a `containers/` directory (legacy Redux pattern)
- ❌ Unnecessary `useMemo` and `useCallback` everywhere (premature optimization)
- ❌ Circular `useEffect` dependencies causing infinite loops
- ❌ React Query keys are not properly managed (scattered, not type-safe)
- ❌ Redux used for local component state (should use React state)
- ❌ Side effects handled in `useEffect` instead of React Query callbacks
- ❌ Utils and hooks are not shareable
- ❌ No clear separation between pages, components, and hooks

## Expected Outcome

After your refactoring:

- ✅ Clean `pages/` directory structure (similar to Next.js app directory)
- ✅ Proper React Query setup with query key management
- ✅ Removed unnecessary optimizations (only keep what's needed)
- ✅ Shareable hooks and utilities
- ✅ Clear file organization that a new developer can navigate easily

## Submission

1. Fork this repository
2. Complete the refactoring
3. Add a `REFACTORING_NOTES.md` file explaining:
   - What you changed and why
   - Any trade-offs you considered
   - How you would approach this differently if you had more time
4. Submit your repository link

## Evaluation Criteria

- **Code Quality**: Clean, readable, maintainable code
- **Architecture**: Proper file organization and separation of concerns
- **React Expertise**: Correct usage of hooks and React patterns
- **Problem Solving**: Ability to identify and fix issues
- **Documentation**: Clear explanation of decisions

## Reference Materials

- [Bulletproof React](https://github.com/alan2207/bulletproof-react)
- [React Query Key Manager](https://github.com/lukemorales/react-query-key-factory)
- [Elstar-lite Structure](https://github.com/ThemeNate/Elstar-lite/tree/main/src)

## Questions?

Feel free to reach out if you have any questions about the assessment. We're here to help!

Good luck! 🚀
