"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface Restaurant {
  id: string
  name: string
  address: string
  district: string
  price: string | null
  phone: string | null
  lat: number | null
  lng: number | null
}

export default function MapPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Restaurant | null>(null)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from("restaurants").select("*").order("name")
      if (data) setRestaurants(data as Restaurant[])
      setLoading(false)
    }
    fetch()
  }, [])

  useEffect(() => {
    if (loading || restaurants.length === 0) return
    if (!(window as any).kakao) {
      const script = document.createElement("script")
      script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=d47e131cb751b75e310037e87fdcbc58&autoload=false"
      script.onload = () => {
        (window as any).kakao.maps.load(() => initMap())
      }
      document.head.appendChild(script)
    } else {
      (window as any).kakao.maps.load(() => initMap())
    }
  }, [loading, restaurants])

  const initMap = () => {
    const kakao = (window as any).kakao
    const container = document.getElementById("kakao-map")
    if (!container) return

    // 여의도 중심 좌표
    const center = new kakao.maps.LatLng(37.5255, 126.9265)
    const map = new kakao.maps.Map(container, { center, level: 5 })

    const bounds = new kakao.maps.LatLngBounds()

    restaurants.forEach((r) => {
      if (!r.lat || !r.lng) return
      const position = new kakao.maps.LatLng(r.lat, r.lng)
      bounds.extend(position)

      const marker = new kakao.maps.Marker({ map, position })

      const content = `
        <div style="padding:8px 12px;font-size:13px;font-weight:bold;background:white;border:2px solid #f97316;border-radius:8px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.15);">
          🍚 ${r.name}
          ${r.price ? `<span style="color:#f97316;margin-left:4px;">${r.price}원</span>` : ""}
        </div>
      `
      const overlay = new kakao.maps.CustomOverlay({
        content,
        position,
        yAnchor: 2.2,
      })
      overlay.setMap(map)

      kakao.maps.event.addListener(marker, "click", () => {
        setSelected(r)
      })
    })

    if (restaurants.filter((r) => r.lat && r.lng).length > 1) {
      map.setBounds(bounds)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-4 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <a href="/" className="text-2xl">←</a>
          <div>
            <h1 className="text-xl font-bold text-orange-700">🗺️ 전체 지도</h1>
            <p className="text-xs text-gray-400">등록된 한식뷔페 위치를 한눈에!</p>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4 animate-pulse">🗺️</p>
          <p className="text-gray-500">지도를 불러오는 중...</p>
        </div>
      ) : (
        <>
          <div id="kakao-map" className="w-full" style={{ height: "60vh" }} />

          {/* 선택된 가게 정보 */}
          {selected && (
            <div className="max-w-3xl mx-auto px-4 py-3">
              <div className="bg-white rounded-2xl border-2 border-orange-300 p-4 shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{selected.name}</h3>
                    <p className="text-sm text-gray-500">{selected.address}</p>
                    <div className="flex items-center gap-3 mt-1">
                      {selected.price && <span className="text-sm text-orange-600 font-bold">{selected.price}원</span>}
                      {selected.phone && <a href={`tel:${selected.phone}`} className="text-sm text-blue-600">{selected.phone}</a>}
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-gray-400 text-xl">✕</button>
                </div>
                <div className="flex gap-2 mt-3">
                  <a href={`https://map.kakao.com/link/search/${encodeURIComponent(selected.address)}`} target="_blank" className="flex-1 text-center bg-yellow-400 text-yellow-900 py-2 rounded-xl text-sm font-medium">카카오맵</a>
                  <a href={`https://map.naver.com/v5/search/${encodeURIComponent(selected.address)}`} target="_blank" className="flex-1 text-center bg-green-500 text-white py-2 rounded-xl text-sm font-medium">네이버지도</a>
                </div>
              </div>
            </div>
          )}

          {/* 가게 리스트 */}
          <div className="max-w-3xl mx-auto px-4 py-4">
            <p className="text-sm text-gray-500 mb-3">총 {restaurants.length}개 식당 등록</p>
            <div className="space-y-2">
              {restaurants.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className={`bg-white rounded-xl border p-3 cursor-pointer hover:shadow-md transition ${
                    selected?.id === r.id ? "border-orange-400 shadow-md" : "border-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-900">{r.name}</p>
                      <p className="text-xs text-gray-500">{r.address}</p>
                    </div>
                    <div className="text-right">
                      {r.price && <p className="text-sm text-orange-600 font-bold">{r.price}원</p>}
                      {!r.lat && <p className="text-xs text-red-400">📍 좌표 없음</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
