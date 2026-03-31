"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface Restaurant {
  id: string
  name: string
}

const OWNER_PASSWORD = "hansik2024!"

// 한식뷔페 메뉴 사전 (거의 모든 메뉴 포함)
const MENU_DB: Record<string, string> = {
  // 🔥 메인 - 고기
  "제육볶음": "메인", "제육": "메인", "돼지불고기": "메인", "불고기": "메인", "소불고기": "메인",
  "닭갈비": "메인", "춘천닭갈비": "메인", "치즈닭갈비": "메인",
  "닭볶음탕": "메인", "닭볶음": "메인", "닭도리탕": "메인",
  "닭강정": "메인", "양념치킨": "메인", "후라이드치킨": "메인", "치킨": "메인", "치킨너겟": "메인",
  "돈까스": "메인", "돈가스": "메인", "치즈돈까스": "메인", "경양식돈까스": "메인",
  "탕수육": "메인", "찹쌀탕수육": "메인",
  "갈비찜": "메인", "LA갈비": "메인", "갈비": "메인", "돼지갈비": "메인",
  "수육": "메인", "보쌈": "메인", "족발": "메인",
  "삼겹살": "메인", "오겹살": "메인", "목살": "메인",
  "장조림": "메인", "소고기장조림": "메인",
  "닭가슴살": "메인", "닭봉조림": "메인", "닭봉볶음": "메인", "닭날개": "메인",
  "함박스테이크": "메인", "함박": "메인", "스테이크": "메인",
  "미트볼": "메인", "토마토미트볼": "메인",
  "소세지": "메인", "소시지": "메인", "비엔나소세지": "메인", "비엔나소시지": "메인",
  "소세지전": "메인", "소시지전": "메인",
  "두부조림": "메인", "두부두루치기": "메인",
  "오징어볶음": "메인", "오징어채볶음": "메인", "낙지볶음": "메인", "쭈꾸미볶음": "메인",
  "제육덮밥": "메인", "카레라이스": "메인", "카레": "메인", "커리": "메인",
  "마파두부": "메인", "마파두부덮밥": "메인",
  "닭매콤찜": "메인", "닭고기매콤찜": "메인",
  "간장불고기": "메인", "간장닭": "메인", "간장찜닭": "메인", "찜닭": "메인",
  "고추장불고기": "메인", "고추장삼겹살": "메인",
  "떡갈비": "메인", "동그랑땡": "메인",
  "너비아니": "메인", "언양불고기": "메인",
  "돼지두루치기": "메인", "두루치기": "메인",
  "고등어조림": "메인", "고등어구이": "메인", "고등어": "메인",
  "갈치구이": "메인", "갈치조림": "메인", "갈치": "메인",
  "삼치구이": "메인", "삼치": "메인",
  "조기구이": "메인", "조기": "메인", "굴비": "메인",
  "꽁치구이": "메인", "꽁치조림": "메인",
  "생선구이": "메인", "생선조림": "메인", "생선까스": "메인", "생선가스": "메인", "생선커틀릿": "메인",
  "명태조림": "메인", "명태구이": "메인", "동태전": "메인",
  "코다리조림": "메인", "코다리찜": "메인",
  "연어구이": "메인", "연어": "메인",
  "새우튀김": "메인", "새우까스": "메인",
  "에그스크램블": "메인", "스크램블에그": "메인",
  "계란말이": "메인", "계란찜": "메인", "달걀말이": "메인", "달걀찜": "메인",
  "크림스파게티": "메인", "스파게티": "메인", "파스타": "메인",
  "토마토파스타": "메인", "로제파스타": "메인", "알리오올리오": "메인",
  "잡채": "메인", "잡채밥": "메인",

  // 🍲 국/찌개
  "된장찌개": "국/찌개", "된장국": "국/찌개", "된장": "국/찌개",
  "김치찌개": "국/찌개", "김치국": "국/찌개",
  "순두부찌개": "국/찌개", "순두부": "국/찌개",
  "부대찌개": "국/찌개",
  "동태찌개": "국/찌개", "동태탕": "국/찌개",
  "미역국": "국/찌개", "쇠고기미역국": "국/찌개",
  "콩나물국": "국/찌개", "콩나물국밥": "국/찌개",
  "얼큰콩나물국": "국/찌개",
  "시래기국": "국/찌개", "시래기된장국": "국/찌개",
  "배추된장국": "국/찌개",
  "육개장": "국/찌개",
  "설렁탕": "국/찌개",
  "갈비탕": "국/찌개", "소갈비탕": "국/찌개",
  "뼈해장국": "국/찌개", "해장국": "국/찌개",
  "감자탕": "국/찌개",
  "사골국": "국/찌개", "사골탕": "국/찌개",
  "어묵국": "국/찌개", "어묵탕": "국/찌개", "오뎅국": "국/찌개",
  "떡국": "국/찌개", "만둣국": "국/찌개", "떡만둣국": "국/찌개",
  "소고기무국": "국/찌개", "무국": "국/찌개",
  "달걀국": "국/찌개", "계란국": "국/찌개",
  "조개탕": "국/찌개", "바지락국": "국/찌개",
  "북어국": "국/찌개", "북엇국": "국/찌개",
  "우거지국": "국/찌개", "우거지탕": "국/찌개",
  "청국장": "국/찌개", "청국장찌개": "국/찌개",
  "추어탕": "국/찌개",
  "삼계탕": "국/찌개",
  "들깨수제비": "국/찌개", "수제비": "국/찌개",
  "새우사골금치국": "국/찌개",
  "시래기닭볶음탕": "국/찌개",
  "양송이수프": "국/찌개", "크림수프": "국/찌개", "수프": "국/찌개",
  "배추국": "국/찌개", "아욱국": "국/찌개",

  // 🍚 밥/면
  "흰밥": "밥/면", "잡곡밥": "밥/면", "현미밥": "밥/면", "보리밥": "밥/면",
  "볶음밥": "밥/면", "김치볶음밥": "밥/면", "새우볶음밥": "밥/면", "햄야채볶음밥": "밥/면",
  "비빔밥": "밥/면", "돌솥비빔밥": "밥/면",
  "덮밥": "밥/면", "오므라이스": "밥/면",
  "짜장면": "밥/면", "짜장": "밥/면", "짬뽕": "밥/면",
  "우동": "밥/면", "잔치국수": "밥/면", "국수": "밥/면",
  "쫄면": "밥/면", "비빔면": "밥/면", "냉면": "밥/면",
  "라면": "밥/면", "라볶이": "밥/면",
  "칼국수": "밥/면",
  "샌드위치": "밥/면",

  // 🥗 반찬
  "시금치나물": "반찬", "시금치무침": "반찬", "시금치": "반찬",
  "콩나물": "반찬", "콩나물무침": "반찬", "콩나물볶음": "반찬",
  "숙주나물": "반찬", "숙주나물무침": "반찬", "숙주": "반찬",
  "배추김치": "반찬", "김치": "반찬", "깍두기": "반찬", "총각김치": "반찬",
  "열무김치": "반찬", "열무겉절이": "반찬", "겉절이": "반찬",
  "무생채": "반찬", "무나물": "반찬", "무조림": "반찬",
  "단무지": "반찬", "단무지무침": "반찬",
  "오이무침": "반찬", "오이소박이": "반찬", "오이": "반찬",
  "양배추샐러드": "반찬", "양배추": "반찬", "양배추쌈": "반찬",
  "마늘고추지": "반찬", "고추지": "반찬",
  "유채나물무침": "반찬", "유채나물": "반찬",
  "파래무침": "반찬", "파래": "반찬",
  "미역줄기볶음": "반찬", "미역줄기": "반찬",
  "도라지무침": "반찬", "도라지나물": "반찬",
  "고사리나물": "반찬", "고사리볶음": "반찬", "고사리": "반찬",
  "취나물": "반찬",
  "브로콜리": "반찬", "브로콜리무침": "반찬",
  "감자조림": "반찬", "감자볶음": "반찬", "감자샐러드": "반찬",
  "고구마": "반찬", "고구마맛탕": "반찬", "맛탕": "반찬",
  "어묵볶음": "반찬", "어묵": "반찬", "오뎅볶음": "반찬",
  "맛살오뎅채볶음": "반찬",
  "진미채볶음": "반찬", "진미채": "반찬",
  "멸치볶음": "반찬", "멸치": "반찬", "건멸치볶음": "반찬",
  "김볶음": "반찬", "김": "반찬", "김구이": "반찬",
  "장아찌": "반찬", "깻잎장아찌": "반찬", "양파장아찌": "반찬",
  "깻잎": "반찬", "깻잎무침": "반찬",
  "쑥갓두부무침": "반찬", "쑥갓": "반찬",
  "청포묵": "반찬", "묵무침": "반찬", "묵": "반찬", "도토리묵": "반찬",
  "무말랭이무침": "반찬", "무말랭이": "반찬",
  "연근조림": "반찬", "연근": "반찬",
  "우엉조림": "반찬", "우엉": "반찬",
  "호박볶음": "반찬", "애호박볶음": "반찬", "호박전": "반찬",
  "가지볶음": "반찬", "가지나물": "반찬",
  "부추무침": "반찬", "부추전": "반찬", "부추": "반찬",
  "떡볶이": "반찬", "떡꼬치": "반찬",
  "만두": "반찬", "군만두": "반찬", "찐만두": "반찬", "물만두": "반찬",
  "튀김": "반찬", "모듬튀김": "반찬", "야채튀김": "반찬",
  "전": "반찬", "부침개": "반찬", "김치전": "반찬", "파전": "반찬", "해물파전": "반찬",
  "소세재볶음": "반찬", "소세지볶음": "반찬",
  "피자": "반찬",
  "샐러드": "반찬", "과일": "반찬", "과일샐러드": "반찬",
  "흑임자죽": "밥/면", "죽": "밥/면",
}

