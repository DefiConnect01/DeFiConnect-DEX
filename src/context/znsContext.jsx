// import { createContext, useState, useContext, useEffect, useCallback } from 'react';
// import {ZNSConnect} from 'zns-sdk';
// import { useAppKitAccount } from "@reown/appkit/react";
// import { createWalletClient, http} from 'viem';
// import { privateKeyToAccount } from 'viem/accounts';

// export const ZNSContext = createContext();

// export default function ZNSProvider({ children }) {
//   const { address, isConnected } = useAppKitAccount();
//   const [domain, setDomain] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [attemptsCount, setAttemptsCount] = useState(0);
//   const [hasAttemptedRegistration, setHasAttemptedRegistration] = useState(false);

//   const generateDomainName = useCallback((walletAddress, attemptIndex = 0) => {
//     if (!walletAddress) return '';
    
//     // Start with 0x and include the next 3 characters
//     let baseName = walletAddress.slice(0, 5).toLowerCase();
    
//     // Add a suffix based on attempt number if this isn't the first try
//     if (attemptIndex > 0) {
//       baseName += attemptIndex.toString();
//     }
    
//     return baseName;
//   }, []);

//   const registerDomain = useCallback(async (domainName, tld) => {
//     if (!isConnected || !address) return;

//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY;
//       const account = privateKeyToAccount(`0x${PRIVATE_KEY}`);
//       const credits = 0;
//       const referAddress = '0x0000000000000000000000000000000000000000';
      
//       const walletClient = createWalletClient({
//         account,
//         transport: http("https://rpc.creatorchain.io")
//       });

//       // Check if the domain is available
//       const isAvailable = await ZNSConnect().checkDomain(`${domainName}.${tld}`);
//       console.log(`Domain ${domainName}.${tld} is ${isAvailable ? 'Available' : 'Already Registered'}`);
      
//       // if (!isAvailable) {
//       //   throw new Error(`Domain ${domainName}.${tld} is already registered`);
//       // }

//       const result = await ZNSConnect().register(
//         walletClient,
//         [domainName],
//         [address],
//         tld,
//         referAddress,
//         credits
//       );
      
//       console.log("Register:", result);
//       setDomain(`${domainName}.${tld}`);
//       setHasAttemptedRegistration(true);
//     } catch (err) {
//       console.error("An error occurred during domain registration:", err);
//       setError(err.message || "Failed to register domain");
//       setHasAttemptedRegistration(true);
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   }, [isConnected, address]);

//   // Only try to register on initial connection - no auto-retry
//   useEffect(() => {
//     if (isConnected && address && !domain && !isLoading && !hasAttemptedRegistration) {
//       try {
//         const domainName = generateDomainName(address, attemptsCount);
//         console.log(`Attempting to register domain: ${domainName}.ceo (Attempt #${attemptsCount + 1})`);
        
//         registerDomain(domainName, 'ceo')
//           .catch(err => {
//             console.error("Registration failed:", err);
//             // We no longer auto-increment attempts here
//           });
//       } catch (err) {
//         console.error("Error preparing domain registration:", err);
//         setError("Failed to prepare domain registration");
//       }
//     }
//   }, [isConnected, address, domain, registerDomain, isLoading, generateDomainName, attemptsCount, hasAttemptedRegistration]);

//   // Reset everything when address changes
//   useEffect(() => {
//     if (address) {
//       setAttemptsCount(0);
//       setHasAttemptedRegistration(false);
//       setDomain('');
//       setError(null);
//     }
//   }, [address]);

//   // Function to manually trigger retry with a new domain name
//   const manualRetry = useCallback(() => {
//     if (!isConnected || !address) return;
    
//     // Increment attempts count for a new domain name
//     const newAttemptCount = attemptsCount + 1;
//     setAttemptsCount(newAttemptCount);
    
//     // Generate new domain name with the incremented counter
//     const domainName = generateDomainName(address, newAttemptCount);
//     console.log(`Manual retry: attempting to register ${domainName}.ceo`);
    
//     // Attempt registration with the new domain name
//     registerDomain(domainName, 'ceo').catch(err => {
//       console.error("Manual retry failed:", err);
//     });
//   }, [isConnected, address, attemptsCount, generateDomainName, registerDomain]);

//   return (
//     <ZNSContext.Provider value={{ 
//       domain, 
//       isLoading, 
//       error, 
//       registerDomain,
//       manualRetry  // Replaced attemptRetry with manualRetry
//     }}>
//       {children}
//     </ZNSContext.Provider>
//   );
// }


import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import {ZNSConnect} from 'zns-sdk';
import { useAppKitAccount } from "@reown/appkit/react";
import { createWalletClient, http} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

export const ZNSContext = createContext();

