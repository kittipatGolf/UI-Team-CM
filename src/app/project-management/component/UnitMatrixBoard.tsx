import type { UnitStatusDetail } from "../projectService";

type Props = {
  units: UnitStatusDetail[];
};

function getFloorLabelFromUnitNo(unitNo: string) {
  const s = (unitNo ?? "").trim();

  const fl = s.match(/FL[._\s-]?(\d+)/i);
  if (fl?.[1]) return fl[1];

  const m = s.match(/^(\d+)/);
  if (!m) return "—";

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
  const fb = (u.floorBlockNumber ?? "").trim();
  if (fb) return fb.toUpperCase();

  return getFloorLabelFromUnitNo(u.unitNo);
}

function floorLevel(key: string) {
  const s = (key ?? "").trim().toUpperCase();

  // B1, B2 ...
  const b = s.match(/^B(\d+)$/);
  if (b?.[1]) return -parseInt(b[1], 10);

  const n = parseInt(s, 10);
  if (!Number.isNaN(n)) return n;

  return -9999; // unknown
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

// ✅ ตัวนี้เอาไว้ตัดสินว่า "มีสถานะจริง" ไหม
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

function UnitCell({ u }: { u: UnitStatusDetail }) {
  const no = (u.unitNo ?? "").trim();

  // ✅ เลขในช่องล่าง
  const number =
    (u.maxActiveCheckFormOrder ?? 0) > 0
      ? u.maxActiveCheckFormOrder
      : (u.completedCheckForms ?? 0) > 0
      ? u.completedCheckForms
      : null;

  const showConditionalDot = u.overallStatus === "CONDITIONAL_PASS";

  // ✅ ถ้า "ไม่มี status จริง" → ต้องเป็นขาว (ไม่ทาสี)
  const hasStatus = hasAnyStatus(u);
  const canPaint = hasStatus && !!u.statusColor && u.statusColor !== "#ffffff";

  const bg = canPaint ? u.statusColor : undefined; // undefined => ใช้ bg-white เดิม
  const textColor =
    canPaint && bg ? (isLight(bg) ? "#0f172a" : "#ffffff") : undefined;

  return (
    <div
      className="relative inline-flex w-fit min-w-[48px] flex-col cursor-pointer rounded-lg border border-gray-300"
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
      {showConditionalDot && (
        <span
          className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full ring-2 ring-white"
          style={{ backgroundColor: "#ef4444" }}
        />
      )}

      {/* ✅ บน: เทา และ "ไม่มีเส้นขอบ" */}
      <div className="w-full whitespace-nowrap rounded-t-lg bg-gray-100 px-2 py-1 text-center text-xs font-semibold">
        {no}
      </div>

      {/* ✅ ล่าง: ขาวถ้าไม่มี status / ถ้ามี status ค่อยทาสี */}
      <div
        className="flex h-7 w-full items-center justify-center rounded-b-lg bg-white text-sm font-semibold"
        style={
          canPaint
            ? { backgroundColor: bg as string, color: textColor }
            : undefined
        }
      >
        {number ?? "-"}
      </div>
    </div>
  );
}

export default function UnitMatrixBoard({ units }: Props) {
  const buildPhase = units[0]?.buildPhaseName ?? "";

  const rows = units.reduce<Record<string, UnitStatusDetail[]>>((acc, u) => {
    const k = getFloorKey(u);
    (acc[k] ??= []).push(u);
    return acc;
  }, {});

  // ✅ sort ชั้น: 8..1..B1..B2
  const floorKeys = Object.keys(rows).sort((a, b) => {
    const la = floorLevel(a);
    const lb = floorLevel(b);
    if (la !== lb) return lb - la;
    return b.localeCompare(a);
  });

  return (
    <div className="w-full">
      {buildPhase && (
        <div className="mb-2 text-base font-bold text-gray-500">
          {buildPhase}
        </div>
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

                  <td className="px-4 py-4 border-b border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {list.map((u) => (
                        <UnitCell key={u.unitId} u={u} />
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