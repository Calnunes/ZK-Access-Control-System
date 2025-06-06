#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
pub mod age_token {
    use ink::prelude::vec::Vec;
    use ink::storage::Mapping;

    /// A token that represents age verification
    #[ink(storage)]
    pub struct AgeToken {
        /// Token name
        name: Vec<u8>,
        /// Token symbol
        symbol: Vec<u8>,
        /// Mapping from token ID to owner account
        token_owner: Mapping<Id, AccountId>,
        /// Mapping from owner to number of owned tokens
        owned_tokens_count: Mapping<AccountId, u32>,
        /// Mapping from token ID to approved account
        token_approvals: Mapping<Id, AccountId>,
        /// Mapping from owner to operator approvals
        operator_approvals: Mapping<(AccountId, AccountId), bool>,
        /// Current token id
        next_id: Id,
        /// The ZK verifier contract address
        verifier: AccountId,
    }

    /// The token ID type
    pub type Id = u32;

    /// Event emitted when a token transfer occurs
    #[ink(event)]
    pub struct Transfer {
        #[ink(topic)]
        from: Option<AccountId>,
        #[ink(topic)]
        to: Option<AccountId>,
        #[ink(topic)]
        id: Id,
    }

    /// Event emitted when a token approve occurs
    #[ink(event)]
    pub struct Approval {
        #[ink(topic)]
        from: AccountId,
        #[ink(topic)]
        to: AccountId,
        #[ink(topic)]
        id: Id,
    }

    /// Event emitted when an operator is approved or disapproved
    #[ink(event)]
    pub struct ApprovalForAll {
        #[ink(topic)]
        owner: AccountId,
        #[ink(topic)]
        operator: AccountId,
        approved: bool,
    }

    #[derive(scale::Encode, scale::Decode, Debug, PartialEq, Eq, Copy, Clone)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        NotOwner,
        NotApproved,
        TokenExists,
        TokenNotFound,
        CannotInsert,
        CannotRemove,
        CannotFetchValue,
        NotAllowed,
        InvalidVerifier,
    }

    impl AgeToken {
        #[ink(constructor)]
        pub fn new(verifier_address: AccountId) -> Self {
            let name = Vec::from("Age Verification Token");
            let symbol = Vec::from("AGE");
            
            Self {
                name,
                symbol,
                token_owner: Mapping::default(),
                owned_tokens_count: Mapping::default(),
                token_approvals: Mapping::default(),
                operator_approvals: Mapping::default(),
                next_id: 0,
                verifier: verifier_address,
            }
        }

        /// Mint a new token when age verification passes
        #[ink(message)]
        pub fn mint_verified(&mut self, 
            proof_a: Vec<u8>,
            proof_b: Vec<u8>,
            proof_c: Vec<u8>,
            public_inputs: Vec<u8>
        ) -> Result<(), Error> {
            // Verify the proof using the verifier contract
            let verified = self.verify_age(proof_a, proof_b, proof_c, public_inputs)?;
            
            if !verified {
                return Err(Error::NotAllowed);
            }

            let to = self.env().caller();
            let id = self.next_id;

            self.add_token_to(to, id)?;
            self.next_id += 1;

            self.env().emit_event(Transfer {
                from: None,
                to: Some(to),
                id,
            });

            Ok(())
        }

        /// Verify age using the verifier contract
        fn verify_age(
            &self,
            proof_a: Vec<u8>,
            proof_b: Vec<u8>,
            proof_c: Vec<u8>,
            public_inputs: Vec<u8>,
        ) -> Result<bool, Error> {
            // Call the verifier contract
            let verifier_result = build_call::<Environment>()
                .call(self.verifier)
                .gas_limit(5000)
                .exec_input(
                    ExecutionInput::new(Selector::new(ink::selector_bytes!("verify_proof")))
                        .push_arg(proof_a)
                        .push_arg(proof_b)
                        .push_arg(proof_c)
                        .push_arg(public_inputs)
                )
                .returns::<bool>()
                .invoke();

            match verifier_result {
                Ok(result) => Ok(result),
                Err(_) => Err(Error::InvalidVerifier),
            }
        }

        /// Add a token to an account
        fn add_token_to(&mut self, to: AccountId, id: Id) -> Result<(), Error> {
            self.token_owner.insert(id, &to);
            let count = self.owned_tokens_count.get(to).unwrap_or(0);
            self.owned_tokens_count.insert(to, &(count + 1));
            Ok(())
        }

        /// Get the owner of a token
        #[ink(message)]
        pub fn owner_of(&self, id: Id) -> Option<AccountId> {
            self.token_owner.get(id)
        }

        /// Check if an account owns a token
        #[ink(message)]
        pub fn has_valid_token(&self, account: AccountId) -> bool {
            self.owned_tokens_count.get(account).unwrap_or(0) > 0
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn mint_works() {
            // Create mock verifier address
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            let contract = AgeToken::new(accounts.bob);

            // Test minting (in real scenario this would verify the proof)
            let proof_a = Vec::from([1, 2, 3]);
            let proof_b = Vec::from([4, 5, 6]);
            let proof_c = Vec::from([7, 8, 9]);
            let public_inputs = Vec::from([10, 11, 12]);

            assert!(contract.mint_verified(proof_a, proof_b, proof_c, public_inputs).is_ok());
            assert!(contract.has_valid_token(accounts.alice));
        }
    }
}
