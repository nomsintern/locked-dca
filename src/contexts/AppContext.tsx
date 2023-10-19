import { AnchorProvider, IdlAccounts, Program } from '@coral-xyz/anchor';
import { DCA, Network } from '@jup-ag/dca-sdk';
import { SwapMode } from '@jup-ag/react-hook';
import { TokenInfo } from '@solana/spl-token-registry';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { BONK_MINT } from '../constants';
import { DcaIntegration, IDL } from '../dca/idl';
import { FormProps, IInit } from '../types';
import { useTokenContext } from './TokenContextProvider';
import { useWalletPassThrough } from './WalletPassthroughProvider';
import { useAccounts } from './accounts';
import Decimal from 'decimal.js';
import { findByUser, setupDCA } from '../dca';
import { BN } from 'bn.js';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { useQuery } from '@tanstack/react-query';
import { SignerWalletAdapter } from '@solana/wallet-adapter-base';
import { publicKey } from '@solana/buffer-layout-utils';

export interface IForm {
  fromMint: string;
  toMint: string;
  fromValue: string;
  toValue: string;
  selectedPlan: ILockingPlan['name'];
}

// active: DCA is still ongoing
// finished: DCA is finished, but unclaimed
// closed: DCA is finished and claimed
export type EscrowParsedState = 'active' | 'finished' | 'closed';
export type ParsedEscrow = {
  publicKey: PublicKey;
  account: IdlAccounts<DcaIntegration>['escrow'];
  parsed: {
    state: EscrowParsedState;
    account:
      | Awaited<ReturnType<DCA['getCurrentByUser']>>[0]['account']
      | Awaited<ReturnType<DCA['getClosedByUser']>>[0]['account'];
  } | null;
};
export interface ISwapContext {
  form: IForm;
  setForm: Dispatch<SetStateAction<IForm>>;
  errors: Record<string, { title: string; message: string }>;
  setErrors: Dispatch<
    SetStateAction<
      Record<
        string,
        {
          title: string;
          message: string;
        }
      >
    >
  >;
  fromTokenInfo?: TokenInfo | null;
  toTokenInfo?: TokenInfo | null;
  onSubmit: () => Promise<any>;
  onClose: (dca: PublicKey, escrow: PublicKey, inputMint: PublicKey, outputMint: PublicKey) => Promise<any>;
  formProps: FormProps;
  displayMode: IInit['displayMode'];
  scriptDomain: IInit['scriptDomain'];
  swapping: {
    totalTxs: number;
    txStatus?: {
      txid: string;
      txDescription: string;
      status: 'loading' | 'fail' | 'success';
    };
  };
  dca: {
    program: Program<DcaIntegration> | null;
    dcaClient: DCA | null;
    provider: AnchorProvider | null;
    escrows?: {
      active: ParsedEscrow[];
      finished: ParsedEscrow[];
      closed: ParsedEscrow[];
    };
  };
  refresh: () => void;
  reset: (props?: { resetValues: boolean }) => void;
}

export const initialSwapContext: ISwapContext = {
  form: {
    fromMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    toMint: BONK_MINT.toString(),
    fromValue: '',
    toValue: '',
    selectedPlan: '14 days',
  },
  setForm() {},
  errors: {},
  setErrors() {},
  fromTokenInfo: undefined,
  toTokenInfo: undefined,
  onSubmit: async () => null,
  onClose: async (dca: PublicKey, escrow: PublicKey, inputMint: PublicKey, outputMint: PublicKey) => null,
  displayMode: 'modal',
  formProps: {
    swapMode: SwapMode.ExactIn,
    initialAmount: undefined,
    fixedAmount: undefined,
    initialInputMint: undefined,
    fixedInputMint: undefined,
    initialOutputMint: undefined,
    fixedOutputMint: undefined,
  },
  scriptDomain: '',
  swapping: {
    totalTxs: 0,
    txStatus: undefined,
  },
  dca: {
    program: null,
    dcaClient: null,
    provider: null,
    escrows: {
      active: [],
      finished: [],
      closed: [],
    },
  },
  refresh() {},
  reset() {},
};

export type ILockingPlan = {
  //name: '5 minutes' | '14 days' | '30 days' | '90 days';
  name: '14 days' | '30 days' | '90 days';
  // minAmountInUSD: number;
  // maxAmountInUSD: number;
  incetivesPct: number;
  cycleSecondsApart: number;
  numberOfTrade: number;
  planDurationSeconds: number;
};

