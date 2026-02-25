type Props = {
  label?: string;
  className?: string;
};

export default function LoadingCard({
  label = "กำลังโหลดข้อมูล...",
  className = "",
}: Props) {
  return (
    <div
      className={`flex w-full items-center justify-center rounded-lg bg-white p-8 ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        <span className="text-gray-600">{label}</span>
      </div>
    </div>
  );
}