export const ValueCard = ({ title, desc, icon }: { title: string; desc: string; icon?: string }) => {
  return (
    <div className="rounded-lg border border-slate-100 bg-white p-5 text-slate-700">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(114,129,70,0.12)] text-xl">
          {icon}
        </div>
        <h4 className="text-md font-semibold text-[#2f4320]">{title}</h4>
      </div>
      <p className="mt-3 text-sm">{desc}</p>
    </div>
  );
};
