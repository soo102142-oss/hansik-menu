"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

// ★ 사장님 비밀번호 (나중에 가게별로 따로 설정)
const OWNER_PASSWORD = "hansik2026"

const MENU_PRESETS: Record<string, string[]> = {
  "🔥 메인": [
    "제육볶음", "불고기", "소불고기", "오징어볶음", "닭볶음탕",
    "고등어구이", "삼치구이", "갈치구이", "돈까스", "갈비찜",
    "두부조림", "생선까스", "장조림", "떡갈비", "수육",
    "치킨", "탕수육", "카레", "비빔밥", "볶음밥",
  ],
  "🍲 국/찌개": [
    "된장찌개", "김치찌개", "순두부찌개", "동태찌개", "부대찌개",
    "미역국", "콩나물국", "소고기무국", "북어국", "우거지국",
    "갈비탕", "설렁탕", "삼계탕", "뼈해장국", "어묵국",
  ],
  "🥬 반찬": [
    "시금치나물", "콩나물무침", "감자조림", "어묵볶음", "계란말이",
    "미역줄기볶음", "고사리나물", "잡채", "파전", "호박볶음",
    "멸치볶음", "오징어채볶음", "깻잎절임", "무생채", "도라지나물",
    "브로콜리", "샐러드", "두부부침", "동그랑땡", "만두",
  ],
  "🥒 김치": [
    "배추김치", "깍두기", "파김치", "총각김치", "겉절이",
    "열무김치", "오이소박이", "부추김치",
  ],
  "🍚 밥/면": [
    "백미밥", "흑미밥", "잡곡밥", "볶음밥", "비빔밥",
    "잔치국수", "쫄면", "냉면",
  ],
  "🍊 후식": [
    "과일", "커피", "식혜", "떡", "요거트", "음료수",
  ],
}

const RESTAURANTS = [
  { id: "11111111-1111-1111-1111-111111111111", name: "삼성한식뷔페" },
  { id: "22222222-2222-2222-2222-222222222222", name: "서울한식뷔페" },
  { id: "33333333-3333-3333-3333-333333333333", name: "대성한식뷔페" },
  { id: "44444444-4444-4444-4444-444444444444", name: "블레드 여의도보훈점" },
]

