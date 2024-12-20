import React from "react";
import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import { baseSepolia, base } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import cybaLogo from '../assets/cyba_dark.svg';

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

  // const mainnet = {
  //   id: "eip155:1",
  //   name: "Ethereum",
  //   chainId: 1,
  //   chainNamespace: "eip155",
  //   currency: "ETH",
  //   explorerUrl: "https://etherscan.io",
  //   rpcUrl: "https://autumn-lively-mound.quiknode.pro/7f6055160fc5bab5f5dad0687e44fbf92e187fad"
  // };


const onlylayer = {
  id: "eip155:5820948",
  name: "OnlyLayer",
  chainId: 5820948,
  chainNamespace: "eip155",
  currency: "ONLY",
  explorerUrl: "https://onlyscan.info",
  rpcUrl: "https://onlylayer.org"
}

  const creator = {
    id: "eip155:66665",
    name: "Creator",
    chainId: 66665,
    chainNamespace: "eip155",
    currency: "ETH",
    explorerUrl: "https://explorer.creatorchain.io/stats",
    rpcUrl: "https://rpc.creatorchain.io"
  };

  const cybria = {
    id: "eip115:6661",
    name: "Cybria",
    chainId: 6661,
    chainNamespace: "eip155",
    currency: "CYBA",
    explorerUrl: "https://explorer.cybascan.io",
    rpcUrl: "https://rpc-mainnet.cybria.io",
    imagesrc: cybaLogoUrl
  };

  const cybriaTestnet = {
    id: "eip115:6666",
    name: "Cybria Testnet",
    chainId: 6666,
    chainNamespace: "eip155",
    currency: "CYBA",
    explorerUrl: "https://explorer.cybascan.io",
    rpcUrl: "https://l2-rpc.cybascan.io",
    imagesrc: cybaLogoUrl
  };

  return [onlylayer, creator, cybria, cybriaTestnet];
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
        name: "AppKit",
        description: "AppKit Example",
        url: "https://cyba-bridge.vercel.app/",
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