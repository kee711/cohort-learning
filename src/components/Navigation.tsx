import Link from "next/link"
import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Navigation() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        {/* 좌측: 로고 */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold text-primary">
            <span className="flex items-center gap-2">
              <Image src="/logo.svg" alt="버티컬러닝" width={140} height={56} />
            </span>
          </Link>
        </div>
        {/* 중앙: 메뉴 */}
        <nav className="hidden md:flex gap-8 text-base font-semibold">
          <Link href="/" className="hover:text-primary transition-colors">무료특강</Link>
          <Link href="/premium" className="hover:text-primary transition-colors">프리미엄 강의</Link>
          <Link href="/my-page" className="hover:text-primary transition-colors">나의 강의실</Link>
          <Link href="/instructor" className="hover:text-primary transition-colors">강사 지원</Link>
        </nav>
        {/* 우측: 알림, 마이페이지, 사이트 관리 */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" aria-label="알림">
            <Bell className="h-5 w-5" />
          </Button>
          <Link href="/my-page">
            <Button variant="ghost" size="icon" aria-label="마이페이지">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/admin/class-list">
            <Button variant="outline" size="sm" className="font-bold">사이트 관리</Button>
          </Link>
        </div>
      </div>
    </header>
  )
} 