export default function OwnerPage() {
  // ★ 비밀번호 잠금 상태
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const [selectedMenus, setSelectedMenus] = useState<
    { name: string; category: string }[]
  >([])
  const [customInput, setCustomInput] = useState("")
  const [selectedShop, setSelectedShop] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const today = new Date()
  const month = today.getMonth() + 1
  const day = today.getDate()
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"]
  const dayName = dayNames[today.getDay()]

  // ★ 비밀번호 확인
  const checkPassword = () => {
    if (passwordInput === OWNER_PASSWORD) {
      setIsUnlocked(true)
      setPasswordError("")
    } else {
      setPasswordError("비밀번호가 틀렸습니다")
    }
  }

  const toggleMenu = (name: string, category: string) => {
    setSelectedMenus((prev) => {
      const exists = prev.find((m) => m.name === name)
      if (exists) {
        return prev.filter((m) => m.name !== name)
      }
      return [...prev, { name, category }]
    })
  }

  const addCustom = () => {
    const name = customInput.trim()
    if (!name) return
    if (selectedMenus.find((m) => m.name === name)) return
    setSelectedMenus((prev) => [...prev, { name, category: "기타" }])
    setCustomInput("")
  }

  const clearAll = () => {
    setSelectedMenus([])
  }

  const handleSubmit = async () => {
    if (selectedMenus.length === 0) return
    if (!selectedShop) {
      setErrorMsg("가게를 선택해주세요!")
      return
    }

    setIsLoading(true)
    setErrorMsg("")

    const todayStr =
      today.getFullYear() + "-" +
      String(today.getMonth() + 1).padStart(2, "0") + "-" +
      String(today.getDate()).padStart(2, "0")

    const { error } = await supabase
      .from("daily_menus")
      .upsert(
        {
          restaurant_id: selectedShop,
          menu_date: todayStr,
          items: selectedMenus,
          source: "owner",
        },
        { onConflict: "restaurant_id,menu_date" }
      )

    setIsLoading(false)

    if (error) {
      setErrorMsg("저장 실패: " + error.message)
    } else {
      setIsSubmitted(true)
    }
  }

  // ★ 비밀번호 입력 화면 (잠금 상태)
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl border shadow-sm p-8 max-w-sm w-full mx-4">
          <div className="text-center mb-6">
            <p className="text-5xl mb-3">🔒</p>
            <h1 className="text-xl font-bold text-gray-900">사장님 전용 페이지</h1>
            <p className="text-sm text-gray-400 mt-1">
              비밀번호를 입력해주세요
            </p>
          </div>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => {
              setPasswordInput(e.target.value)
              setPasswordError("")
            }}
            onKeyDown={(e) => e.key === "Enter" && checkPassword()}
            placeholder="비밀번호 입력"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-center
                       focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          {passwordError && (
            <p className="text-red-500 text-xs text-center mt-2">
              ⚠️ {passwordError}
            </p>
          )}
          <button
            onClick={checkPassword}
            className="w-full mt-4 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition"
          >
            입장하기
          </button>
          <a
            href="/"
            className="block text-center text-sm text-gray-400 mt-4 hover:text-orange-600"
          >
            ← 메인 페이지로
          </a>
        </div>
      </div>
    )
  }

  // 등록 완료 화면
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-7xl mb-6">🎉</p>
          <h1 className="text-2xl font-bold text-gray-900">
            오늘 메뉴 등록 완료!
          </h1>
          <p className="text-gray-500 mt-2">
            {month}월 {day}일 메뉴가 등록되었습니다.
            <br />
            주변 직장인들이 지금 바로 확인할 수 있어요.
          </p>
          <div className="mt-6 bg-white rounded-2xl border p-4 text-left">
            <p className="text-sm font-bold text-gray-700 mb-2">
              등록한 메뉴 ({selectedMenus.length}개)
            </p>
            <div className="flex flex-wrap gap-1.5">
              {selectedMenus.map((m, i) => (
                <span
                  key={i}
                  className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-lg text-sm"
                >
                  {m.name}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <a
              href="/"
              className="bg-orange-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-orange-700 transition inline-block"
            >
              🏠 메인 페이지에서 확인하기
            </a>
            <button
              onClick={() => {
                setIsSubmitted(false)
                setSelectedMenus([])
              }}
              className="text-orange-600 underline text-sm"
            >
              다시 등록하기
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 메뉴 등록 화면
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white border-b px-4 py-4 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-orange-700">
              🍚 오늘한끼 · 메뉴 등록
            </h1>
            <p className="text-sm text-gray-400">
              {month}월 {day}일 ({dayName}요일) 메뉴
            </p>
          </div>
          <a href="/" className="text-sm text-gray-400 hover:text-orange-600">
            ← 메인
          </a>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-700">
            🏪 가게 선택
          </label>
          <select
            value={selectedShop}
            onChange={(e) => {
              setSelectedShop(e.target.value)
              setErrorMsg("")
            }}
            className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="">-- 가게를 선택하세요 --</option>
            {RESTAURANTS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          {errorMsg && (
            <p className="text-red-500 text-xs mt-1">⚠️ {errorMsg}</p>
          )}
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4">
          <p className="text-sm text-orange-700 font-medium">
            👇 오늘 메뉴를 탭해서 선택하세요 (터치만 하면 됩니다!)
          </p>
        </div>

        {selectedMenus.length > 0 && (
          <div className="bg-white border border-orange-200 rounded-2xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-bold text-gray-700">
                ✅ 선택한 메뉴 ({selectedMenus.length}개)
              </p>
              <button
                onClick={clearAll}
                className="text-xs text-red-400 hover:text-red-600"
              >
                전체삭제
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedMenus.map((m, i) => (
                <button
                  key={i}
                  onClick={() => toggleMenu(m.name, m.category)}
                  className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 
                             px-2.5 py-1 rounded-lg text-sm hover:bg-red-100 hover:text-red-600 transition"
                >
                  {m.name} ✕
                </button>
              ))}
            </div>
          </div>
        )}

        {Object.entries(MENU_PRESETS).map(([category, menus]) => (
          <div key={category} className="mb-5">
            <h3 className="text-sm font-bold text-gray-800 mb-2">
              {category}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {menus.map((name) => {
                const isSelected = selectedMenus.some((m) => m.name === name)
                return (
                  <button
                    key={name}
                    onClick={() => toggleMenu(name, category)}
                    className={`px-3 py-1.5 rounded-full text-sm transition
                      ${
                        isSelected
                          ? "bg-orange-600 text-white font-medium shadow-sm"
                          : "bg-white border border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-600"
                      }`}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {name}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-800 mb-2">
            ✏️ 목록에 없는 메뉴 직접 입력
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustom()}
              placeholder="메뉴 이름 입력 후 추가"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              onClick={addCustom}
              className="px-5 py-2.5 bg-gray-800 text-white rounded-xl text-sm font-medium hover:bg-gray-900"
            >
              추가
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleSubmit}
            disabled={selectedMenus.length === 0 || isLoading}
            className={`w-full py-4 rounded-2xl text-base font-bold transition
              ${
                selectedMenus.length > 0 && !isLoading
                  ? "bg-orange-600 text-white hover:bg-orange-700 shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            {isLoading
              ? "⏳ 등록 중..."
              : selectedMenus.length > 0
              ? `📝 오늘 메뉴 등록하기 (${selectedMenus.length}개)`
              : "메뉴를 선택해주세요"}
          </button>
        </div>
      </div>
    </div>
  )
}
