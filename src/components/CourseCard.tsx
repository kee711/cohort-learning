import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CourseCardProps {
  id: string
  title: string
  lecturer: string
  price: number
  thumbnail?: string
  rating: number
  studentsTotal: number
  className?: string
}

export function CourseCard({
  id,
  title,
  lecturer,
  price,
  thumbnail,
  rating,
  studentsTotal,
  className,
}: CourseCardProps) {
  return (
    <Link href={`/class-detail/${id}`}>
      <Card className={cn("overflow-hidden hover:shadow-md transition-shadow", className)}>
        <div className="relative h-48 w-full">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">이미지 없음</span>
            </div>
          )}
        </div>
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold truncate">{title}</h3>
          <p className="text-sm text-muted-foreground">{lecturer}</p>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-muted-foreground">{studentsTotal}명 수강</span>
          </div>
        </CardContent>
        <CardFooter>
          <p className="font-bold text-lg">{price.toLocaleString()}원</p>
        </CardFooter>
      </Card>
    </Link>
  )
} 