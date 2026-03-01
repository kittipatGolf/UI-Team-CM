import type { UnitStatusDetail } from "../projectService";

type Props = {
  units: UnitStatusDetail[];
  checkFormColors?: { order: number; displayOrder?: number; color: string }[];
};

function getFloorLabelFromUnitNo(unitNo: string) {
  const s = (unitNo ?? "").trim();

  const fl = s.match(/FL[._\s-]?(\d+)/i);
  if (fl?.[1]) return fl[1];

  const m = s.match(/^(\d+)/);
  if (!m) return "-";

  const digits = m[1];

  if (digits.length === 3) return digits.slice(0, 1);

  if (digits.length >= 4) {
    const first2 = parseInt(digits.slice(0, 2), 10);
    const hasSuffixAlpha = /[A-Za-z]$/.test(s);
    return String(hasSuffixAlpha ? first2 + 1 : first2);
  }

  return digits;
}

function getFloorKey(u: UnitStatusDetail) {
  const floorName = (u.floorBlockName ?? "").trim().toUpperCase();
  const basementFromName = floorName.match(/\bB(\d+)\b/);
  if (basementFromName?.[1]) return `B${basementFromName[1]}`;

  const fromUnitNo = getFloorLabelFromUnitNo(u.unitNo).trim();
  if (fromUnitNo && fromUnitNo !== "-") return fromUnitNo.toUpperCase();

  const fb = (u.floorBlockNumber ?? "").trim();
  if (fb) return fb.toUpperCase();

  return "-";
}

function floorLevel(key: string) {
  const s = (key ?? "").trim().toUpperCase();

  const b = s.match(/^B(\d+)$/);
  if (b?.[1]) return -parseInt(b[1], 10);

  const n = parseInt(s, 10);
  if (!Number.isNaN(n)) return n;

  return -9999;
}

function isNumericLeading(unitNo: string) {
  return /^\d/.test((unitNo ?? "").trim());
}

function sortUnitNo(a: string, b: string) {
  const A = (a ?? "").trim();
  const B = (b ?? "").trim();

  const aNum = isNumericLeading(A);
  const bNum = isNumericLeading(B);

  if (aNum && !bNum) return -1;
  if (!aNum && bNum) return 1;

  if (aNum && bNum) {
    const na = parseInt(A.replace(/\D/g, ""), 10);
    const nb = parseInt(B.replace(/\D/g, ""), 10);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
  }

  return A.localeCompare(B, "th");
}

function hexToRgb(hex: string) {
  const h = (hex || "").replace("#", "").trim();
  if (h.length !== 6) return null;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if ([r, g, b].some((x) => Number.isNaN(x))) return null;
  return { r, g, b };
}

function isLight(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return true;
  const l = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
  return l > 0.72;
}

function normalizeHex(color?: string | null) {
  return (color ?? "").trim().toLowerCase();
}

function isPaintableColor(color?: string | null) {
  const c = normalizeHex(color);
  return !!c && c !== "#fff" && c !== "#ffffff";
}

function hasAnyStatus(u: UnitStatusDetail) {
  return (
    (u.maxActiveCheckFormOrder ?? 0) > 0 ||
    !!u.maxActiveCheckFormId ||
    !!u.maxActiveCheckFormStatus ||
    (u.inProgressCheckForms ?? 0) > 0 ||
    (u.completedCheckForms ?? 0) > 0 ||
    (u.completedCheckLists ?? 0) > 0
  );
}

function UnitCell({
  u,
  colorByOrder,
  displayOrderByOrder,
}: {
  u: UnitStatusDetail;
  colorByOrder: Map<number, string>;
  displayOrderByOrder: Map<number, number>;
}) {
  const no = (u.unitNo ?? "").trim();
  const showConditionalDot = u.overallStatus === "CONDITIONAL_PASS";

  const hasStatus = hasAnyStatus(u);
  const order = u.maxActiveCheckFormOrder ?? 0;
  const mappedColor = order > 0 ? colorByOrder.get(order) : undefined;

  // Paint only colors that come from check form mapping.
  const bgColor = isPaintableColor(mappedColor) ? mappedColor : undefined;
  const canPaint = hasStatus && !!bgColor;

  const number = canPaint ? (displayOrderByOrder.get(order) ?? order) : null;

  const bg = canPaint ? bgColor : undefined;
  const textColor =
    canPaint && bg ? (isLight(bg) ? "#0f172a" : "#ffffff") : undefined;

  return (
    <div
      className="relative inline-flex w-fit min-w-[42px] flex-col cursor-pointer"
      title={[
        `Unit: ${no}`,
        u.buildPhaseName ? `Phase: ${u.buildPhaseName}` : "",
        u.floorBlockNumber ? `Floor: ${u.floorBlockNumber}` : "",
        u.maxActiveCheckFormName ? `Active: ${u.maxActiveCheckFormName}` : "",
        u.overallStatus ? `Status: ${u.overallStatus}` : "",
      ]
        .filter(Boolean)
        .join("\n")}
    >
      <div className="w-full whitespace-nowrap rounded-t-lg border-b border-t border-gray-100 bg-gray-100 px-2 py-1 text-center text-sm font-normal leading-5">
        {no}
      </div>

      <div
        className="relative flex w-full items-center justify-center rounded-b-lg border border-gray-300 bg-white px-2 py-1 text-sm font-semibold leading-4"
        style={
          canPaint
            ? { backgroundColor: bg as string, color: textColor }
            : undefined
        }
      >
        {showConditionalDot && (
          <span
            className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full ring-2 ring-white"
            style={{ backgroundColor: "#ef4444" }}
          />
        )}
        {number ?? "-"}
      </div>
    </div>
  );
}

export default function UnitMatrixBoard({ units, checkFormColors }: Props) {
  const buildPhase = units[0]?.buildPhaseName ?? "";

  const colorByOrder = new Map<number, string>();
  const displayOrderByOrder = new Map<number, number>();

  for (const item of checkFormColors ?? []) {
    colorByOrder.set(item.order, item.color);
    displayOrderByOrder.set(item.order, item.displayOrder ?? item.order);
  }

  const rows = units.reduce<Record<string, UnitStatusDetail[]>>((acc, u) => {
    const k = getFloorKey(u);
    (acc[k] ??= []).push(u);
    return acc;
  }, {});

  const floorKeys = Object.keys(rows).sort((a, b) => {
    const la = floorLevel(a);
    const lb = floorLevel(b);
    if (la !== lb) return lb - la;
    return b.localeCompare(a);
  });

  return (
    <div className="w-full">
      {buildPhase && (
        <div className="mb-2 text-base font-bold text-gray-500">{buildPhase}</div>
      )}

      <div className="w-full overflow-x-auto rounded-lg bg-white overflow-hidden">
        <table className="w-full border-collapse">
          <tbody>
            {floorKeys.map((fk) => {
              const list = [...rows[fk]].sort((a, b) =>
                sortUnitNo(a.unitNo, b.unitNo)
              );

              return (
                <tr key={fk} className="transition-colors hover:bg-gray-50">
                  <td className="w-20 border-r border-gray-300 bg-gray-100 px-2 py-4 text-center font-semibold border-b border-gray-200">
                    {fk}
                  </td>

                  <td className="border-b border-gray-200 text-center py-4 px-4">
                    <div className="flex flex-wrap gap-2 px-4">
                      {list.map((u) => (
                        <UnitCell
                          key={u.unitId}
                          u={u}
                          colorByOrder={colorByOrder}
                          displayOrderByOrder={displayOrderByOrder}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
