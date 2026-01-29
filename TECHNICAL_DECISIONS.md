# Technical Decisions

## State Management: Zustand

We have chosen **Zustand** for global state management in this application.

### Reasoning:
1.  **Simplicity**: Zustand offers a minimal API that is easy to understand and quick to implement compared to Redux or Context API boilerplate.
2.  **Performance**: It avoids unnecessary re-renders by allowing components to subscribe to specific slices of state.
3.  **Flexibility**: It works well outside of React components (if needed) and integrates seamlessly with devtools.
4.  **Fit for MVP**: For the current requirements (onboarding flow, potentially global user settings), it provides the right balance of structure and agility.

### Usage:
- Stores are located in `app/store/`.
- Hooks follow the naming convention `use[Name]Store`.
