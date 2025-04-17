import React from "react";
import { createAppKit, modal, useAppKitAccount } from "@reown/appkit/react";
import { useAccount, WagmiProvider } from "wagmi";
import { baseSepolia, base } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import cybaLogo from '../assets/creator.png';
import u2uLogo from '../assets/logoU2u.jpg';
import stores from "../stores";


// Function to convert SVG to blob URL
async function createBlobUrl(svgPath) {
  try {
    const response = await fetch(svgPath);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    // console.error('Error creating blob URL:', error);
    return null;
  }
}

// Create networks configuration
const createNetworks = async () => {
  const cybaLogoUrl = await createBlobUrl(cybaLogo);
  // const u2ulogoUrl  = await ccreateBlobUrl(u2uLogo)

  TODO: `Uncomment and update creator mainnet below`
  // const creator = {
  //   id: "eip155:66665",
  //   name: "Creator",
  //   chainId: 66665,
  //   chainNamespace: "eip155",
  //   currency: "ETH",
  //   explorerUrl: "https://explorer.creatorchain.io/stats",
  //   rpcUrl: "https://rpc.creatorchain.io",
  //   imagesrc: cybaLogoUrl
  // };

  const creatorTestnet = {
    id: "eip155:66665",
    name: "Creator Testnet",
    chainId: 66665,
    chainNamespace: "eip155",
    currency: "ETH",
    explorerUrl: "https://explorer.creatorchain.io/stats",
    rpcUrl: "https://rpc.creatorchain.io",
    // rpcUrl: `https://66665.rpc.thirdweb.com/${import.meta.env.VITE_THIRDWEB_SECRET_KEY}`,
    imagesrc: "/creator.png"
  };

  const u2uTestnet = {
    id: "eip155:2484",
    name: "U2U Network Nebulas",
    chainId: 2484,
    chainNamespace: "eip155",
    currency: "U2U",
    explorerUrl: "https://explorer.creatorchain.io/stats",
    rpcUrl: "https://rpc-nebulas-testnet.u2u.xyz",
    // rpcUrl: https://66665.rpc.thirdweb.com/${import.meta.env.VITE_THIRDWEB_SECRET_KEY},
    imagesrc: "/logoU2u.jpeg"
  };

 

  return [u2uTestnet, creatorTestnet];
};
const AppKitProvider = ({ children }) => {
  const [networks, setNetworks] = React.useState([]);
  const queryClient = new QueryClient();
  const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;

  React.useEffect(() => {
    const initializeNetworks = async () => {
      const networkList = await createNetworks();
      setNetworks(networkList);
    };
    initializeNetworks();
  }, []);

  // Only create the adapter once networks are loaded
  const wagmiAdapter = React.useMemo(() => {
    if (networks.length === 0) return null;
    return new WagmiAdapter({
      ssr: true,
      networks,
      projectId,
    });
  }, [networks, projectId]);

  // Only create the AppKit once the adapter is ready
  React.useEffect(() => {
    if (!wagmiAdapter) return;

    createAppKit({
      adapters: [wagmiAdapter],
      networks,
      metadata: {
        name: "DefiConnect Dex",
        description: "ve-(3,3) dex on Creator",
        url: import.meta.env.VITE_WEBSITE_URL,
        icons: ["https://avatars.githubusercontent.com/u/179229932"],
      },
      projectId,
      features: {
        analytics: true,
      },
    });
  }, [wagmiAdapter]);

  if (!wagmiAdapter) return null;

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};

export default AppKitProvider;