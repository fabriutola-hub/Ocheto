export function Badge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
        active
          ? 'bg-ocheto-green-700/10 text-ocheto-green-700'
          : 'bg-ocheto-berry-600/10 text-ocheto-berry-600'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-ocheto-green-700' : 'bg-ocheto-berry-600'}`} />
      {active ? 'Activo' : 'Inactivo'}
    </span>
  );
}

export function Loading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 rounded-full border-[3px] border-ocheto-green-700/20 border-t-ocheto-green-700 animate-spin" />
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-2xl bg-ocheto-berry-600/8 border border-ocheto-berry-600/20 px-5 py-4 text-sm font-medium text-ocheto-berry-600">
      {message}
    </div>
  );
}
