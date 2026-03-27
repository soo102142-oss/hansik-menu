"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface RestaurantInfo {
  id: string
  name: string
  address: string
  price: string | null
  district: string
}

interface MenuData {
  id: string
  restaurant_id: string
  menu_date: string
  items: any
  source: string | null
  restaurants: RestaurantInfo
}

const DISTRICTS = ["전체", "여의도", "강남", "종로/광화문", "구로/가산", "마포/홍대"]

const MAIN_DISH_ICONS: Record<string, string> = {
  "제육": "🥩", "불고기": "🥩", "갈비": "🥩", "삼겹": "🥩", "수육": "🥩",
  "닭갈비": "🍗", "닭볶음": "🍗", "치킨": "🍗", "닭": "🍗",
  "고등어": "🐟", "갈치": "🐟", "생선": "🐟", "조기": "🐟", "꽁치": "🐟",
  "김치찌개": "🍲", "된장찌개": "🍲", "순두부": "🍲", "찌개": "🍲", "탕": "🍲", "국": "🍲",
  "짜장": "🍜", "짬뽕": "🍜", "스파게티": "🍝", "파스타": "🍝", "우동": "🍜",
  "카레": "🍛", "커리": "🍛",
  "돈까스": "🍱", "돈가스": "🍱", "가스": "🍱",
  "떡볶이": "🌶️", "볶음": "🍳",
  "전": "🥞", "부침": "🥞", "피자": "🍕", "미트볼": "🧆",
}

function getMainDishIcon(item: string): string | null {
  for (const [keyword, icon] of Object.entries(MAIN_DISH_ICONS)) {
    if (item.includes(keyword)) return icon
  }
  return null
}

function formatDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