export default function ZNSProvider({ children }) {
  const { address, isConnected } = useAppKitAccount();
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [hasAttemptedRegistration, setHasAttemptedRegistration] = useState(false);

  const generateDomainName = useCallback((walletAddress, attemptIndex = 0) => {
    if (!walletAddress) return '';
    
    // Start with 0x and include the next 3 characters
    let baseName = walletAddress.slice(0, 5).toLowerCase();
    
    // Add a suffix based on attempt number if this isn't the first try
    if (attemptIndex > 0) {
      baseName += attemptIndex.toString();
    }
    
    return baseName;
  }, []);

  // Function to check if a wallet already has a domain
  const lookupDomainForWallet = useCallback(async (walletAddress) => {
    if (!walletAddress) return null;
    
    setIsLoading(true);
    try {
      // Use the ZNS SDK to look up domains for this wallet
      const walletAddy = walletAddress.slice(0, 5).toLowerCase
      const domains = await ZNSConnect().checkDomain(walletAddy.ceo);
      console.log("Lookup result:", domains);
      
      // if (domains && domains.length > 0) {
      //   // Return the first domain found for this wallet
      //   return domains[0];
      // }
      return domains;
     
    } catch (err) {
      console.error("Error looking up domains:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const registerDomain = useCallback(async (domainName, tld) => {
    if (!isConnected || !address) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY;
      const account = privateKeyToAccount(`0x${PRIVATE_KEY}`);
      const credits = 0;
      const referAddress = '0x0000000000000000000000000000000000000000';
      
      const walletClient = createWalletClient({
        account,
        transport: http("https://rpc.creatorchain.io")
      });

      // Check if the domain is available
      const isAvailable = await ZNSConnect().checkDomain(`${domainName}.${tld}`);
      console.log(`Domain ${domainName}.${tld} is ${isAvailable ? 'Available' : 'Already Registered'}`);
      
      // if (!isAvailable) {
      //   throw new Error(`Domain ${domainName}.${tld} is already registered`);
      // }

      const result = await ZNSConnect().register(
        walletClient,
        [domainName],
        [address],
        tld,
        referAddress,
        credits
      );
      
      console.log("Register:", result);
      setDomain(`${domainName}.${tld}`);
      
      // Store in localStorage to remember this registration
      try {
        const registeredDomains = JSON.parse(localStorage.getItem('registeredDomains') || '{}');
        registeredDomains[address.toLowerCase()] = `${domainName}.${tld}`;
        localStorage.setItem('registeredDomains', JSON.stringify(registeredDomains));
      } catch (e) {
        console.error("Could not save to localStorage:", e);
      }
      
      setHasAttemptedRegistration(true);
    } catch (err) {
      console.error("An error occurred during domain registration:", err);
      setError(err.message || "Failed to register domain");
      setHasAttemptedRegistration(true);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address]);

  // Check for existing domains or register new ones when wallet connects
  useEffect(() => {
    if (!isConnected || !address) return;
    
    const checkExistingOrRegister = async () => {
      // First, check localStorage for previously registered domains
      let existingDomain = null;
      try {
        const registeredDomains = JSON.parse(localStorage.getItem('registeredDomains') || '{}');
        existingDomain = registeredDomains[address.toLowerCase()];
      } catch (e) {
        console.error("Error reading from localStorage:", e);
      }
      
      if (existingDomain) {
        console.log(`Found previously registered domain: ${existingDomain}`);
        setDomain(existingDomain);
        return;
      }
      
      // Then try to look up domains from the blockchain
      setIsLoading(true);
      try {
        const lookupResult = await lookupDomainForWallet(address);
        if (lookupResult) {
          console.log(`Found existing domain: ${lookupResult}`);
          setDomain(lookupResult);
          
          // Store in localStorage for future reference
          try {
            const registeredDomains = JSON.parse(localStorage.getItem('registeredDomains') || '{}');
            registeredDomains[address.toLowerCase()] = lookupResult;
            localStorage.setItem('registeredDomains', JSON.stringify(registeredDomains));
          } catch (e) {
            console.error("Could not save to localStorage:", e);
          }
          
          return;
        }
      } catch (err) {
        console.error("Error during domain lookup:", err);
      } finally {
        setIsLoading(false);
      }
      
      // Only register a new domain if we haven't found an existing one
      if (!hasAttemptedRegistration && !domain) {
        try {
          const domainName = generateDomainName(address, attemptsCount);
          console.log(`No existing domain found. Attempting to register: ${domainName}.ceo`);
          
          registerDomain(domainName, 'ceo')
            .catch(err => {
              console.error("Registration failed:", err);
            });
        } catch (err) {
          console.error("Error preparing domain registration:", err);
          setError("Failed to prepare domain registration");
        }
      }
    };
    
    checkExistingOrRegister();
  }, [isConnected, address, domain, lookupDomainForWallet, registerDomain, generateDomainName, attemptsCount, hasAttemptedRegistration]);

  // Reset everything when address changes
  useEffect(() => {
    if (address) {
      setAttemptsCount(0);
      setHasAttemptedRegistration(false);
      setDomain('');
      setError(null);
    }
  }, [address]);

  // Function to manually trigger retry with a new domain name
  const manualRetry = useCallback(() => {
    if (!isConnected || !address) return;
    
    // Increment attempts count for a new domain name
    const newAttemptCount = attemptsCount + 1;
    setAttemptsCount(newAttemptCount);
    
    // Generate new domain name with the incremented counter
    const domainName = generateDomainName(address, newAttemptCount);
    console.log(`Manual retry: attempting to register ${domainName}.ceo`);
    
    // Attempt registration with the new domain name
    registerDomain(domainName, 'ceo').catch(err => {
      console.error("Manual retry failed:", err);
    });
  }, [isConnected, address, attemptsCount, generateDomainName, registerDomain]);

  return (
    <ZNSContext.Provider value={{ 
      domain, 
      isLoading, 
      error, 
      registerDomain,
      manualRetry
    }}>
      {children}
    </ZNSContext.Provider>
  );
}