export const SECONDS_IN_MINUTE = 60; // 1 minute
export const SECONDS_IN_DAY = 86400; // 1 day
export const LOCKING_PLAN: ILockingPlan[] = [
  // {
  //   name: `5 minutes`,
  //   incetivesPct: 2,
  //   cycleSecondsApart: SECONDS_IN_MINUTE, // executed per minute
  //   numberOfTrade: 5,
  //   planDurationSeconds: SECONDS_IN_MINUTE * 5,
  // },
  {
    name: `14 days`,
    incetivesPct: 2,
    cycleSecondsApart: SECONDS_IN_DAY,
    numberOfTrade: 14,
    planDurationSeconds: SECONDS_IN_DAY * 14,
  },
  {
    name: `30 days`,
    incetivesPct: 5,
    cycleSecondsApart: SECONDS_IN_DAY,
    numberOfTrade: 30,
    planDurationSeconds: SECONDS_IN_DAY * 30,
  },
  {
    name: `90 days`,
    incetivesPct: 10,
    cycleSecondsApart: SECONDS_IN_DAY,
    numberOfTrade: 90,
    planDurationSeconds: SECONDS_IN_DAY * 90,
  },
];

export const SwapContext = createContext<ISwapContext>(initialSwapContext);

export function useAppContext(): ISwapContext {
  return useContext(SwapContext);
}

const LOCKED_DCA_PROGRAM_ID = new PublicKey('BoDCAjKTzVkunw5xx5r3EPWqe3uyNABJJjSRCJNoRmZa');
export const PRIORITY_NONE = 0; // No additional fee
export const PRIORITY_HIGH = 0.000_005; // Additional fee of 1x base fee
export const PRIORITY_TURBO = 0.000_5; // Additional fee of 100x base fee
export const PRIORITY_MAXIMUM_SUGGESTED = 0.01;

