import { useState } from "react";
import { useSnarkJS } from "../hooks/useSnarkJS";
import { useWeb3 } from "../providers/web3-provider";

interface ProofData {
  proof: any;
  publicSignals: any;
}

export default function AgeVerification() {
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);
  const [proof, setProof] = useState<ProofData | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<
    "none" | "loading" | "success" | "error"
  >("none");
  const { api, selectedAccount } = useWeb3();
  const { generateProof, verifyProof } = useSnarkJS();

  const handleGenerateProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!age || !selectedAccount) return;

    try {
      setLoading(true);
      setVerificationStatus("loading");
      const dateOfBirth = parseInt(age);
      const currentYear = new Date().getFullYear();
      const ageInYears = currentYear - dateOfBirth;

      // Generate ZK proof
      const proofResult = await generateProof({ age: ageInYears });
      setProof(proofResult);

      // Verify the proof locally first
      const isValid = await verifyProof(
        proofResult.proof,
        proofResult.publicSignals
      );

      if (!isValid) {
        throw new Error("Proof verification failed");
      }

      // If we have the API connection, submit to smart contract
      if (api) {
        // TODO: Call the smart contract verification function
        // const tx = await contract.verifyProof(proofResult.proof, proofResult.publicSignals);
        // await tx.wait();
      }

      setVerificationStatus("success");
    } catch (error) {
      console.error("Failed to generate or verify proof:", error);
      setVerificationStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Age Verification</h2>

      {verificationStatus === "success" && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-700 text-sm">
            Age verification successful! Your proof has been generated and
            verified.
          </p>
        </div>
      )}

      {verificationStatus === "error" && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">
            Failed to verify age. Please try again or contact support if the
            issue persists.
          </p>
        </div>
      )}

      <form onSubmit={handleGenerateProof} className="space-y-4">
        <div>
          <label
            htmlFor="age"
            className="block text-sm font-medium text-gray-700"
          >
            Year of Birth
          </label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter your year of birth"
            min="1900"
            max={new Date().getFullYear()}
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Your birth year will be used to generate a zero-knowledge proof of
            your age.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !selectedAccount || !age}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading || !selectedAccount || !age
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Generating Proof..." : "Generate Proof"}
        </button>
      </form>

      {proof && verificationStatus === "success" && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900">
            Generated Proof:
          </h3>
          <p className="text-sm text-gray-500 mb-2">
            This is your zero-knowledge proof that verifies your age without
            revealing your birth year.
          </p>
          <div className="mt-2 p-4 bg-gray-50 rounded-md overflow-x-auto">
            <code className="text-xs text-gray-800 break-all">
              {JSON.stringify(proof, null, 2)}
            </code>
          </div>
        </div>
      )}
    </div>
  );
}
