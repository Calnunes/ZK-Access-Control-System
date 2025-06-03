# ZK-Access-Control-System

This project implements a Zero-Knowledge proof system for age verification using circom and Solidity. The system allows users to prove they are above a certain age without revealing their actual age.

## Usage

1. Compile the circuit:
- Simply compiling our code.
```bash
cd age_check/
circom age_check.circom --r1cs --wasm --sym --c -l circomlib/
```

2. Generate a witness:
- The witness is our generated hash of the input.
- If the input is the ID, witness is a token proving our identity.
```bash
cd age_check_cpp/
make
cd ..
./age_check_cpp/age_check input.json witness.wtns
```

3. Powers Of Tau ceremony:
- This ceremony will create the zk verification key.
- Starting the ceremony (Creating a generic ptau file to which we'll add our circuit to later)
```bash
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
# More contributions, more secure
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v
```

- Phase 2 (Here we add custom logic - our circuit)
```bash
# Starting phase 2
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v
# Generating the zkey
snarkjs groth16 setup age_check.r1cs pot12_final.ptau age_check_0000.zkey
snarkjs zkey contribute age_check_0000.zkey age_check_final.zkey --name="1st Contributor"
```

3. Generate and verify the proof:

```bash
snarkjs groth16 prove age_check_final.zkey witness.wtns proof.json public.json

snarkjs zkey export verificationkey age_check_final.zkey verification_key.json
snarkjs groth16 verify verification_key.json public.json proof.json
```
