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
        <div className="max-w-3xl mx-auto flex justify-between items-center">
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
            🏪 사장님 등록
          </a>
        </div>
      </header>

      <div className="max-w-3xl mx-auto">
        {/* 날짜 */}
        <div className="px-4 pt-5 pb-2">
          <h2 className="text-lg font-bold text-gray-900">
            📅 {month}월 {day}일 ({dayName}요일) 메뉴
          </h2>
        </div>

        {/* 지역 선택 */}
        <div className="px-4 py-3 flex gap-2 overflow-x-auto">
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

        {/* 메뉴 카드 목록 */}
        <div className="px-4 space-y-4 mt-2">
          {loading ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">⏳</p>
              <p className="text-gray-400">메뉴를 불러오는 중...</p>
            </div>
          ) : menus.length > 0 ? (
            menus.map((menu) => (
              <div
                key={menu.id}
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition"
              >
                {/* 가게 정보 */}
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
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    ✅ 사장님 등록
                  </span>
                </div>

                {/* 메뉴 목록 */}
                <div className="mt-3 space-y-2">
                  {/* 메인 + 국/찌개 강조 */}
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
                  {/* 나머지 반찬 */}
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
            ))
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
        <div className="px-4 mt-8 mb-8">
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

        {/* 푸터 */}
        <footer className="px-4 py-8 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">
            © 2026 오늘한끼 · 한식뷔페 메뉴 큐레이션 서비스
          </p>
        </footer>
      </div>
    </div>
  )
}
