import React, { useMemo } from 'react';
import { useAppContext } from 'src/contexts/AppContext';

import JupiterLogo from '../icons/JupiterLogo';
import { WalletButton } from './WalletComponents';
import RefreshSVG from 'src/icons/RefreshSVG';

const Header: React.FC<{ setIsWalletModalOpen(toggle: boolean): void }> = ({ setIsWalletModalOpen }) => {
  const { form, refresh } = useAppContext();

  const jupiterDirectLink = useMemo(() => {
    return `https://jup.ag/swap/${form.fromMint}-${form.toMint}?inAmount=${form.fromValue}`;
  }, [form]);

  return (
    <div className="mt-2 h-7 pl-3 pr-2">
      <div className="w-full flex items-center justify-between ">
        <a href={jupiterDirectLink} target={'_blank'} rel="noreferrer noopener" className="flex items-center space-x-2">
          <JupiterLogo width={24} height={24} />
          <span className="font-bold text-sm text-white">Jupiter</span>
        </a>

        <div className="flex space-x-1 items-center">
          <button
            type="button"
            className="p-2 h-7 w-7 flex items-center justify-center border rounded-full border-white/10 bg-black/10 text-white/30 fill-current"
            onClick={refresh}
          >
            <RefreshSVG />
          </button>

          <WalletButton setIsWalletModalOpen={setIsWalletModalOpen} />
        </div>
      </div>
    </div>
  );
};

export default Header;
