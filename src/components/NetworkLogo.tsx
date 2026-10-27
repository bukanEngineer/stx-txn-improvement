import { PartnerLogo } from "stxdesign-sandbox";
import { ZilliqaLogo } from "stxdesign-sandbox/logos";

/** `PartnerLogo` only bundles the main chains; networks outside that set pass their logo explicitly. */
const EXTRA_LOGOS: Record<string, typeof ZilliqaLogo> = {
  zilliqa: ZilliqaLogo,
};

export function NetworkLogo({ network, size }: { network: string; size: number }) {
  const name = network.toLowerCase();
  return <PartnerLogo name={name} logo={EXTRA_LOGOS[name]} size={size} />;
}
