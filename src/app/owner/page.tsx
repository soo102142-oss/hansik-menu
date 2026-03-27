"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface Restaurant {
  id: string
  name: string
}

interface MenuItem {
  category: string
  name: string
}

const CATEGORIES = [
  { label: "🔥 메인", value: "메인" },
  { label: "🍲 국/찌개", value: "국/찌개" },
  { label: "🥗 반찬", value: "반찬" },
  { label: "🍚 밥/면", value: "밥/면" },
  { label: "🥬 샐러드", value: "샐러드" },
  { label: "🍰 기타", value: "기타" },
]

const OWNER_PASSWORD = "hansik2024!"

export default function OwnerPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState("")
  const [menuItems, setMenuItems] = useState<MenuItem[]>([{ category: "메인", name: "" }])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [registeredItems, setRegisteredItems] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState("")

  // 날짜 범위: 오늘 기준 앞뒤 7일
  const today = new Date()
  const minDate = new Date(today)
  minDate.setDate(today.getDate() - 7)
  const maxDate = new Date(today)
  maxDate.setDate(today.getDate() + 7)

  const formatDateStr = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

  useEffect(() => {
    setSelectedDate(formatDateStr(today))
  }, [])

  useEffect(() => {
    if (!authenticated) return
    async function fetchRestaurants() {
      const { data } = await supabase.from("restaurants").select("id, name").order("name")
      if (data) setRestaurants(data)
    }
    fetchRestaurants()
  }, [authenticated])

  const handleLogin = () => {
    if (password === OWNER_PASSWORD) {
      setAuthenticated(true)
    } else {
      alert("비밀번호가 틀렸습니다!")
    }
  }

  const addMenuItem = () => {
    setMenuItems([...menuItems, { category: "반찬", name: "" }])
  }

  const removeMenuItem = (index: number) => {
    if (menuItems.length === 1) return
    setMenuItems(menuItems.filter((_, i) => i !== index))
  }

  const updateMenuItem = (index: number, field: keyof MenuItem, value: string) => {
    const updated = [...menuItems]
    updated[index] = { ...updated[index], [field]: value }
    setMenuItems(updated)
  }

  const handleSubmit = async () => {
    if (!selectedRestaurant) {
      alert("가게를 선택해주세요!")
      return
    }
    if (!selectedDate) {
      alert("날짜를 선택해주세요!")
      return
    }
    const validItems = menuItems.filter((item) => item.name.trim())
    if (validItems.length === 0) {
      alert("메뉴를 최소 1개 입력해주세요!")
      return
    }

    setLoading(true)

    // 해당 날짜 기존 메뉴 삭제
    await supabase
      .from("daily_menus")
      .delete()
      .eq("restaurant_id", selectedRestaurant)
      .eq("menu_date", selectedDate)

    // 새 메뉴 등록
    const itemsData = validItems.map((item) => ({
      category: item.category,
      name: item.name.trim(),
    }))

    const { error } = await supabase.from("daily_menus").insert({
      restaurant_id: selectedRestaurant,
      menu_date: selectedDate,
      items: itemsData,
      source: "owner",
    })

    setLoading(false)

    if (!error) {
      setSuccess(true)
      setRegisteredItems(validItems.map((i) => i.name.trim()))
    } else {
      alert("등록 실패: " + error.message)
    }
  }

  if (success) {
    const dateObj = new Date(selectedDate + "T00:00:00")
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <p className="text-6xl mb-4">🎉</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">오늘 메뉴 등록 완료!</h2>
          <p className="text-gray-500 mb-4">
            {dateObj.getMonth() + 1}월 {dateObj.getDate()}일 메뉴가 등록되었습니다.
            <br />주변 직장인들이 지금 바로 확인할 수 있어요.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <p className="font-bold text-gray-700 mb-2">등록한 메뉴 ({registeredItems.length}개)</p>
            <div className="flex flex-wrap gap-2">
              {registeredItems.map((item, i) => (
                <span key={i} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <a href="/" className="block w-full bg-orange-500 text-white py-3 rounded-xl font-bold mb-3">
            🏠 메인 페이지에서 확인하기
          </a>
          <button
            onClick={() => {
              setSuccess(false)
              setMenuItems([{ category: "메인", name: "" }])
            }}
            className="text-orange-500 underline text-sm"
          >
            다시 등록하기
          </button>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">🔑 사장님 전용</h1>
          <p className="text-sm text-gray-500 text-center mb-6">메뉴를 등록하려면 비밀번호를 입력하세요</p>
          <input
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full p-3 border border-gray-300 rounded-xl mb-4 text-black placeholder-gray-400"
          />
          <button onClick={handleLogin} className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold">
            입장하기
          </button>
          <a href="/" className="block text-center text-sm text-gray-400 mt-4 underline">
            ← 메인으로
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-4 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <a href="/" className="text-2xl">←</a>
          <div>
            <h1 className="text-xl font-bold text-gray-900">📝 메뉴 등록</h1>
            <p className="text-xs text-gray-500">오늘의 메뉴를 등록해주세요</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* 가게 선택 */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">🏪 가게 선택</label>
          <select
            value={selectedRestaurant}
            onChange={(e) => setSelectedRestaurant(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl text-black bg-white"
          >
            <option value="" className="text-black">-- 가게를 선택하세요 --</option>
            {restaurants.map((r) => (
              <option key={r.id} value={r.id} className="text-black bg-white">
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* 날짜 선택 */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">📅 날짜 선택</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={formatDateStr(minDate)}
            max={formatDateStr(maxDate)}
            className="w-full p-3 border border-gray-300 rounded-xl text-black bg-white"
          />
          <p className="text-xs text-gray-500 mt-1">오늘 기준 앞뒤 7일 이내 날짜만 선택 가능</p>
        </div>

        {/* 메뉴 입력 */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">🍽️ 메뉴 입력</label>
          <div className="space-y-3">
            {menuItems.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <select
                  value={item.category}
                  onChange={(e) => updateMenuItem(index, "category", e.target.value)}
                  className="w-28 p-3 border border-gray-300 rounded-xl text-black bg-white text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value} className="text-black">
                      {c.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="메뉴명 입력"
                  value={item.name}
                  onChange={(e) => updateMenuItem(index, "name", e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-xl text-black placeholder-gray-400"
                />
                <button
                  onClick={() => removeMenuItem(index)}
                  className="w-10 h-10 bg-red-100 text-red-500 rounded-xl font-bold text-lg"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addMenuItem}
            className="mt-3 w-full py-3 border-2 border-dashed border-orange-300 text-orange-500 rounded-xl font-medium"
          >
            + 메뉴 추가
          </button>
        </div>

        {/* 등록 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg disabled:bg-gray-300"
        >
          {loading ? "등록 중..." : "✅ 메뉴 등록하기"}
        </button>
      </div>
    </div>
  )
}
