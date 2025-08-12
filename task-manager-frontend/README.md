# Task Manager Frontend

A decentralized task management application built with Next.js, Web3, and MetaMask integration.

## ✅ Checklist Status

### Core Requirements

- [x] **App Router + TypeScript**: `src/app/layout.tsx`, `src/app/page.tsx`, TypeScript enabled
- [x] **Server fetch with ISR**: Categories fetched server-side with 5-minute revalidation
- [x] **SWR for client state**: Tasks managed with SWR for caching and real-time updates
- [x] **Web3 integration**: MetaMask provider detection and Web3.js integration
- [x] **Clear directory structure**: Organized components, hooks, lib, and types
- [x] **Environment variables**: Proper usage of `NEXT_PUBLIC_*` variables
- [x] **UI states**: Loading, error, and empty states for all components
- [x] **Accessibility + responsive**: Tailwind CSS with responsive design

### File Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Home page with ISR categories fetch
├── components/
│   ├── AddTaskForm.tsx     # Task creation form
│   ├── CategoryFilter.tsx  # Category filtering
│   ├── ConnectWalletButton.tsx # MetaMask connection
│   ├── TaskItem.tsx        # Individual task display
│   ├── TaskList.tsx        # Task list with states
│   └── TransactionToast.tsx # Transaction feedback
├── hooks/
│   ├── useTasks.ts         # SWR-based task management
│   └── useWallet.ts        # MetaMask wallet state
├── lib/
│   ├── contract.ts         # Smart contract interactions
│   ├── fetcher.ts          # API client utilities
│   └── web3.ts            # Web3 service class
├── types/
│   ├── category.ts         # Category interface
│   └── task.ts            # Task interface
└── contracts/
    └── TaskManager.json    # Contract ABI
```

## 🚀 Quick Start

### 1. Environment Setup

Create `.env.local` file:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# Blockchain Configuration
NEXT_PUBLIC_NETWORK_RPC=http://127.0.0.1:7545
NEXT_PUBLIC_CHAIN_ID=1337
NEXT_PUBLIC_CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS_HERE
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Run Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration

### Smart Contract

- Update `NEXT_PUBLIC_CONTRACT_ADDRESS` with your deployed contract address
- Ensure your network RPC and Chain ID match your blockchain configuration

### API Endpoints

- Update `NEXT_PUBLIC_API_BASE_URL` to point to your backend API
- The app fetches categories server-side with ISR (5-minute cache)

## 🎯 Features

### Wallet Integration

- MetaMask connection with automatic network detection
- Network switching for unsupported chains
- Account change handling and auto-reconnection

### Task Management

- Create tasks with categories
- Mark tasks as completed
- Real-time updates with SWR
- Blockchain transaction feedback

### User Experience

- Loading states and error handling
- Responsive design with Tailwind CSS
- Toast notifications for transactions
- Empty state handling

## 🛠️ Development

### Adding New Features

1. Create components in `src/components/`
2. Add hooks in `src/hooks/` for business logic
3. Update types in `src/types/` for new data structures
4. Extend contract interactions in `src/lib/contract.ts`

### Testing

```bash
npm run test
npm run test:watch
```

### Building

```bash
npm run build
npm run start
```

## 📱 Responsive Design

The application is built with mobile-first responsive design:

- Mobile: Single column layout
- Tablet: Two-column grid
- Desktop: Full-width with optimal spacing

## 🔒 Security

- Environment variables for sensitive configuration
- Client-side validation for user inputs
- MetaMask signature verification for transactions
- No private keys stored in the application

## 🚨 Troubleshooting

### Common Issues

1. **MetaMask not connecting**

   - Ensure MetaMask is installed and unlocked
   - Check if the correct network is selected
   - Verify contract address configuration

2. **Tasks not loading**

   - Check blockchain network connection
   - Verify contract ABI matches deployed contract
   - Check browser console for errors

3. **Categories not showing**
   - Verify API endpoint configuration
   - Check backend service is running
   - Ensure proper CORS configuration

## 📄 License

This project is licensed under the MIT License.
