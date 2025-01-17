export type DcaIntegration = {
  "version": "0.1.0",
  "name": "dca_integration",
  "instructions": [
    {
      "name": "setupDca",
      "accounts": [
        {
          "name": "jupDcaProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "jupDca",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "jupDcaInAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "jupDcaOutAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "jupDcaEventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inputMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "outputMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowInAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowOutAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "applicationIdx",
          "type": "u64"
        },
        {
          "name": "inAmount",
          "type": "u64"
        },
        {
          "name": "inAmountPerCycle",
          "type": "u64"
        },
        {
          "name": "cycleFrequency",
          "type": "i64"
        },
        {
          "name": "planDurationSeconds",
          "type": "u32"
        }
      ]
    },
    {
      "name": "close",
      "accounts": [
        {
          "name": "inputMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "outputMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowInAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dca",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrowOutAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "airdrop",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "outputMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "adminTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createVault",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vaultSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "escrow",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "idx",
            "type": "u64"
          },
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "dca",
            "type": "publicKey"
          },
          {
            "name": "inputMint",
            "type": "publicKey"
          },
          {
            "name": "outputMint",
            "type": "publicKey"
          },
          {
            "name": "inputAmount",
            "type": "u64"
          },
          {
            "name": "outputAmount",
            "type": "u64"
          },
          {
            "name": "airdropAmount",
            "type": "u64"
          },
          {
            "name": "completed",
            "type": "bool"
          },
          {
            "name": "airdropped",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "planDurationSeconds",
            "type": "u32"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "DCANotClosed",
      "msg": "DCA Account not yet closed"
    },
    {
      "code": 6001,
      "name": "DCANotComplete",
      "msg": "DCA Not Complete"
    },
    {
      "code": 6002,
      "name": "Airdropped",
      "msg": "Already airdropped"
    },
    {
      "code": 6003,
      "name": "UnexpectedAirdropAmount",
      "msg": "Unexpected airdrop amount"
    },
    {
      "code": 6004,
      "name": "UnexpectedBalance",
      "msg": "Unexpected Balance"
    },
    {
      "code": 6005,
      "name": "InsufficientBalance",
      "msg": "Insufficient Balance"
    },
    {
      "code": 6006,
      "name": "MathOverflow",
      "msg": "Overflow"
    },
    {
      "code": 6007,
      "name": "InvalidPlanParameters",
      "msg": "Invalid Plan Parameters"
    }
  ]
};

export const IDL: DcaIntegration = {
  "version": "0.1.0",
  "name": "dca_integration",
  "instructions": [
    {
      "name": "setupDca",
      "accounts": [
        {
          "name": "jupDcaProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "jupDca",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "jupDcaInAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "jupDcaOutAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "jupDcaEventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inputMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "outputMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowInAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowOutAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "applicationIdx",
          "type": "u64"
        },
        {
          "name": "inAmount",
          "type": "u64"
        },
        {
          "name": "inAmountPerCycle",
          "type": "u64"
        },
        {
          "name": "cycleFrequency",
          "type": "i64"
        },
        {
          "name": "planDurationSeconds",
          "type": "u32"
        }
      ]
    },
    {
      "name": "close",
      "accounts": [
        {
          "name": "inputMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "outputMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowInAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dca",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrowOutAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "airdrop",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "outputMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "adminTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createVault",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vaultSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "escrow",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "idx",
            "type": "u64"
          },
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "dca",
            "type": "publicKey"
          },
          {
            "name": "inputMint",
            "type": "publicKey"
          },
          {
            "name": "outputMint",
            "type": "publicKey"
          },
          {
            "name": "inputAmount",
            "type": "u64"
          },
          {
            "name": "outputAmount",
            "type": "u64"
          },
          {
            "name": "airdropAmount",
            "type": "u64"
          },
          {
            "name": "completed",
            "type": "bool"
          },
          {
            "name": "airdropped",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "planDurationSeconds",
            "type": "u32"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "DCANotClosed",
      "msg": "DCA Account not yet closed"
    },
    {
      "code": 6001,
      "name": "DCANotComplete",
      "msg": "DCA Not Complete"
    },
    {
      "code": 6002,
      "name": "Airdropped",
      "msg": "Already airdropped"
    },
    {
      "code": 6003,
      "name": "UnexpectedAirdropAmount",
      "msg": "Unexpected airdrop amount"
    },
    {
      "code": 6004,
      "name": "UnexpectedBalance",
      "msg": "Unexpected Balance"
    },
    {
      "code": 6005,
      "name": "InsufficientBalance",
      "msg": "Insufficient Balance"
    },
    {
      "code": 6006,
      "name": "MathOverflow",
      "msg": "Overflow"
    },
    {
      "code": 6007,
      "name": "InvalidPlanParameters",
      "msg": "Invalid Plan Parameters"
    }
  ]
};