export const AppContext: FC<{
  displayMode: IInit['displayMode'];
  scriptDomain?: string;
  asLegacyTransaction: boolean;
  setAsLegacyTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  formProps?: FormProps;
  children: ReactNode;
}> = (props) => {
  const { displayMode, scriptDomain, formProps: originalFormProps, children } = props;

  const { tokenMap } = useTokenContext();
  const { wallet } = useWalletPassThrough();
  const { refresh: refreshAccount } = useAccounts();
  const walletPublicKey = useMemo(() => wallet?.adapter.publicKey, [wallet?.adapter.publicKey]);

  const formProps: FormProps = useMemo(
    () => ({ ...initialSwapContext.formProps, ...originalFormProps }),
    [originalFormProps],
  );

  const [form, setForm] = useState<IForm>({
    fromMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    toMint: BONK_MINT.toString(),
    fromValue: '',
    toValue: '',
    selectedPlan: '14 days',
  });
  const [errors, setErrors] = useState<Record<string, { title: string; message: string }>>({});

  const fromTokenInfo = useMemo(() => {
    const tokenInfo = form.fromMint ? tokenMap.get(form.fromMint) : null;
    return tokenInfo;
  }, [form.fromMint, tokenMap]);

  const toTokenInfo = useMemo(() => {
    const tokenInfo = form.toMint ? tokenMap.get(form.toMint) : null;
    return tokenInfo;
  }, [form.toMint, tokenMap]);

  const [totalTxs, setTotalTxs] = useState(0);
  const [txStatus, setTxStatus] = useState<{
    txid: string;
    txDescription: string;
    status: 'loading' | 'fail' | 'success';
  }>();

  const { refetch: refetchUserAccount } = useQuery(
    ['refresh-account'],
    () => {
      if (!walletPublicKey) return null;

      refreshAccount();
      return null;
    },
    {
      refetchInterval: 10_000,
    },
  );

  const { data: escrows, refetch: refetchEscrows } = useQuery(
    ['existing-locked-dca', walletPublicKey],
    async () => {
      if (!walletPublicKey) return undefined;

      const escrows = await findByUser(program, walletPublicKey);
      const parsedEscrows = await Promise.all(
        escrows.map(async (item) => {
          return {
            ...item,
            parsed: await (async () => {
              try {
                const [stillActive, finished] = await Promise.allSettled([
                  dcaClient.getCurrentByUser(item.publicKey),
                  dcaClient.getClosedByUser(item.publicKey),
                ]);

                if (stillActive.status === 'fulfilled' && stillActive.value.length > 0) {
                  return { state: 'active' as EscrowParsedState, account: stillActive.value[0].account };
                }

                if (finished.status === 'fulfilled' && finished.value.length > 0) {
                  return {
                    state: item.account.completed ? 'closed' : ('finished' as EscrowParsedState),
                    account: finished.value[0].account,
                  };
                }
              } catch (error) {}
              return null;
            })(),
          };
        }),
      );

      if (!parsedEscrows) {
        return undefined;
      }

      return parsedEscrows.reduce(
        (acc, item) => {
          if (!acc) return undefined;

          if (item.parsed?.state === 'active') acc.active.push(item);
          if (item.parsed?.state === 'finished') acc.finished.push(item);
          if (item.parsed?.state === 'closed') acc.closed.push(item);
          return acc;
        },
        { active: [], finished: [], closed: [] } as ISwapContext['dca']['escrows'],
      );
    },
    {
      refetchInterval: 10_000,
    },
  );

  const refreshAll = () => {
    refetchUserAccount();
    refetchEscrows();
  };

  const reset = useCallback(({ resetValues } = { resetValues: true }) => {
    setTimeout(() => {
      if (resetValues) {
        setForm({ ...initialSwapContext.form, ...formProps });
      }

      setErrors(initialSwapContext.errors);
      setTxStatus(initialSwapContext.swapping.txStatus);
      setTotalTxs(initialSwapContext.swapping.totalTxs);
      refreshAll();
    }, 0);
  }, []);

  const { signTransaction } = useWallet();
  const { connection } = useConnection();
  const provider = new AnchorProvider(connection, {} as any, AnchorProvider.defaultOptions());
  const program = new Program(IDL, LOCKED_DCA_PROGRAM_ID, provider);
  const dcaClient = new DCA(connection, Network.MAINNET);

  const onSubmit = useCallback(async () => {
    const plan = LOCKING_PLAN.find((plan) => plan.name === form.selectedPlan);

    if (!program || !dcaClient || !plan || !fromTokenInfo || !walletPublicKey) {
      throw new Error(`could not send transaction`)
    };

    let rawTransaction: Buffer

    try {
      const frequency = plan.numberOfTrade;
      const inAmount = new Decimal(form.fromValue).mul(10 ** fromTokenInfo.decimals);
      const userInTokenAccount = getAssociatedTokenAddressSync(
        new PublicKey(form.fromMint),
        walletPublicKey,
      );

      let tx = await setupDCA({
        program,
        dcaClient,
        connection,
        userPublicKey: walletPublicKey,
        userInTokenAccount,
        inputMint: new PublicKey(form.fromMint),
        outputMint: new PublicKey(form.toMint),
        inAmount: new BN(inAmount.toString()),
        inAmountPerCycle: new BN(inAmount.div(new Decimal(frequency)).floor().toString()),
        cycleSecondsApart: new BN(plan.cycleSecondsApart),
        planDurationSeconds: plan.planDurationSeconds,
      });

      tx.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;
      tx.feePayer = walletPublicKey;

      tx = await (wallet?.adapter as SignerWalletAdapter).signTransaction(tx);
      rawTransaction = tx.serialize();
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
      });

      setTotalTxs(1);
      setTxStatus({ txid, txDescription: 'Locking your tokens...', status: 'loading' });

      const result = await connection.confirmTransaction(txid, 'confirmed');
      if (result.value.err) throw result.value.err;

      setTxStatus({ txid, txDescription: 'Locking your tokens...', status: 'success' });
    } catch (error) {
      console.error(error);
      console.log({rawTransaction: rawTransaction?.toString('base64')})
      setTxStatus({ txid: '', txDescription: (error as any)?.message, status: 'fail' });
    } finally {
      refreshAll();
    }
  }, [form, walletPublicKey, wallet]);

  const onClose = useCallback(
    async (dca: PublicKey, escrow: PublicKey, inputMint: PublicKey, outputMint: PublicKey) => {

      if (!walletPublicKey) {
        throw new Error(`could not sign close tx`)
      };

      const [vaultSigner] = PublicKey.findProgramAddressSync([Buffer.from('vault')], program.programId )

      try {
        let tx = await program.methods
          .close()
          .accounts({
            vault: getAssociatedTokenAddressSync(BONK_MINT, vaultSigner, true),
            vaultSigner,
            inputMint,
            outputMint,
            user: new PublicKey(walletPublicKey),
            userTokenAccount: getAssociatedTokenAddressSync(
              outputMint,
              new PublicKey(walletPublicKey),
              false,
            ),
            escrow,
            dca,
            escrowInAta: getAssociatedTokenAddressSync(
              inputMint,
              escrow,
              true,
            ),
            escrowOutAta: getAssociatedTokenAddressSync(
              outputMint,
              escrow,
              true,
            ),
          })
          .transaction();

        tx.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;
        tx.feePayer = walletPublicKey;
        //tx = await signTransaction(tx);
        tx = await (wallet?.adapter as SignerWalletAdapter).signTransaction(tx);
        const rawTransaction = tx.serialize();
        const txid = await connection.sendRawTransaction(rawTransaction, {
          skipPreflight: true,
        });

        const result = await connection.confirmTransaction(txid, 'confirmed');
        if (result.value.err) throw result.value.err;

        return result;
      } catch (error) {
        throw error;
      } finally {
        refreshAll();
      }
    },
    [walletPublicKey, signTransaction],
  );

  return (
    <SwapContext.Provider
      value={{
        form,
        setForm,
        errors,
        setErrors,
        fromTokenInfo,
        toTokenInfo,
        onSubmit,
        onClose,
        reset,
        refresh: refreshAll,

        displayMode,
        formProps,
        scriptDomain,
        swapping: {
          totalTxs,
          txStatus,
        },
        dca: {
          program,
          dcaClient,
          provider,
          escrows,
        },
      }}
    >
      {children}
    </SwapContext.Provider>
  );
};
