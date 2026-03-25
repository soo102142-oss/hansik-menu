"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

const DISTRICT_OPTIONS = [
  { value: "yeouido", label: "여의도" },
  { value: "gangnam", label: "강남" },
  { value: "jongro", label: "종로/광화문" },
  { value: "guro", label: "구로/가산" },
  { value: "mapo", label: "마포/홍대" },
  { value: "songpa", label: "송파/잠실" },
  { value: "yeongdeungpo", label: "영등포" },
  { value: "gurodidigtal", label: "구로디지털단지" },
  { value: "other_seoul", label: "서울 기타" },
  { value: "gyeonggi", label: "경기도" },
  { value: "other", label: "기타 지역" },
]

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [district, setDistrict] = useState("")
  const [price, setPrice] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [newShopId, setNewShopId] = useState("")

  const handleSubmit = async () => {
    // 필수 입력 확인
    if (!name.trim()) {
      setErrorMsg("가게 이름을 입력해주세요")
      return
    }
    if (!address.trim()) {
      setErrorMsg("주소를 입력해주세요")
      return
    }
    if (!district) {
      setErrorMsg("지역을 선택해주세요")
      return
    }

    setIsLoading(true)
    setErrorMsg("")

    const { data, error } = await supabase
      .from("restaurants")
      .insert({
        name: name.trim(),
        address: address.trim(),
        district: district,
        price: price.trim() || null,
        phone: phone.trim() || null,
      })
      .select("id")
      .single()

    setIsLoading(false)

    if (error) {
      setErrorMsg("등록 실패: " + error.message)
    } else {
      setNewShopId(data.id)
      setIsSubmitted(true)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-6 max-w-md">
          <p className="text-7xl mb-6">🎊</p>
          <h1 className="text-2xl font-bold text-gray-900">
            가게 등록 완료!
          </h1>
          <p className="text-gray-500 mt-2">
            <span className="font-bold text-orange-600">{name}</span>이(가)
            등록되었습니다.
          </p>

          <div className="mt-6 bg-white rounded-2xl border p-4 text-left">
            <p className="text-sm font-bold text-gray-700 mb-2">등록 정보</p>
            <div className="space-y-1 text-sm text-gray-600">
              <p>🏪 {name}</p>
              <p>📍 {address}</p>
              {price && <p>💰 {price}원</p>}
              {phone && <p>📞 {phone}</p>}
            </div>
          </div>

          <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-3">
            <p className="text-sm text-orange-700">
              💡 관리자 확인 후 메뉴 등록이 가능합니다.
              <br />
              빠른 승인을 원하시면 카카오톡으로 문의해주세요!
            </p>
            <a
              href="https://open.kakao.com/o/sV5Fw9mi"
              target="_blank"
              className="inline-block mt-2 bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-500 transition"
            >
              💬 카카오톡 문의하기
            </a>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <a
              href="/"
              className="bg-orange-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-orange-700 transition inline-block"
            >
              🏠 메인 페이지로
            </a>
            <button
              onClick={() => {
                setIsSubmitted(false)
                setName("")
                setAddress("")
                setDistrict("")
                setPrice("")
                setPhone("")
              }}
              className="text-orange-600 underline text-sm"
            >
              다른 가게도 등록하기
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 헤더 */}
      <header className="bg-white border-b px-4 py-4 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-orange-700">
              🍚 오늘한끼 · 새 가게 등록
            </h1>
            <p className="text-sm text-gray-400">
              한식뷔페 사장님 가게를 등록하세요
            </p>
          </div>
          <a href="/" className="text-sm text-gray-400 hover:text-orange-600">
            ← 메인
          </a>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* 안내 */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-bold text-orange-800">
            📋 가게 등록 안내
          </p>
          <ul className="text-sm text-orange-700 mt-2 space-y-1">
            <li>✅ 가게 등록은 무료입니다</li>
            <li>✅ 등록 후 매일 메뉴를 올릴 수 있습니다</li>
            <li>✅ 주변 직장인들에게 자동으로 노출됩니다</li>
          </ul>
        </div>

        {/* 가게 이름 (필수) */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-gray-700">
            🏪 가게 이름 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setErrorMsg("")
            }}
            placeholder="예: 삼성한식뷔페"
            className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* 지역 선택 (필수) */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-gray-700">
            📍 지역 <span className="text-red-500">*</span>
          </label>
          <select
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value)
              setErrorMsg("")
            }}
            className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="">-- 지역을 선택하세요 --</option>
            {DISTRICT_OPTIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* 상세 주소 (필수) */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-gray-700">
            📍 상세 주소 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value)
              setErrorMsg("")
            }}
            placeholder="예: 여의나루로 77-1 월드비전빌딩 지하1층"
            className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <p className="text-xs text-gray-400 mt-1">
            건물명까지 상세히 적어주시면 고객이 찾기 쉬워요
          </p>
        </div>

        {/* 가격 (선택) */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-gray-700">
            💰 1인 가격 (선택)
          </label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="예: 9,000"
            className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* 전화번호 (선택) */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-gray-700">
            📞 전화번호 (선택)
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="예: 02-1234-5678"
            className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* 에러 메시지 */}
        {errorMsg && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-sm text-red-600">⚠️ {errorMsg}</p>
          </div>
        )}
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl text-base font-bold transition
              ${
                isLoading
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-orange-600 text-white hover:bg-orange-700 shadow-lg"
              }`}
          >
            {isLoading ? "⏳ 등록 중..." : "🏪 가게 등록하기"}
          </button>
        </div>
      </div>
    </div>
  )
}
