import { AnchorProvider, IdlAccounts, Program } from '@coral-xyz/anchor';
import { DCA, Network } from '@jup-ag/dca-sdk';
import { SwapMode } from '@jup-ag/react-hook';
import { Connection, PublicKey } from '@solana/web3.js';

import { DcaIntegration, IDL } from './dca/idl';


const LOCKED_DCA_PROGRAM_ID = new PublicKey('5mrhiqFFXyfJMzAJc5vsEQ4cABRhfsP7MgSVgGQjfcrR');

async function main() {

    const connection = new Connection("https://mainnet.helius-rpc.com/?api-key=41b9b3ea-935c-4185-9797-db61221ad81b")
    const provider = new AnchorProvider(connection, {} as any, AnchorProvider.defaultOptions());
  const program = new Program(IDL, LOCKED_DCA_PROGRAM_ID, provider);


  const accts = await program.account.escrow.all()


  let withNum = accts.map( a => {return {input: a.account.inputAmount.toString(), output: a.account.outputAmount.toString(), ...a}})
 console.log(withNum)
  console.log(accts)
  console.log(accts.length)

}


main();