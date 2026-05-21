import { Navbar } from "@/components/admin-panel/navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} />
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-8">
        {children}
      </div>
    </div>
  );
}
