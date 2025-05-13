import { CourseCard } from "@/components/CourseCard"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/supabase"
import Image from "next/image"

type ClassType = Database["public"]["Tables"]["class"]["Row"]

function getSectionedClasses(classes: ClassType[]) {
  const now = new Date()
  const upcomingLive = classes.filter((c) => c.price === 0 && c.start_date && new Date(c.start_date) > now)
  const premium = classes.filter((c) => c.price > 0 && c.end_date && new Date(c.end_date) > now)
  const endedLive = classes.filter((c) => c.end_date && new Date(c.end_date) < now)
  return { upcomingLive, premium, endedLive }
}

export default async function Home() {
  const { data: classes } = await supabase.from('class').select('*')
  if (!classes) return <div>데이터를 불러올 수 없습니다.</div>
  const { upcomingLive, premium, endedLive } = getSectionedClasses(classes)
  const banner = upcomingLive[0] || classes[0]

  return (
    <div className="bg-background">
      {/* 상단 배너 */}
      <section className="relative w-full h-[340px] bg-black flex items-center justify-center mb-10">
        {banner?.thumbnail_img && (
          <Image src="/banner.png" alt={banner.title} className="absolute inset-0 w-full h-full object-cover opacity-60" width={1000} height={340} />
        )}
        <div className="relative z-10 text-white text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{banner?.title}</h2>
          <div className="mb-2">라이브 일정: {banner?.start_date ? new Date(banner.start_date).toLocaleString('ko-KR') : '-'}</div>
          <button className="bg-primary px-6 py-2 rounded-full font-bold text-lg">무료특강 신청하기</button>
        </div>
      </section>

      {/* 다가오는 무료 라이브 */}
      <section className="container mb-12">
        <h3 className="text-xl font-bold mb-4">다가오는 무료 라이브</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingLive.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              lecturer={course.lecturer}
              price={course.price}
              thumbnail={course.thumbnail_img || undefined}
              rating={course.rating}
              studentsTotal={course.students_total}
            />
          ))}
        </div>
      </section>

      {/* 프리미엄 강의 */}
      <section className="container mb-12">
        <h3 className="text-xl font-bold mb-4">프리미엄 강의</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {premium.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              lecturer={course.lecturer}
              price={course.price}
              thumbnail={course.thumbnail_img || undefined}
              rating={course.rating}
              studentsTotal={course.students_total}
            />
          ))}
        </div>
      </section>

      {/* 종료된 라이브 */}
      <section className="container mb-12">
        <h3 className="text-xl font-bold mb-4">종료된 라이브</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {endedLive.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              lecturer={course.lecturer}
              price={course.price}
              thumbnail={course.thumbnail_img || undefined}
              rating={course.rating}
              studentsTotal={course.students_total}
            />
          ))}
        </div>
      </section>

      {/* 하단 푸터(생략 가능) */}
      <footer className="bg-black text-white py-10 mt-10 text-center text-sm opacity-80">
        <div>© 2025 버티러닝. All rights reserved.</div>
      </footer>
    </div>
  )
}
