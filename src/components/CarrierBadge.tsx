import { Badge } from "@/components/ui/Badge";
import { CARRIER_STYLES, carrierLabel } from "@/lib/format";
import type { Carrier } from "@/lib/types";

export function CarrierBadge({ carrier }: { carrier: Carrier }) {
  return <Badge tone={CARRIER_STYLES[carrier]}>{carrierLabel(carrier)}</Badge>;
}
