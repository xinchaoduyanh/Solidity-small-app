# Code Structure & Organization

## Overview

This document describes the refactored code structure for better maintainability and organization.

## Directory Structure

```
src/
├── components/           # React components
│   ├── wallet/          # Wallet-related components (TODO: move from root)
│   ├── tasks/           # Task-related components (TODO: move from root)
│   ├── ui/              # Reusable UI components (shadcn/ui)
│   └── layout/          # Layout components
├── constants/            # Application constants
│   ├── app.ts           # General app configuration
│   ├── blockchain.ts    # Blockchain configuration
│   ├── categories.ts    # Category definitions
│   ├── ui.ts            # UI configuration
│   ├── wallet.ts        # Wallet configuration
│   └── index.ts         # Export all constants
├── contexts/             # React contexts
│   └── WalletContext.tsx
├── hooks/                # Custom React hooks
│   ├── useTasks.ts      # Task management
│   └── useWallet.ts     # Wallet management
├── lib/                  # Utility libraries
│   ├── utils/            # Common utilities
│   │   ├── blockchain.ts # Blockchain utilities
│   │   ├── ui.ts        # UI utilities
│   │   └── index.ts     # Export all utilities
│   ├── contract.ts       # Contract interactions
│   ├── web3.ts          # Web3 setup
│   └── ConnectionManager.ts
├── types/                # TypeScript type definitions
└── styles/               # Global styles
```

## Key Improvements

### 1. Constants Organization

- **Centralized Configuration**: All app constants are now in one place
- **Type Safety**: Constants use `as const` for better type inference
- **Easy Maintenance**: Change values in one place, affects entire app

### 2. Utility Functions

- **Reusable Logic**: Common operations extracted to utility functions
- **Better Testing**: Isolated functions are easier to test
- **DRY Principle**: No more duplicate code across components

### 3. Better Separation of Concerns

- **Wallet Logic**: Isolated in wallet-related files
- **Blockchain Logic**: Separated from UI components
- **UI Logic**: Focused on presentation, not business logic

### 4. Improved Type Safety

- **Consistent Interfaces**: Types are defined once and reused
- **Better Error Handling**: Centralized error messages
- **Configuration Objects**: Structured config with proper typing

## Usage Examples

### Using Constants

```typescript
import { APP_CONFIG, CATEGORIES, ERROR_MESSAGES } from "@/constants";

// Instead of hardcoded values
const refreshInterval = APP_CONFIG.BLOCKCHAIN.REFRESH_INTERVAL;
const categories = CATEGORIES;
const errorMsg = ERROR_MESSAGES.TASKS.CREATE_FAILED;
```

### Using Utilities

```typescript
import { formatAddress, getStatusColor } from "@/lib/utils";

// Instead of inline functions
const formattedAddress = formatAddress(task.owner);
const statusClass = getStatusColor("completed");
```

### Using Blockchain Utilities

```typescript
import {
  getWalletAccount,
  estimateAndSendTransaction,
} from "@/lib/utils/blockchain";

// Instead of repeated wallet logic
const account = await getWalletAccount();
const txHash = await estimateAndSendTransaction(method, account);
```

## Benefits

1. **Maintainability**: Easy to find and modify configuration
2. **Consistency**: Same values used across the application
3. **Testing**: Utilities can be tested independently
4. **Performance**: Better code splitting and tree shaking
5. **Developer Experience**: Clear structure and easy navigation
6. **Scalability**: Easy to add new features and configurations

## Next Steps

1. **Move Components**: Organize components into logical subdirectories
2. **Extract More Utilities**: Identify more common patterns
3. **Add Tests**: Write tests for utility functions
4. **Documentation**: Add JSDoc comments to functions
5. **Performance**: Optimize imports and bundle size

## Migration Notes

- All existing functionality preserved
- No breaking changes to component APIs
- Constants can be imported from `@/constants`
- Utilities can be imported from `@/lib/utils`
- Backward compatibility maintained
