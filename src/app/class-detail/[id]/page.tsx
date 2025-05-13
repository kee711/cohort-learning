'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

// 클래스 타입 정의
type Class = {
  id: string
  title: string
  price: number
  start_date: string
  end_date: string
  rating: number
  likes: number
  thumbnail_img: string
  detail_img: string
  detail_text: string
  lecturer: string
  students_total: number
  students_max: number
  manager_id: string
}

// 유저 타입 정의
type User = {
  id: string
  email: string
  name: string
  role: 'admin' | 'student'
}

// 기본 이미지 경로
const DEFAULT_INSTRUCTOR_IMG = 'https://placehold.co/200x250/blue/white?text=강사+이미지'
const DEFAULT_CLASS_IMG = 'https://placehold.co/800x400/darkblue/white?text=클래스+상세+이미지'
const DEFAULT_LOGO_IMG = 'https://placehold.co/120x60/blue/white?text=로고'

export default function ClassDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [classData, setClassData] = useState<Class | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [relatedClasses, setRelatedClasses] = useState<Class[]>([])
  const [chatOpen, setChatOpen] = useState(false)

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data } = await supabase
          .from('user')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (data) {
          setUser(data as User)
        }
      }
    }
    
    getUser()
  }, [])

  // 클래스 정보 가져오기
  useEffect(() => {
    async function fetchClassData() {
      setIsLoading(true)
      
      // 클래스 정보 가져오기
      const { data: classData, error: classError } = await supabase
        .from('class')
        .select('*')
        .eq('id', params.id)
        .single()
      
      if (classError) {
        console.error('클래스 정보를 가져오는 중 오류 발생:', classError)
        return
      }
      
      setClassData(classData as Class)
      
      // 관련 클래스 정보 가져오기 (동일한 강사의 다른 클래스)
      if (classData) {
        const { data: relatedData } = await supabase
          .from('class')
          .select('*')
          .eq('lecturer', classData.lecturer)
          .neq('id', params.id)
          .limit(2)
        
        setRelatedClasses(relatedData as Class[] || [])
      }
      
      setIsLoading(false)
    }
    
    fetchClassData()
  }, [params.id])

  // 현재 사용자의 수강 신청 상태 확인
  useEffect(() => {
    async function checkEnrollment() {
      if (!user) return
      
      const { data } = await supabase
        .from('enrollment')
        .select('*')
        .eq('student_id', user.id)
        .eq('class_id', params.id)
        .single()
      
      setIsEnrolled(!!data)
    }
    
    if (user) {
      checkEnrollment()
    }
  }, [user, params.id])

  // 찜하기 상태 체크 로직 (실제로는 DB에 별도 테이블이 필요함)
  useEffect(() => {
    setIsLiked(false) // 예시를 위해 기본값으로 설정
  }, [])

  // 수강 신청 처리
  const handleEnroll = async () => {
    if (!user) {
      alert('로그인이 필요합니다.')
      return
    }
    
    const { error } = await supabase
      .from('enrollment')
      .insert([
        { student_id: user.id, class_id: params.id }
      ])
    
    if (error) {
      console.error('수강 신청 중 오류 발생:', error)
      return
    }
    
    setIsEnrolled(true)
    
    // 수강 인원 업데이트
    if (classData) {
      const newTotal = (classData.students_total || 0) + 1
      await supabase
        .from('class')
        .update({ students_total: newTotal })
        .eq('id', params.id)
      
      setClassData({
        ...classData,
        students_total: newTotal
      })
    }
  }

  // 찜하기 처리
  const handleLike = () => {
    setIsLiked(!isLiked)
    // 실제로는 DB 처리 필요
  }

  // 클래스 마감 처리 (관리자 전용)
  const handleCloseClass = async () => {
    if (!user || user.role !== 'admin') {
      alert('관리자만 클래스를 마감할 수 있습니다.')
      return
    }
    
    const { error } = await supabase
      .from('class')
      .update({ students_max: 0 })
      .eq('id', params.id)
      
    if (error) {
      console.error('클래스 마감 중 오류 발생:', error)
      return
    }
    
    alert('클래스가 마감되었습니다.')
    router.refresh()
  }
  
  if (isLoading || !classData) {
    return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>
  }

  const formattedStartDate = new Date(classData.start_date).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
  
  const formattedEndDate = new Date(classData.end_date).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })

  const isAdmin = user?.role === 'admin'

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="flex flex-col md:flex-row gap-8">
        {/* 왼쪽 클래스 정보 섹션 */}
        <div className="w-full md:w-2/3">
          {/* 클래스 정보 헤더 */}
          <div className="relative bg-blue-900 text-white p-8 rounded-lg mb-8">
            <div className="absolute top-4 left-4">
              <span className="text-xl font-bold">2025 NEW</span>
            </div>
            
            <div className="md:flex items-center mt-6">
              <div className="md:w-2/3">
                <div className="inline-block px-4 py-2 bg-blue-800 text-white rounded-md mb-4">
                  초단기 월1000 전략
                </div>
                <h1 className="text-3xl font-bold mb-4">{classData.title}</h1>
                <p className="mb-4">
                  AI 홈페이지 수익화 마스터 클래스
                </p>
              </div>
              
              <div className="md:w-1/3 flex justify-center">
                {classData.thumbnail_img ? (
                  <Image 
                    src={classData.thumbnail_img} 
                    alt={classData.lecturer} 
                    width={200} 
                    height={250}
                    className="rounded-md"
                  />
                ) : (
                  <Image 
                    src={DEFAULT_INSTRUCTOR_IMG} 
                    alt={classData.lecturer} 
                    width={200} 
                    height={250}
                    className="rounded-md"
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* 모집 기간 */}
          <div className="mb-8">
            <p className="text-gray-600">모집기간 : {formattedStartDate} ~ {formattedEndDate}</p>
          </div>
          
          {/* 클래스 소개 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">클래스 소개</h2>
            {classData.detail_img ? (
              <div className="mb-4">
                <Image 
                  src={classData.detail_img} 
                  alt="클래스 소개 이미지" 
                  width={800} 
                  height={400}
                  className="rounded-md w-full"
                />
              </div>
            ) : (
              <div className="relative bg-blue-900 text-white p-8 rounded-lg mb-8 text-center">
                <h3 className="text-2xl font-bold mb-4">이미 종료된 라이브에요</h3>
                <p>다음을 무료 강의를 기대해주세요</p>
                <div className="mt-4 flex justify-center">
                  <Image 
                    src={DEFAULT_LOGO_IMG} 
                    alt="로고" 
                    width={120} 
                    height={60}
                  />
                </div>
              </div>
            )}
            <div className="prose max-w-none">
              <p>{classData.detail_text || '클래스 상세 설명이 준비 중입니다.'}</p>
            </div>
          </div>
          
          {/* 커리큘럼 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">커리큘럼</h2>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-4">
                <span>1</span>
              </div>
              <p>LIVE 방송을 통해 강의를 수강하실 수 있습니다.</p>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-4">
                <span>2</span>
              </div>
              <p>라이브 종료 후에도 녹화된 영상으로 학습 가능합니다.</p>
            </div>
          </div>
          
          {/* 질문 남기기 */}
          <div className="bg-gray-100 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-4">질문 남기기</h2>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
              <textarea 
                className="flex-1 border border-gray-300 p-3 rounded-md"
                placeholder="수업에 대한 질문이 있으신가요?"
              ></textarea>
              <button className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md">
                등록
              </button>
            </div>
          </div>
          
          {/* 관련 클래스 */}
          {relatedClasses.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">이 사이트에서 평점이 좋은 클래스</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedClasses.map((relatedClass) => (
                  <div 
                    key={relatedClass.id} 
                    className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => router.push(`/class-detail/${relatedClass.id}`)}
                  >
                    <div className="relative h-40">
                      {relatedClass.thumbnail_img ? (
                        <Image 
                          src={relatedClass.thumbnail_img} 
                          alt={relatedClass.title} 
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                          <span>이미지 준비중</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold mb-2">{relatedClass.title}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(relatedClass.start_date).toLocaleDateString()} ~ 
                        {new Date(relatedClass.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* 오른쪽 사이드바 */}
        <div className="w-full md:w-1/3">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-2">
              노트북 하나로 월1000! AI 홈페이지 수익화 마스터 클래스
            </h2>
            <p className="text-blue-500 mb-4">무료</p>
            
            {/* 가격 정보 */}
            <div className="mb-6">
              <span className="text-2xl font-bold">
                {classData.price === 0 ? '무료' : `${classData.price.toLocaleString()}원`}
              </span>
            </div>
            
            {/* 버튼 영역 */}
            <div className="mb-6 space-y-3">
              {isAdmin ? (
                <>
                  <button className="w-full py-3 bg-gray-200 text-black rounded-md">
                    로그인
                  </button>
                  <button 
                    className="w-full py-3 bg-red-500 text-white rounded-md"
                    onClick={handleCloseClass}
                  >
                    클래스 마감
                  </button>
                </>
              ) : (
                <>
                  {isEnrolled ? (
                    <button className="w-full py-3 bg-blue-600 text-white rounded-md">
                      강의실 입장하기
                    </button>
                  ) : (
                    <button 
                      className="w-full py-3 bg-blue-600 text-white rounded-md"
                      onClick={handleEnroll}
                    >
                      수강신청하기
                    </button>
                  )}
                </>
              )}
              
              {!isAdmin && (
                <div className="flex space-x-2">
                  <button 
                    className={`flex-1 py-2 border rounded-md flex items-center justify-center ${isLiked ? 'text-blue-500' : 'text-gray-500'}`}
                    onClick={handleLike}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 mr-1" 
                      fill={isLiked ? "currentColor" : "none"} 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    찜하기
                  </button>
                  <button className="flex-1 py-2 border rounded-md flex items-center justify-center text-gray-500">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 mr-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    공유
                  </button>
                </div>
              )}
            </div>
            
            {/* 클래스 정보 */}
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-2 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>총 1회 라이브 방송</span>
              </div>
              <div className="flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-2 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>방송일: {new Date(classData.start_date).toLocaleDateString('ko-KR')}</span>
              </div>
              <div className="flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-2 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>강사: {classData.lecturer}</span>
              </div>
              <div className="flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-2 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>수강생: {classData.students_total || 0} / {classData.students_max || '무제한'}</span>
              </div>
            </div>
            
            {/* 클래스 관련 링크들 */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              {isAdmin ? (
                <>
                  <h3 className="font-semibold mb-2">클래스 관리가능</h3>
                  <div className="space-y-2">
                    <button className="block w-full py-2 px-4 rounded-md bg-gray-100 text-gray-700 text-sm text-center hover:bg-gray-200">
                      클래스 수정
                    </button>
                    <button className="block w-full py-2 px-4 rounded-md bg-red-100 text-red-600 text-sm text-center hover:bg-red-200">
                      클래스 마감
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button className="text-sm text-gray-500 hover:text-blue-500 block mb-2">
                    ✓ 무료특강 신청
                  </button>
                  <button className="text-sm text-gray-500 hover:text-blue-500 block mb-2">
                    ✓ 무료특강 소식
                  </button>
                  <button className="text-sm text-gray-500 hover:text-blue-500 block">
                    ✓ 무료특강 소식
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* 채팅 버튼 */}
      <div className="fixed right-4 bottom-4 flex flex-col items-end space-y-4 z-10">
        {chatOpen && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">1:1 채팅</h3>
              <button onClick={() => setChatOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="h-60 overflow-y-auto border rounded-md p-2 bg-gray-50 mb-4">
              <div className="text-center text-gray-500 text-sm py-4">
                상담사와 연결 중입니다...
              </div>
            </div>
            <div className="flex">
              <input 
                type="text" 
                className="flex-1 border border-gray-300 rounded-l-md px-3 py-2"
                placeholder="메시지를 입력하세요"
              />
              <button className="bg-yellow-400 text-black px-4 py-2 rounded-r-md">
                전송
              </button>
            </div>
          </div>
        )}
        
        <button 
          className="bg-yellow-400 text-black w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-500"
          onClick={() => setChatOpen(!chatOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      </div>
      
      {/* 우측 사이드 버튼 */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 z-10">
        <button className="bg-white border border-gray-200 rounded-full w-12 h-12 flex items-center justify-center shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button className="bg-black rounded-full w-12 h-12 flex items-center justify-center shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
        </button>
      </div>
    </div>
  )
} 