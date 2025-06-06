"use client";

import Image from "next/image";
import { Web3Provider } from "../providers/web3-provider";
import AgeVerification from "./age-verification";
import { AccountSelector } from "./account-selector";

export default function App() {
  return (
    <Web3Provider>
      <div className="min-h-screen bg-gray-100">
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Zero-Knowledge Age Verification
              </h1>
              <p className="text-lg text-gray-600">
                Prove your age without revealing your birth date
              </p>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="space-y-8">
                {/* Wallet Connection */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Connect Wallet
                  </h2>
                  <AccountSelector className="w-full" />
                </div>

                {/* Age Verification Form */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Generate Proof
                  </h2>
                  <AgeVerification />
                </div>
              </div>
            </div>

            {/* Information Section */}
            <div className="mt-12 text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                How it Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-indigo-600 mb-4">
                    <svg
                      className="h-8 w-8 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    1. Connect Wallet
                  </h3>
                  <p className="text-gray-600">
                    Connect your Web3 wallet to get started with the
                    verification process
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-indigo-600 mb-4">
                    <svg
                      className="h-8 w-8 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    2. Enter Birth Year
                  </h3>
                  <p className="text-gray-600">
                    Input your birth year to generate a zero-knowledge proof
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-indigo-600 mb-4">
                    <svg
                      className="h-8 w-8 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    3. Verify Age
                  </h3>
                  <p className="text-gray-600">
                    Generate and submit your proof to verify your age without
                    revealing your birth date
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Web3Provider>
  );
}
