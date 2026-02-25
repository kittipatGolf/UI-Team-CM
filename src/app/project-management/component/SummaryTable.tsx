"use client";

export type SummaryRow = {
  projectName: string;
  totalUnits: number;
  structurePct: number; // %
  roomPct: number; // %
  remaining: number;
};

type Props = {
  row: SummaryRow;
};

export default function SummaryTable({ row }: Props) {
  return (
    <div className="w-full overflow-hidden rounded-lg bg-white">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="bg-[#184777] text-white">
            <th className="w-1/5 px-6 py-6 text-center text-[14px] font-normal">
              ข้อมูลยูนิต
            </th>
            <th className="w-1/5 px-6 py-6 text-center text-[14px] font-normal">
              ยูนิตทั้งหมด
            </th>
            <th className="w-1/5 px-6 py-6 text-center text-[14px] font-normal">
              งานโครงสร้าง (งานที่ 1-5)
            </th>
            <th className="w-1/5 px-6 py-6 text-center text-[14px] font-normal">
              งานประกอบห้อง (งานที่ 6-17)
            </th>
            <th className="w-1/5 px-6 py-6 text-center text-[14px] font-normal">
              ยังไม่ตรวจ
            </th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-b border-gray-300">
            <td className="w-1/5 px-6 py-6 text-center text-[14px] text-slate-900">
              {row.projectName}
            </td>
            <td className="w-1/5 px-6 py-6 text-center text-[14px] text-slate-900">
              {row.totalUnits}
            </td>
            <td className="w-1/5 px-6 py-6 text-center text-[14px] text-slate-900">
              {row.structurePct.toFixed(1)}%
            </td>
            <td className="w-1/5 px-6 py-6 text-center text-[14px] text-slate-900">
              {row.roomPct.toFixed(1)}%
            </td>
            <td className="w-1/5 px-6 py-6 text-center text-[14px] text-slate-900">
              {row.remaining}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}