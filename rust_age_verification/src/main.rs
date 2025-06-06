use bellman::{
    Circuit,
    ConstraintSystem,
    SynthesisError,
    groth16::{
        generate_random_parameters,
        prepare_verifying_key,
        create_random_proof,
        verify_proof,
    },
};
use bls12_381::{Bls12, Scalar as Fr};
use rand::rngs::OsRng;

// Our age verification circuit
struct AgeVerificationCircuit {
    // Private input: actual age
    age: Option<Fr>,
    // Public input: minimum required age
    min_age: Fr,
}

impl Circuit<Fr> for AgeVerificationCircuit {
    fn synthesize<CS: ConstraintSystem<Fr>>(
        self,
        cs: &mut CS,
    ) -> Result<(), SynthesisError> {
        // Allocate the private input (actual age)
        let age_var = cs.alloc(
            || "age",
            || self.age.ok_or(SynthesisError::AssignmentMissing),
        )?;

        // Allocate the public input (minimum age)
        let min_age_var = cs.alloc_input(
            || "minimum age",
            || Ok(self.min_age),
        )?;

        // Constraint: (age - min_age) * (age - min_age) = difference_squared
        // This ensures age >= min_age
        let difference_squared = cs.alloc(
            || "difference squared",
            || {
                let age = self.age.ok_or(SynthesisError::AssignmentMissing)?;
                Ok((age - self.min_age) * (age - self.min_age))
            },
        )?;

        // First constraint: difference_squared = (age - min_age)^2
        cs.enforce(
            || "difference squared constraint",
            |lc| lc + age_var - min_age_var,
            |lc| lc + age_var - min_age_var,
            |lc| lc + difference_squared,
        );

        Ok(())
    }
}

fn main() {
    // Generate parameters
    let rng = &mut OsRng;
    
    // Set minimum age requirement (e.g., 18)
    let min_age = Fr::from(18u64);

    // Create an empty circuit for parameter generation
    let empty_circuit = AgeVerificationCircuit {
        age: None,
        min_age,
    };

    println!("Generating parameters...");
    let params = generate_random_parameters::<Bls12, _, _>(empty_circuit, rng)
        .expect("Parameter generation failed");

    // Prepare the verification key
    let pvk = prepare_verifying_key(&params.vk);

    // Example: Create a proof for someone who is 25 years old
    let prover_age = Fr::from(25u64);
    let circuit = AgeVerificationCircuit {
        age: Some(prover_age),
        min_age,
    };

    println!("Creating proof...");
    let proof = create_random_proof(circuit, &params, rng)
        .expect("Proof generation failed");

    // Verify the proof
    let public_inputs = vec![min_age];
    
    println!("Verifying proof...");
    match verify_proof(&pvk, &proof, &public_inputs) {
        Ok(_) => {
            println!("Proof verification successful!");
            println!("The proof successfully shows that the person is at least {} years old!", 18);
        },
        Err(e) => {
            println!("Proof verification failed: {:?}", e);
        }
    }
}
