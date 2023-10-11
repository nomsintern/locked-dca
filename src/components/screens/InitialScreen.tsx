import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';

import Form from '../../components/Form';
import FormPairSelector from '../../components/FormPairSelector';
import { useAccounts } from '../../contexts/accounts';
import { useTokenContext } from '../../contexts/TokenContextProvider';
import { WalletModal } from '../../components/WalletComponents/components/WalletModal';
import { useSwapContext } from '../../contexts/SwapContext';
import { useScreenState } from '../../contexts/ScreenProvider';
import { useWalletPassThrough } from '../../contexts/WalletPassthroughProvider';
import OngoingDCA from '../OngoingDCA/OngoingDCA';

interface Props {
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const InitialScreen = ({ setIsWalletModalOpen, isWalletModalOpen }: Props) => {
  const { wallet } = useWalletPassThrough();
  const { accounts } = useAccounts();
  const { tokenMap } = useTokenContext();
  const {
    form,
    setForm,
    setErrors,
    formProps: { initialOutputMint, fixedOutputMint },
  } = useSwapContext();
  const { setScreen } = useScreenState();

  const walletPublicKey = useMemo(() => wallet?.adapter.publicKey?.toString(), [wallet?.adapter.publicKey]);

  const balance = useMemo(() => {
    return form.fromMint ? accounts[form.fromMint]?.balance || 0 : 0;
  }, [walletPublicKey, accounts, form.fromMint]);

  const [isDisabled, setIsDisabled] = useState(false);
  const loading = false;

  useEffect(() => {
    if (!form.fromValue || !form.fromMint || !form.toMint || loading) {
      setErrors({});
      setIsDisabled(true);
      return;
    }

    if (Number(form.fromValue) > balance) {
      setErrors({
        fromValue: { title: 'Insufficient balance', message: '' },
      });
      setIsDisabled(true);
      return;
    }

    setErrors({});
    setIsDisabled(false);
  }, [form, balance]);

  const [selectPairSelector, setSelectPairSelector] = useState<'fromMint' | 'toMint' | null>(null);

  const onSelectMint = useCallback(
    (tokenInfo: TokenInfo, approved: boolean = false) => {
      if (selectPairSelector === 'fromMint') {
        setForm((prev) => ({
          ...prev,
          fromMint: tokenInfo.address,
          fromValue: '',

          // Prevent same token to same token;
          ...(prev.toMint === tokenInfo.address ? { toMint: prev.fromMint } : undefined),
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          toMint: tokenInfo.address,
          toValue: '',

          // Prevent same token to same token;
          ...(prev.fromMint === tokenInfo.address ? { fromMint: prev.toMint } : undefined),
        }));
      }
      setSelectPairSelector(null);
    },
    [selectPairSelector],
  );

  const availableMints: TokenInfo[] = useMemo(() => {
    let result = [...tokenMap.values()];
    // On fixedOutputMint, prevent user from selecting the same token as output
    if (fixedOutputMint) {
      result = result.filter((item) => item.address !== initialOutputMint);
    }

    return result;
  }, [tokenMap, fixedOutputMint, initialOutputMint]);

  const onSubmitToConfirmation = useCallback(() => {
    setScreen('Confirmation');
  }, []);

  return (
    <>
      {/* Body */}
      <form className="flex flex-col h-full" onSubmit={onSubmitToConfirmation}>
        <Form
          onSubmit={onSubmitToConfirmation}
          isDisabled={isDisabled}
          setSelectPairSelector={setSelectPairSelector}
          setIsWalletModalOpen={setIsWalletModalOpen}
        />

        <OngoingDCA />
      </form>

      {selectPairSelector !== null ? (
        <div className="absolute top-0 left-0 h-full w-full bg-bonk-dark-brown rounded-lg overflow-hidden">
          <FormPairSelector
            onSubmit={onSelectMint}
            tokenInfos={availableMints}
            onClose={() => setSelectPairSelector(null)}
          />
        </div>
      ) : null}

      {isWalletModalOpen ? (
        <div className="absolute h-full w-full flex justify-center items-center bg-black/50 rounded-lg overflow-hidden">
          <WalletModal setIsWalletModalOpen={setIsWalletModalOpen} />
        </div>
      ) : null}
    </>
  );
};

export default InitialScreen;
