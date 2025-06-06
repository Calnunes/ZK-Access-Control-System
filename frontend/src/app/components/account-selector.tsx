import * as React from "react";
import { useWeb3 } from "../providers/web3-provider";

interface AccountSelectorProps {
  className?: string;
}

export function AccountSelector({ className = "" }: AccountSelectorProps) {
  const { accounts, selectedAccount, setSelectedAccount } = useWeb3();

  if (!accounts.length) {
    return (
      <div className={`text-sm text-red-600 ${className}`}>
        No accounts found. Please install and connect a wallet.
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label
        htmlFor="account"
        className="block text-sm font-medium text-gray-700"
      >
        Select Account
      </label>
      <select
        id="account"
        value={selectedAccount?.address}
        onChange={(e) => {
          const account = accounts.find((a) => a.address === e.target.value);
          setSelectedAccount(account);
        }}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        {accounts.map((account) => (
          <option key={account.address} value={account.address}>
            {account.meta.name} ({account.address.slice(0, 6)}...
            {account.address.slice(-4)})
          </option>
        ))}
      </select>
    </div>
  );
}
