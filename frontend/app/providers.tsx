'use client';

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { http, WagmiProvider } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

const rainbowConfig = getDefaultConfig({
  appName: 'Next Base',
  projectId: process.env.NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID as string,
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(
      process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL as string
    ),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={rainbowConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
