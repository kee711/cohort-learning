import Link from "next/link"
import { PenSquare } from "lucide-react"

import { Button } from "@/components/ui/button"

const mockClasses = [
  {
    id: "1",
    title: "웹 개발 입문",
    lecturer: "홍길동",
    students_total: 120,
    students_max: 150,
    startDate: "2023-09-01",
    endDate: "2023-12-31"
  },
  {
    id: "2",
    title: "React 마스터하기",
    lecturer: "김철수",
    students_total: 240,
    students_max: 300,
    startDate: "2023-10-15",
    endDate: "2024-01-15"
  },
  {
    id: "3",
    title: "데이터베이스 기초",
    lecturer: "이영희",
    students_total: 85,
    students_max: 100,
    startDate: "2023-11-01",
    endDate: "2024-02-01"
  }
]

export default function ClassListPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">강의 목록</h2>
        <Link href="/admin/create-class">
          <Button>새 강의 생성</Button>
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4 text-left font-medium">강의명</th>
              <th className="py-3 px-4 text-left font-medium">강사</th>
              <th className="py-3 px-4 text-left font-medium">수강생</th>
              <th className="py-3 px-4 text-left font-medium">기간</th>
              <th className="py-3 px-4 text-left font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {mockClasses.map((course) => (
              <tr key={course.id} className="border-b">
                <td className="py-3 px-4">{course.title}</td>
                <td className="py-3 px-4">{course.lecturer}</td>
                <td className="py-3 px-4">
                  {course.students_total}/{course.students_max}
                </td>
                <td className="py-3 px-4">
                  {new Date(course.startDate).toLocaleDateString()} ~ 
                  {new Date(course.endDate).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <Link href={`/admin/update-class?id=${course.id}`}>
                    <Button variant="outline" size="sm">
                      <PenSquare className="h-4 w-4 mr-1" />
                      수정
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 