function findMenu(input: string): { name: string; category: string } | null {
  const trimmed = input.trim()
  if (!trimmed || trimmed.length < 1) return null

  // 정확히 일치
  if (MENU_DB[trimmed]) {
    return { name: trimmed, category: MENU_DB[trimmed] }
  }

  // 부분 일치 (DB에 있는 메뉴가 입력에 포함)
  for (const [menu, cat] of Object.entries(MENU_DB)) {
    if (trimmed.includes(menu) && menu.length >= 2) {
      return { name: trimmed, category: cat }
    }
  }

  // 입력이 DB 메뉴에 포함
  for (const [menu, cat] of Object.entries(MENU_DB)) {
    if (menu.includes(trimmed) && trimmed.length >= 2) {
      return { name: trimmed, category: cat }
    }
  }

  // 못 찾으면 반찬으로
  return { name: trimmed, category: "반찬" }
}

export default function OwnerPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState("")
  const [bulkText, setBulkText] = useState("")
  const [parsedItems, setParsedItems] = useState<{ category: string; name: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [registeredItems, setRegisteredItems] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState("")
  const [mode, setMode] = useState<"bulk" | "preview">("bulk")

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

  const handleParse = () => {
    if (!bulkText.trim()) {
      alert("메뉴를 입력해주세요!")
      return
    }

    const items: { category: string; name: string }[] = []

    // 쉼표, 줄바꿈, 띄어쓰기, · 등으로 분리
    const tokens = bulkText
      .split(/[,，、·\n]+/)
      .flatMap((chunk) => {
        const trimmed = chunk.trim()
        // 띄어쓰기로 분리 시도
        if (trimmed.includes(" ")) {
          const words = trimmed.split(/\s+/)
          // 각 단어가 메뉴DB에 있는지 확인
          const allFound = words.every((w) => findMenu(w) !== null && w.length >= 2)
          if (allFound && words.length >= 2) {
            return words
          }
        }
        return [trimmed]
      })
      .filter((t) => t.length >= 1)

    for (const token of tokens) {
      const result = findMenu(token)
      if (result && result.name.length >= 1) {
        // 중복 방지
        if (!items.find((i) => i.name === result.name)) {
          items.push(result)
        }
      }
    }

    setParsedItems(items)
    setMode("preview")
  }

  const updateItemCategory = (index: number, category: string) => {
    const updated = [...parsedItems]
    updated[index] = { ...updated[index], category }
    setParsedItems(updated)
  }

  const removeItem = (index: number) => {
    setParsedItems(parsedItems.filter((_, i) => i !== index))
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
    if (parsedItems.length === 0) {
      alert("메뉴가 없습니다!")
      return
    }

    setLoading(true)

    // ✅ 1단계: 기존 메뉴 삭제
    const { error: deleteError } = await supabase
      .from("daily_menus")
      .delete()
      .eq("restaurant_id", selectedRestaurant)
      .eq("menu_date", selectedDate)

    if (deleteError) {
      console.error("삭제 에러:", deleteError)
      alert("기존 메뉴 삭제 실패: " + deleteError.message)
      setLoading(false)
      return
    }

    // ✅ 2단계: 새 메뉴 저장
    const itemsData = parsedItems.map((item) => ({
      category: item.category,
      name: item.name,
    }))

    console.log("저장할 데이터:", {
      restaurant_id: selectedRestaurant,
      menu_date: selectedDate,
      items: itemsData,
      source: "owner",
    })

    const { data, error: insertError } = await supabase
      .from("daily_menus")
      .insert({
        restaurant_id: selectedRestaurant,
        menu_date: selectedDate,
        items: itemsData,
        source: "owner",
      })
      .select()

    setLoading(false)

    if (insertError) {
      console.error("저장 에러:", insertError)
      alert("등록 실패: " + insertError.message)
    } else {
      console.log("저장 성공:", data)
      setSuccess(true)
      setRegisteredItems(parsedItems.map((i) => i.name))
    }
  }

  if (success) {
    const dateObj = new Date(selectedDate + "T00:00:00")
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-6 max-w-md">
          <p className="text-7xl mb-6">🎉</p>
          <h1 className="text-2xl font-bold text-gray-900">
            메뉴 등록 완료!
          </h1>
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
              setBulkText("")
              setParsedItems([])
              setMode("bulk")
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
            <p className="text-xs text-gray-500">메뉴를 한번에 입력하세요</p>
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
        </div>

        {mode === "bulk" ? (
          <>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">🍽️ 메뉴 입력</label>
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-3 text-sm text-green-800">
                <p className="font-bold mb-1">💡 그냥 메뉴 이름만 쭉 쓰세요!</p>
                <p>예시: <span className="font-mono bg-white px-1 rounded">제육볶음 된장찌개 시금치무침 콩나물 배추김치</span></p>
                <p className="text-xs text-green-600 mt-1">띄어쓰기, 쉼표, 줄바꿈 다 상관없이 자동 분류됩니다!</p>
              </div>
              <textarea
                placeholder="제육볶음 된장찌개 시금치무침 콩나물 배추김치"
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                rows={6}
                className="w-full p-4 border border-gray-300 rounded-xl text-black placeholder-gray-400 resize-none text-sm leading-relaxed"
              />
            </div>

            <button
              onClick={handleParse}
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg"
            >
              📋 자동 분류 미리보기
            </button>
          </>
        ) : (
          <>
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-gray-900">📋 자동 분류 결과 ({parsedItems.length}개)</label>
                <button onClick={() => setMode("bulk")} className="text-sm text-orange-500 underline">
                  ← 다시 입력
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-3">카테고리가 틀리면 눌러서 바꿀 수 있어요!</p>
              <div className="space-y-2">
                {parsedItems.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center bg-white rounded-xl border p-3">
                    <select
                      value={item.category}
                      onChange={(e) => updateItemCategory(index, e.target.value)}
                      className="w-24 p-2 border border-gray-300 rounded-lg text-black bg-white text-xs"
                    >
                      <option value="메인" className="text-black">🔥 메인</option>
                      <option value="국/찌개" className="text-black">🍲 국/찌개</option>
                      <option value="반찬" className="text-black">🥗 반찬</option>
                      <option value="밥/면" className="text-black">🍚 밥/면</option>
                      <option value="샐러드" className="text-black">🥬 샐러드</option>
                      <option value="기타" className="text-black">🍰 기타</option>
                    </select>
                    <span className="flex-1 text-black font-medium">{item.name}</span>
                    <button
                      onClick={() => removeItem(index)}
                      className="w-8 h-8 bg-red-100 text-red-500 rounded-lg text-sm font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg disabled:bg-gray-300"
            >
              {loading ? "⏳ 등록 중..." : "✅ 메뉴 등록하기"}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
