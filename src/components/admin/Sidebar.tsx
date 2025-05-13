import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, BookOpen, PlusCircle, PenSquare } from "lucide-react"

import { cn } from "@/lib/utils"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: React.ReactNode
  }[]
}

export function Sidebar({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "flex w-64 flex-col gap-2 p-4 bg-card rounded-md",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted hover:text-foreground transition-colors",
            pathname === item.href
              ? "bg-muted text-foreground"
              : "text-muted-foreground"
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

export function AdminSidebar() {
  const items = [
    {
      href: "/admin/student-list",
      title: "학생 관리",
      icon: <Users className="h-4 w-4" />,
    },
    {
      href: "/admin/class-list",
      title: "강의 관리",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      href: "/admin/create-class",
      title: "강의 생성",
      icon: <PlusCircle className="h-4 w-4" />,
    },
    {
      href: "/admin/update-class",
      title: "강의 수정",
      icon: <PenSquare className="h-4 w-4" />,
    },
  ]

  return <Sidebar items={items} />
} 