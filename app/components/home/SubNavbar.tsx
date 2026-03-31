import Link from "next/link";

export default function SubNavbar() {
  const items = [
    { name: "Resources", href: "/resources" },
    { name: "Ambassador", href: "/ambassador" },
    { name: "Community", href: "/community" },
    { name: "Opportunities", href: "/internships" },
    { name: "Support hub", href: "/support" },
  ];

  return (
    <div className="w-full border-b border-blue-700 bg-blue-600">
      <div className="mx-auto flex h-10 max-w-7xl items-center gap-1 px-6 sm:px-10 overflow-x-auto scrollbar-hide">
        {items.map((item, index) => (
          <div key={item.name} className="flex items-center">
            {index !== 0 && (
              <span className="h-2 w-[1px] bg-blue-500 mx-2" />
            )}
            <Link
              href={item.href}
              className="whitespace-nowrap px-3 py-2 text-[12px] font-medium text-white/80 transition-all hover:text-white"
            >
              {item.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
