// src/services/znsService.js
import { ZNSConnect } from 'zns-sdk';

class ZNSService {
  constructor() {
    // Initialize any required properties
    this.tld = 'zns'; // Default TLD - can be configurable
  }

  async isWalletRegistered(address) {
    try {
      // Check if this wallet address already has a domain by resolving the address
      const result = await ZNSConnect.resolveAddress(this.tld, address);
      return !!result; // Return true if a domain is found
    } catch (error) {
      console.error("Error checking if wallet is registered:", error);
      return false;
    }
  }

  async getRegisteredDomain(address) {
    try {
      // Get domain for the address
      const result = await ZNSConnect.resolveAddress(this.tld, address);
      return result;
    } catch (error) {
      console.error("Error getting registered domain:", error);
      return null;
    }
  }

  async checkDomainAvailability(domain) {
    try {
      // The SDK checkDomain returns true if registered, so we invert it for availability
      const isRegistered = await ZNSConnect.checkDomain(`${domain}.${this.tld}`);
      return !isRegistered;
    } catch (error) {
      console.error("Error checking domain availability:", error);
      return false;
    }
  }

  async registerDomain(walletClient, domainName, ownerAddress) {
    try {
      // First check if domain is available
      const isAvailable = await this.checkDomainAvailability(domainName);
      if (!isAvailable) {
        throw new Error(`Domain ${domainName}.${this.tld} is already registered`);
      }

      // Get the price for registration
      const price = await ZNSConnect.getPrice([domainName], this.tld);
      console.log(`Registration price for ${domainName}.${this.tld}: ${price}`);

      // Register the domain
      const result = await ZNSConnect.register(
        walletClient, 
        [domainName],
        [ownerAddress],
        this.tld
      );

      console.log(`Domain ${domainName}.${this.tld} registered successfully`);
      return {
        success: true,
        domain: `${domainName}.${this.tld}`,
        result
      };
    } catch (error) {
      console.error("Error registering domain:", error);
      throw error;
    }
  }

  async getDomainMetadata(domain) {
    try {
      const metadata = await ZNSConnect.getMetadata(`${domain}.${this.tld}`);
      return metadata;
    } catch (error) {
      console.error("Error getting domain metadata:", error);
      return null;
    }
  }

  async getRegistryInfo(domain) {
    try {
      const registry = await ZNSConnect.getRegistry(`${domain}.${this.tld}`);
      return registry;
    } catch (error) {
      console.error("Error getting registry information:", error);
      return null;
    }
  }

  generateDefaultDomainName(address) {
    // Generate a domain name based on the wallet address
    // Example: first 6 chars of the address
    return address.substring(2, 8).toLowerCase();
  }
}

export default new ZNSService();