export default function HomePage() {
  const [menus, setMenus] = useState<MenuData[]>([])
  const [allRestaurants, setAllRestaurants] = useState<RestaurantInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [district, setDistrict] = useState("전체")
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"]
  const todayStr = formatDate(selectedDate)

  // 날짜 이동 범위 제한 (앞뒤 7일)
  const today = new Date()
  const minDate = new Date(today)
  minDate.setDate(today.getDate() - 7)
  const maxDate = new Date(today)
  maxDate.setDate(today.getDate() + 7)

  const canGoPrev = selectedDate > minDate
  const canGoNext = selectedDate < maxDate
  const isToday = formatDate(selectedDate) === formatDate(today)

  const goDate = (offset: number) => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + offset)
    if (d >= minDate && d <= maxDate) setSelectedDate(d)
  }

  useEffect(() => {
    const saved = localStorage.getItem("bookmarks")
    if (saved) setBookmarks(JSON.parse(saved))
  }, [])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const { data: menuData } = await supabase
        .from("daily_menus")
        .select("id, restaurant_id, menu_date, items, source, restaurants (id, name, address, price, district)")
        .eq("menu_date", todayStr)

      const { data: restData } = await supabase
        .from("restaurants")
        .select("id, name, address, price, district")
        .order("name")

      if (menuData) setMenus(menuData as unknown as MenuData[])
      if (restData) setAllRestaurants(restData as RestaurantInfo[])
      setLoading(false)
    }
    fetchData()
  }, [todayStr])

  const toggleBookmark = (name: string) => {
    const updated = bookmarks.includes(name)
      ? bookmarks.filter((b) => b !== name)
      : [...bookmarks, name]
    setBookmarks(updated)
    localStorage.setItem("bookmarks", JSON.stringify(updated))
  }

  const menuRestaurantIds = menus.map((m) => m.restaurant_id)
  const restaurantsWithoutMenu = allRestaurants.filter(
    (r) => !menuRestaurantIds.includes(r.id)
  )

  const filteredMenus = district === "전체" ? menus : menus.filter((m) => m.restaurants?.district === district)
  const filteredNoMenu = district === "전체" ? restaurantsWithoutMenu : restaurantsWithoutMenu.filter((r) => r.district === district)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-5 sticky top-0 z-50 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-extrabold">🍚 오늘한끼</h1>
          <p className="text-orange-100 text-sm mt-1">여의도 한식뷔페 오늘의 메뉴</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* 퀵메뉴 */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          <a href="/nearby" className="bg-white rounded-2xl p-3 text-center shadow-sm border hover:shadow-md transition">
            <div className="text-2xl mb-1">📍</div>
            <div className="text-xs font-medium text-gray-700">내 주변</div>
          </a>
          <a href="/map" className="bg-white rounded-2xl p-3 text-center shadow-sm border hover:shadow-md transition">
            <div className="text-2xl mb-1">🗺️</div>
            <div className="text-xs font-medium text-gray-700">전체지도</div>
          </a>
          <a href="/board" className="bg-white rounded-2xl p-3 text-center shadow-sm border hover:shadow-md transition">
            <div className="text-2xl mb-1">📋</div>
            <div className="text-xs font-medium text-gray-700">게시판</div>
            <div className="text-[10px] text-gray-400">(가게추천·후기·자유글)</div>
          </a>
          <a href="/bookmark" className="bg-white rounded-2xl p-3 text-center shadow-sm border hover:shadow-md transition">
            <div className="text-2xl mb-1">⭐</div>
            <div className="text-xs font-medium text-gray-700">즐겨찾기</div>
          </a>
        </div>

        {/* 날짜 선택 */}
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <button
              onClick={() => goDate(-1)}
              disabled={!canGoPrev}
              className={`text-2xl px-3 py-1 rounded-xl ${canGoPrev ? "hover:bg-gray-100 text-gray-700" : "text-gray-300 cursor-not-allowed"}`}
            >
              ◀
            </button>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                📅 {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 ({dayNames[selectedDate.getDay()]}요일)
              </p>
              {!isToday && (
                <button
                  onClick={() => setSelectedDate(new Date())}
                  className="text-xs text-orange-500 mt-1 underline"
                >
                  오늘로 돌아가기
                </button>
              )}
            </div>
            <button
              onClick={() => goDate(1)}
              disabled={!canGoNext}
              className={`text-2xl px-3 py-1 rounded-xl ${canGoNext ? "hover:bg-gray-100 text-gray-700" : "text-gray-300 cursor-not-allowed"}`}
            >
              ▶
            </button>
          </div>
        </div>

        {/* 지역 선택 */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {DISTRICTS.map((d) => (
            <button
              key={d}
              onClick={() => setDistrict(d)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                district === d
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white text-gray-600 border hover:bg-gray-50"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4 animate-pulse">🍚</p>
            <p className="text-gray-500">메뉴를 불러오는 중...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 메뉴가 있는 식당 */}
            {filteredMenus.map((menu) => {
              const items = Array.isArray(menu.items) ? menu.items.map((s: any) => typeof s === "string" ? s.trim() : s.name || String(s)) : String(menu.items).split(",").map((s) => s.trim()).filter(Boolean)
              return (
                <div key={menu.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{menu.restaurants?.name}</h3>
                      <p className="text-sm text-gray-500">{menu.restaurants?.address}</p>
                      {menu.restaurants?.price && (
                        <p className="text-sm text-orange-600 font-bold mt-1">{menu.restaurants.price}원</p>
                      )}
                    </div>
                    <button onClick={() => toggleBookmark(menu.restaurants?.name || "")} className="text-2xl">
                      {bookmarks.includes(menu.restaurants?.name || "") ? "⭐" : "☆"}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {items.map((item: string, idx: number) => {
                      const icon = getMainDishIcon(item)
                      if (icon) {
                        return (
                          <span key={idx} className="bg-orange-50 border-2 border-orange-300 text-orange-800 px-3 py-1.5 rounded-full text-sm font-bold">
                            {icon} {item}
                          </span>
                        )
                      }
                      return (
                        <span key={idx} className="bg-gray-50 border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full text-xs">
                          {item}
                        </span>
                      )
                    })}
                  </div>

                  <div className="flex gap-2">
                    <a href={`https://map.kakao.com/link/search/${encodeURIComponent(menu.restaurants?.address || "")}`} target="_blank" className="flex-1 text-center bg-yellow-400 text-yellow-900 py-2 rounded-xl text-sm font-medium">
                      카카오맵
                    </a>
                    <a href={`https://map.naver.com/v5/search/${encodeURIComponent(menu.restaurants?.address || "")}`} target="_blank" className="flex-1 text-center bg-green-500 text-white py-2 rounded-xl text-sm font-medium">
                      네이버지도
                    </a>
                  </div>
                </div>
              )
            })}

            {/* 메뉴가 없는 식당 */}
            {filteredNoMenu.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl border border-dashed border-gray-300 p-5 shadow-sm opacity-70">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{r.name}</h3>
                    <p className="text-sm text-gray-500">{r.address}</p>
                    {r.price && (
                      <p className="text-sm text-orange-600 font-bold mt-1">{r.price}원</p>
                    )}
                  </div>
                  <button onClick={() => toggleBookmark(r.name)} className="text-2xl">
                    {bookmarks.includes(r.name) ? "⭐" : "☆"}
                  </button>
                </div>
                <div className="bg-gray-100 rounded-xl p-4 text-center mb-3">
                  <p className="text-gray-400 text-sm font-medium">⏳ 아직 업데이트 전!</p>
                  <p className="text-gray-300 text-xs mt-1">사장님이 오늘 메뉴를 아직 안 올렸어요</p>
                </div>
                <div className="flex gap-2">
                  <a href={`https://map.kakao.com/link/search/${encodeURIComponent(r.address)}`} target="_blank" className="flex-1 text-center bg-yellow-400 text-yellow-900 py-2 rounded-xl text-sm font-medium">
                    카카오맵
                  </a>
                  <a href={`https://map.naver.com/v5/search/${encodeURIComponent(r.address)}`} target="_blank" className="flex-1 text-center bg-green-500 text-white py-2 rounded-xl text-sm font-medium">
                    네이버지도
                  </a>
                </div>
              </div>
            ))}

            {filteredMenus.length === 0 && filteredNoMenu.length === 0 && (
              <div className="text-center py-10">
                <p className="text-4xl mb-4">🏪</p>
                <p className="text-gray-500">해당 지역에 등록된 식당이 없습니다.</p>
              </div>
            )}
          </div>
        )}

        {/* 광고 배너 */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5 border border-blue-100">
          <p className="font-bold text-gray-800 mb-2">📢 광고/제휴 문의</p>
          <p className="text-sm text-gray-600 mb-3">한식뷔페 사장님, 밀키트/반찬 업체, 식자재 납품업체 등 제휴/광고를 원하시면 편하게 연락주세요!</p>
          <div className="flex gap-2">
            <a href="mailto:kbioin@naver.com" className="flex-1 text-center bg-blue-500 text-white py-2 rounded-xl text-sm font-medium">이메일 문의</a>
            <a href="https://open.kakao.com/o/sV5Fw9mi" target="_blank" className="flex-1 text-center bg-yellow-400 text-yellow-900 py-2 rounded-xl text-sm font-medium">카카오톡 문의</a>
          </div>
        </div>

        {/* 사장님 배너 */}
        <div className="mt-4 bg-orange-50 rounded-2xl p-5 border border-orange-200">
          <p className="font-bold text-orange-800 text-lg mb-2">🏪 한식뷔페 사장님이신가요?</p>
          <p className="text-sm text-orange-700 mb-3">무료로 매일 메뉴를 올리고, 주변 직장인들에게 홍보하세요!</p>
          <div className="flex gap-2">
            <a href="/owner/register" className="flex-1 text-center bg-orange-500 text-white py-2 rounded-xl text-sm font-bold">가게 등록하기</a>
            <a href="/owner" className="flex-1 text-center bg-white text-orange-600 border border-orange-300 py-2 rounded-xl text-sm font-bold">메뉴 올리기</a>
          </div>
        </div>

        <footer className="mt-8 mb-6 text-center text-xs text-gray-400">
          <p>© 2025 오늘한끼 | todaylunch.co.kr</p>
          <p className="mt-1">
            <a href="mailto:kbioin@naver.com" className="underline">문의</a>
            {" · "}
            <a href="https://open.kakao.com/o/sV5Fw9mi" target="_blank" className="underline">카카오톡</a>
          </p>
        </footer>
      </div>
    </div>
  )
}
