import React, { useMemo } from 'react';
import { useScreenState } from '../../contexts/ScreenProvider';
import { LOCKING_PLAN, useAppContext } from '../../contexts/AppContext';
import LeftArrowIcon from '../../icons/LeftArrowIcon';
import JupButton from '../JupButton';
import classNames from 'classnames';

const ConfirmationScreen = () => {
  const {
    form,
    fromTokenInfo,
    toTokenInfo,
    onSubmit: onSubmitLocking,
    dca: {},
  } = useAppContext();

  const { setScreen } = useScreenState();
  const onGoBack = () => {
    setScreen('Initial');
  };
  const onSubmit = () => {
    setScreen('Swapping');
    onSubmitLocking();
  };

  const plan = useMemo(() => LOCKING_PLAN.find((plan) => plan.name === form.selectedPlan), [form.selectedPlan]);

  return (
    <div className="flex flex-col h-full w-full py-4 px-2">
      <div className="flex w-full justify-between">
        <div className="text-white fill-current w-6 h-6 cursor-pointer" onClick={onGoBack}>
          <LeftArrowIcon width={24} height={24} />
        </div>

        <div className="text-white">Review Locking Plan</div>

        <div className=" w-6 h-6" />
      </div>

      <div
        className={classNames(
          'mt-4 space-y-2 border border-bonk-light-border rounded-xl p-3 text-white flex flex-col items-center text-sm',
        )}
      >
        <span className='font-semibold'>Plan: {plan?.name}</span>
        <span className="text-white/50">Bonus: {plan?.incetivesPct}%</span>
        <span>Your allocation</span>
        <span className='text-white/50'>{`${form.fromValue} ${fromTokenInfo?.symbol}`}</span>
      </div>

      <JupButton size="lg" className="w-full mt-4 disabled:opacity-50" bgClass='bg-bonk-primary-orange' type="button" onClick={onSubmit}>
        <span>Confirm</span>
      </JupButton>
    </div>
  );
};

export default ConfirmationScreen;
