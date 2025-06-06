import { useCallback } from "react";
import * as snarkjs from "snarkjs";

export function useSnarkJS() {
  const generateProof = useCallback(async (inputs: { age: number }) => {
    try {
      // Load the circuit
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        inputs,
        "/age_check_js/age_check.wasm",
        "/age_check_final.zkey"
      );

      return {
        proof,
        publicSignals,
      };
    } catch (error) {
      console.error("Error generating proof:", error);
      throw error;
    }
  }, []);

  const verifyProof = useCallback(async (proof: any, publicSignals: any) => {
    try {
      const vkey = await fetch("/verification_key.json").then((res) =>
        res.json()
      );
      const verified = await snarkjs.groth16.verify(vkey, publicSignals, proof);
      return verified;
    } catch (error) {
      console.error("Error verifying proof:", error);
      throw error;
    }
  }, []);

  return {
    generateProof,
    verifyProof,
  };
}
