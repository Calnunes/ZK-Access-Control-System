"use client";

import { ApiPromise, WsProvider } from "@polkadot/api";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { createContext, useContext, useEffect, useState } from "react";

interface Web3ContextType {
  api: ApiPromise | null;
  accounts: any[];
  selectedAccount: any;
  setSelectedAccount: (account: any) => void;
  connecting: boolean;
}

const Web3Context = createContext<Web3ContextType>({
  api: null,
  accounts: [],
  selectedAccount: null,
  setSelectedAccount: () => {},
  connecting: true,
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [connecting, setConnecting] = useState(true);

  useEffect(() => {
    let isSubscribed = true;

    const connectToChain = async () => {
      try {
        // Initialize connection to chain
        const wsProvider = new WsProvider("ws://127.0.0.1:9944");
        const api = await ApiPromise.create({ provider: wsProvider });
        if (!isSubscribed) return;
        setApi(api);

        // Enable web3 extensions
        const extensions = await web3Enable("ZK Age Verification");
        if (!isSubscribed) return;

        if (extensions.length === 0) {
          console.warn("No web3 extension found");
          setConnecting(false);
          return;
        }

        // Get accounts
        const accounts = await web3Accounts();
        if (!isSubscribed) return;

        setAccounts(accounts);
        if (accounts.length > 0) {
          setSelectedAccount(accounts[0]);
        }
      } catch (error) {
        console.error("Failed to connect:", error);
      } finally {
        if (isSubscribed) {
          setConnecting(false);
        }
      }
    };

    connectToChain();

    return () => {
      isSubscribed = false;
      if (api) {
        api.disconnect();
      }
    };
  }, []);

  return (
    <Web3Context.Provider
      value={{ api, accounts, selectedAccount, setSelectedAccount, connecting }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}
