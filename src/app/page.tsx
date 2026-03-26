"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface MenuItem {
  name: string
  category: string
}

interface RestaurantInfo {
  name: string
  address: string
  price: string
}

interface MenuData {
  id: string
  restaurant_id: string
  menu_date: string
  items: MenuItem[]
  source: string
  restaurants: RestaurantInfo
}

export default function HomePage() {
  const [menus, setMenus] = useState<MenuData[]>([])
  const [loading, setLoading] = useState(true)
  const [bookmarks, setBookmarks] = useState<string[]>([])

  const today = new Date()
  const month = today.getMonth() + 1
  const day = today.getDate()
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"]
  const dayName = dayNames[today.getDay()]
  const todayStr = today.toISOString().split("T")[0]

  useEffect(() => {
    const saved = localStorage.getItem("bookmarks")
    if (saved) {
      const parsed = JSON.parse(saved)
      setBookmarks(parsed.map((b: { id: string }) => b.id))
    }
  }, [])

  useEffect(() => {
    async function fetchMenus() {
      const { data, error } = await supabase
        .from("daily_menus")
        .select("id, restaurant_id, menu_date, items, source, restaurants (name, address, price)")
        .eq("menu_date", todayStr)
      if (!error && data) setMenus(data as unknown as MenuData[])
      setLoading(false)
    }
    fetchMenus()
  }, [todayStr])

  const toggleBookmark = (restaurantId: string, name: string, address: string, price: string) => {
    const saved = localStorage.getItem("bookmarks")
    let list = saved ? JSON.parse(saved) : []
    const exists = list.find((b: { id: string }) => b.id === restaurantId)
    if (exists) {
      list = list.filter((b: { id: string }) => b.id !== restaurantId)
    } else {
      list.push({ id: restaurantId, name, address, price })
    }
    localStorage.setItem("bookmarks", JSON.stringify(list))
    setBookmarks(list.map((b: { id: string }) => b.id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-4 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-orange-700">🍚 오늘한끼</h1>
            <p className="text-xs text-gray-400">한식뷔페 오늘의 메뉴를 한눈에</p>
          </div>
          <a href="/owner" className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-orange-200 transition">
            🏪 사장님
          </a>
        </div>
      </header>

      <div className="max-w-3xl mx-auto">
        <div className="px-4 pt-5 pb-2">
          <h2 className="text-lg font-bold text-gray-900">
            📅 {month}월 {day}일 ({dayName}요일) 메뉴
          </h2>
        </div>

        <div className="px-4 py-3 grid grid-cols-4 gap-2">
          <a href="/nearby" className="bg-white border border-gray-200 rounded-xl p-3 text-center hover:border-orange-400 transition">
            <p className="text-2xl mb-1">📍</p>
            <p className="text-xs font-medium text-gray-700">내 주변</p>
          </a>
          <a href="/search" className="bg-white border border-gray-200 rounded-xl p-3 text-center hover:border-orange-400 transition">
            <p className="text-2xl mb-1">🔍</p>
            <p className="text-xs font-medium text-gray-700">메뉴 검색</p>
          </a>
          <a href="/board" className="bg-white border border-gray-200 rounded-xl p-3 text-center hover:border-orange-400 transition">
            <p className="text-2xl mb-1">📋</p>
            <p className="text-xs font-medium text-gray-600">게시판</p>
            <p style={{fontSize: 9}} className="text-gray-400">(가게추천/후기/자유글)</p>
          </a>
          <a href="/bookmark" className="bg-white border border-gray-200 rounded-xl p-3 text-center hover:border-orange-400 transition">
            <p className="text-2xl mb-1">⭐</p>
            <p className="text-xs font-medium text-gray-700">즐겨찾기</p>
          </a>
        </div>

        <div className="px-4 py-2 flex gap-2 overflow-x-auto">
          {["여의도", "강남", "종로/광화문", "구로/가산", "마포/홍대", "전체"].map((district, i) => (
            <button
              key={district}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition ${
                i === 0
                  ? "bg-orange-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-600"
              }`}
            >
              {district}
            </button>
          ))}
        </div>

        <div className="px-4 py-4">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4 animate-pulse">🍚</p>
              <p className="text-gray-500">오늘 메뉴를 불러오는 중...</p>
            </div>
          ) : menus.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">📭</p>
              <p className="text-gray-500 font-medium">오늘 등록된 메뉴가 아직 없습니다</p>
              <p className="text-gray-400 text-sm mt-1">사장님이 메뉴를 등록하면 바로 이곳에 표시됩니다!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {menus.map((menu) => {
                const mainItems = menu.items.filter(
                  (i) => i.category === "🔥 메인" || i.category === "🍲 국/찌개"
                )
                const otherItems = menu.items.filter(
                  (i) => i.category !== "🔥 메인" && i.category !== "🍲 국/찌개"
                )
                const isBookmarked = bookmarks.includes(menu.restaurant_id)
                return (
                  <div key={menu.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg">{menu.restaurants.name}</h3>
                        <p className="text-sm text-gray-400 mt-0.5">{menu.restaurants.address}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {menu.restaurants.price && (
                          <span className="bg-orange-100 text-orange-700 text-sm font-bold px-3 py-1 rounded-full">
                            {menu.restaurants.price}원
                          </span>
                        )}
                        <button
                          onClick={() => toggleBookmark(menu.restaurant_id, menu.restaurants.name, menu.restaurants.address, menu.restaurants.price)}
                          className="text-2xl transition hover:scale-110"
                        >
                          {isBookmarked ? "⭐" : "☆"}
                        </button>
                      </div>
                    </div>
                    {mainItems.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {mainItems.map((item, idx) => (
                          <span key={idx} className="bg-red-50 text-red-700 px-2.5 py-1 rounded-lg text-sm font-medium">
                            {item.name}
                          </span>
                        ))}
                      </div>
                    )}
                    {otherItems.length > 0 && (
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {otherItems.map((item) => item.name).join(" · ")}
                      </p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <a
                        href={"https://map.kakao.com/link/search/" + encodeURIComponent(menu.restaurants.address)}
                        target="_blank"
                        className="text-xs text-yellow-700 bg-yellow-100 px-3 py-1.5 rounded-lg hover:bg-yellow-200 transition"
                      >
                        카카오맵
                      </a>
                      <a
                        href={"https://map.naver.com/v5/search/" + encodeURIComponent(menu.restaurants.address)}
                        target="_blank"
                        className="text-xs text-green-700 bg-green-100 px-3 py-1.5 rounded-lg hover:bg-green-200 transition"
                      >
                        네이버지도
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="px-4 py-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4">
            <p className="font-bold text-blue-800 text-sm">📢 광고/제휴 문의</p>
            <p className="text-xs text-blue-600 mt-1">
              한식뷔페 사장님, 밀키트/반찬 업체, 식자재 납품업체 등 제휴/광고를 원하시면 편하게 연락주세요!
            </p>
            <div className="flex gap-2 mt-3">
              <a href="mailto:kbioin@naver.com" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-medium hover:bg-blue-700 transition">
                이메일 문의
              </a>
              <a href="https://open.kakao.com/o/sV5Fw9mi" target="_blank" rel="noopener noreferrer" className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-xl text-xs font-medium hover:bg-yellow-500 transition">
                카카오톡 문의
              </a>
            </div>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
            <h2 className="font-bold text-orange-800">🏪 한식뷔페 사장님이신가요?</h2>
            <p className="text-sm text-orange-700 mt-1">무료로 매일 메뉴를 올리고, 주변 직장인들에게 홍보하세요.</p>
            <div className="flex gap-2 mt-3">
              <a href="/owner/register" className="bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-700 transition">
                가게 등록하기
              </a>
              <a href="/owner" className="bg-white border border-orange-300 text-orange-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-50 transition">
                메뉴 등록하기
              </a>
            </div>
          </div>
        </div>

        <footer className="px-4 py-8 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">© 2026 오늘한끼 · 한식뷔페 메뉴 큐레이션 서비스</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="mailto:kbioin@naver.com" className="text-xs text-gray-400 hover:text-orange-600">이메일 문의</a>
            <a href="https://open.kakao.com/o/sV5Fw9mi" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-orange-600">카카오톡 문의</a>
            <a href="/board" className="text-xs text-gray-400 hover:text-orange-600">게시판</a>
          </div>
        </footer>
      </div>
    </div>
  )
}
