"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface MenuItem {
  name: string
  category: string
}

interface MenuData {
  id: string
  menu_date: string
  items: MenuItem[]
  source: string
  restaurants: {
    name: string
    address: string
    price: string
  }
}

export default function HomePage() {
  const [menus, setMenus] = useState<MenuData[]>([])
  const [loading, setLoading] = useState(true)

  const today = new Date()
  const month = today.getMonth() + 1
  const day = today.getDate()
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"]
  const dayName = dayNames[today.getDay()]

  const todayStr =
    today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0")

  useEffect(() => {
    async function fetchMenus() {
      const { data, error } = await supabase
        .from("daily_menus")
        .select(`
          id,
          menu_date,
          items,
          source,
          restaurants (
            name,
            address,
            price
          )
        `)
        .eq("menu_date", todayStr)

      if (!error && data) {
        setMenus(data as unknown as MenuData[])
      }
      setLoading(false)
    }

    fetchMenus()
  }, [todayStr])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b px-4 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-orange-700">🍚 오늘한끼</h1>
            <p className="text-sm text-gray-500 mt-1">
              한식뷔페 오늘의 메뉴를 한눈에
            </p>
          </div>
          <a
            href="/owner"
            className="text-sm bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full font-medium hover:bg-orange-200 transition"
          >
            🏪 사장님
          </a>
        </div>
      </header>

      {/* ★ PC: 3단 레이아웃 (왼쪽 광고 | 메인 | 오른쪽 광고) */}
      <div className="max-w-5xl mx-auto flex gap-4 px-4">
        
        {/* ====== 왼쪽 광고 (PC에서만 보임) ====== */}
        <aside className="hidden lg:block w-48 flex-shrink-0 py-6">
          <div className="sticky top-20 space-y-4">
            {/* 쿠팡 파트너스 배너 자리 */}
            <a
              href="https://link.coupang.com/본인쿠팡파트너스링크"
              target="_blank"
              className="block"
            >
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition">
                <p className="text-xs text-gray-400 mb-2">AD</p>
                <p className="text-sm font-bold text-gray-700">🛒 오늘의 추천</p>
                <p className="text-xs text-gray-500 mt-1">
                  직장인 점심용<br />간편식 모음
                </p>
                <p className="text-xs text-blue-500 mt-2">쿠팡에서 보기 →</p>
              </div>
            </a>

            {/* 밀키트 광고 */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-2">AD</p>
              <p className="text-sm font-bold text-gray-700">🥘 밀키트 추천</p>
              <p className="text-xs text-gray-500 mt-1">
                집에서도 한식뷔페<br />맛을 그대로!
              </p>
              <p className="text-xs text-orange-500 mt-2">구경하기 →</p>
            </div>

            {/* 광고 문의 */}
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">📢 광고 영역</p>
              <p className="text-xs text-gray-500">
                이 자리에<br />광고를 넣어보세요
              </p>
              <a
                href="mailto:contact@oneulhanki.com"
                className="text-xs text-orange-500 mt-2 block underline"
              >
                광고 문의하기
              </a>
            </div>
          </div>
        </aside>

        {/* ====== 메인 콘텐츠 (가운데) ====== */}
        <main className="flex-1 min-w-0">
          {/* 날짜 */}
          <div className="pt-5 pb-2">
            <h2 className="text-lg font-bold text-gray-900">
              📅 {month}월 {day}일 ({dayName}요일) 메뉴
            </h2>
          </div>

          {/* 지역 선택 */}
          <div className="py-3 flex gap-2 overflow-x-auto">
            {["여의도", "강남", "종로/광화문", "구로/가산", "마포/홍대", "전체"].map(
              (district, index) => (
                <button
                  key={district}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition
                    ${
                      index === 0
                        ? "bg-orange-600 text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-600"
                    }`}
                >
                  {district}
                </button>
              )
            )}
          </div>

          {/* 검색바 */}
          <div className="pb-4">
            <a href="/search" className="block">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>
                <div className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-400">
                  메뉴 또는 가게 검색 (예: &quot;제육볶음&quot;)
                </div>
              </div>
            </a>
          </div>

          {/* ★ 모바일 상단 광고 (모바일에서만 보임) */}
          <div className="lg:hidden mb-4">
            <a
              href="https://link.coupang.com/본인쿠팡파트너스링크"
              target="_blank"
              className="block bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛒</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-700">
                    직장인 점심 간편식 모음
                  </p>
                  <p className="text-xs text-gray-400">
                    쿠팡에서 인기 밀키트 보기
                  </p>
                </div>
                <span className="text-xs text-blue-500">AD</span>
              </div>
            </a>
          </div>

          {/* 메뉴 카드 목록 */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-4">⏳</p>
                <p className="text-gray-400">메뉴를 불러오는 중...</p>
              </div>
            ) : menus.length > 0 ? (
              <>
                {menus.map((menu, index) => (
                  <div key={menu.id}>
                    {/* 가게 카드 */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900 text-base">
                            {menu.restaurants.name}
                          </h3>
                          <p className="text-xs text-gray-400 mt-0.5">
                            📍 {menu.restaurants.address}
                          </p>
                          <p className="text-xs font-semibold text-orange-600 mt-0.5">
                            💰 {menu.restaurants.price}원
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            ✅ 사장님 등록
                          </span>
                          <a
                            href={`https://map.kakao.com/link/search/${menu.restaurants.name} ${menu.restaurants.address}`}
                            target="_blank"
                            className="text-xs text-blue-500 hover:text-blue-700"
                          >
                            🗺️ 지도보기
                          </a>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">
                        <div className="flex flex-wrap gap-1.5">
                          {menu.items
                            .filter(
                              (item) =>
                                item.category === "🔥 메인" ||
                                item.category === "🍲 국/찌개"
                            )
                            .map((item, i) => (
                              <span
                                key={i}
                                className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-lg text-sm font-medium"
                              >
                                🔥 {item.name}
                              </span>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {menu.items
                            .filter(
                              (item) =>
                                item.category !== "🔥 메인" &&
                                item.category !== "🍲 국/찌개"
                            )
                            .map((item, i) => (
                              <span
                                key={i}
                                className="bg-gray-50 text-gray-600 px-2 py-0.5 rounded text-xs"
                              >
                                {item.name}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* ★ 가게 2개마다 중간 광고 삽입 (모바일) */}
                    {index === 1 && (
                      <div className="lg:hidden mt-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">🥘</span>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-700">
                                밀키트로 집에서 한식뷔페!
                              </p>
                              <p className="text-xs text-gray-400">
                                인기 밀키트 모음전
                              </p>
                            </div>
                            <span className="text-xs text-gray-400">AD</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-6xl mb-4">🍽️</p>
                <p className="text-gray-500 text-lg">
                  아직 오늘 등록된 메뉴가 없어요
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  보통 오전 9~10시에 업데이트됩니다
                </p>
                <a
                  href="/owner"
                  className="inline-block mt-4 bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-700"
                >
                  🏪 사장님이라면 메뉴 등록하기
                </a>
              </div>
            )}
          </div>

          {/* 사장님 배너 */}
          <div className="mt-8 mb-8">
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
              <h2 className="font-bold text-orange-800 text-base">
                🏪 한식뷔페 사장님이신가요?
              </h2>
              <p className="text-sm text-orange-700 mt-1">
                무료로 매일 메뉴를 올리고, 주변 직장인들에게 홍보하세요.
              </p>
              <a
                href="/owner"
                className="inline-block mt-4 bg-orange-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-orange-700 transition"
              >
                무료로 가게 등록하기 →
              </a>
            </div>
          </div>

          {/* 광고 문의 배너 */}
          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h2 className="font-bold text-blue-800 text-base">
                📢 광고·제휴 문의
              </h2>
              <p className="text-sm text-blue-700 mt-1">
                밀키트, 반찬, 식자재 등 직장인 대상 홍보가 필요하시다면
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href="mailto:contact@oneulhanki.com"
                  className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition"
                >
                  ✉️ 이메일 문의
                </a>
                <a
                  href="https://open.kakao.com/"
                  target="_blank"
                  className="inline-block bg-yellow-400 text-gray-900 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-yellow-500 transition"
                >
                  💬 카카오톡 문의
                </a>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-blue-600">
                <span className="bg-blue-100 px-2 py-1 rounded-full">배너 광고</span>
                <span className="bg-blue-100 px-2 py-1 rounded-full">밀키트 위탁판매</span>
                <span className="bg-blue-100 px-2 py-1 rounded-full">반찬 배달 제휴</span>
                <span className="bg-blue-100 px-2 py-1 rounded-full">가게 상단 노출</span>
              </div>
            </div>
          </div>

          <footer className="py-8 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-400">
              © 2026 오늘한끼 · 한식뷔페 메뉴 큐레이션 서비스
            </p>
            <p className="text-xs text-gray-400 mt-1">
              광고 문의: contact@oneulhanki.com
            </p>
          </footer>
        </main>

        {/* ====== 오른쪽 광고 (PC에서만 보임) ====== */}
        <aside className="hidden lg:block w-48 flex-shrink-0 py-6">
          <div className="sticky top-20 space-y-4">
            {/* 가게 상단 노출 광고 */}
            <div className="bg-white border border-orange-200 rounded-xl p-4 text-center">
              <p className="text-xs text-orange-400 mb-2">PREMIUM</p>
              <p className="text-sm font-bold text-gray-700">🏪 사장님!</p>
              <p className="text-xs text-gray-500 mt-1">
                내 가게를<br />상단에 노출하세요
              </p>
              <p className="text-xs text-orange-600 font-bold mt-2">
                월 30,000원~
              </p>
              <a
                href="mailto:contact@oneulhanki.com"
                className="block mt-2 text-xs text-orange-500 underline"
              >
                신청하기
              </a>
            </div>

            {/* 쿠팡 파트너스 */}
            <a
              href="https://link.coupang.com/본인쿠팡파트너스링크"
              target="_blank"
              className="block"
            >
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition">
                <p className="text-xs text-gray-400 mb-2">AD</p>
                <p className="text-sm font-bold text-gray-700">🍱 도시락 추천</p>
                <p className="text-xs text-gray-500 mt-1">
                  바쁜 직장인을 위한<br />건강 도시락
                </p>
                <p className="text-xs text-blue-500 mt-2">쿠팡에서 보기 →</p>
              </div>
            </a>

            {/* 반찬 배달 */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-2">AD</p>
              <p className="text-sm font-bold text-gray-700">🥗 반찬 배달</p>
              <p className="text-xs text-gray-500 mt-1">
                사무실로 배달되는<br />수제 반찬 구독
              </p>
              <p className="text-xs text-green-500 mt-2">자세히 보기 →</p>
            </div>

            {/* 광고 문의 */}
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">📢 광고 영역</p>
              <p className="text-xs text-gray-500">
                이 자리에<br />광고를 넣어보세요
              </p>
              <a
                href="mailto:contact@oneulhanki.com"
                className="text-xs text-orange-500 mt-2 block underline"
              >
                광고 문의하기
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
