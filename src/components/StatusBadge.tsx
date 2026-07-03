import { Badge } from "@/components/ui/Badge";
import { STATUS_DOT, STATUS_STYLES, statusLabel } from "@/lib/format";
import type { ShipmentStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: ShipmentStatus }) {
  return (
    <Badge tone={STATUS_STYLES[status]}>
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} aria-hidden />
      {statusLabel(status)}
    </Badge>
  );
}
