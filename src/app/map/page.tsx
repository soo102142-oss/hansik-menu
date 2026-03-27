"use client"

import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase"

interface Restaurant {
  id: string
  name: string
  address: string
  district: string
  price: string | null
  phone: string | null
}

export default function MapPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Restaurant | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from("restaurants").select("*").order("name")
      if (data) setRestaurants(data as Restaurant[])
      setLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (loading || restaurants.length === 0 || !mapRef.current) return

    const script = document.createElement("script")
    script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=d47e131cb751b75e310037e87fdcbc58&libraries=services&autoload=false"
    document.head.appendChild(script)

    script.onload = () => {
      const kakao = (window as any).kakao
      kakao.maps.load(() => {
        const container = mapRef.current
        const center = new kakao.maps.LatLng(37.5225, 126.9265)
        const map = new kakao.maps.Map(container, { center, level: 5 })
        const geocoder = new kakao.maps.services.Geocoder()

        restaurants.forEach((r) => {
          geocoder.addressSearch(r.address, (result: any, status: any) => {
            if (status === kakao.maps.services.Status.OK) {
              const coords = new kakao.maps.LatLng(result[0].y, result[0].x)
              const marker = new kakao.maps.Marker({ map, position: coords })

              const label = document.createElement("div")
              label.innerHTML = `
                <div style="padding:5px 10px;font-size:12px;font-weight:bold;background:white;border:2px solid #f97316;border-radius:8px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.15);">
                  🍚 ${r.name} ${r.price ? `<span style="color:#f97316;">${r.price}원</span>` : ""}
                </div>
              `
              const overlay = new kakao.maps.CustomOverlay({
                content: label,
                position: coords,
                yAnchor: 2.5,
              })
              overlay.setMap(map)

              kakao.maps.event.addListener(marker, "click", () => {
                setSelected(r)
                map.setCenter(coords)
              })
            }
          })
        })
      })
    }
  }, [loading, restaurants])

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
          <div ref={mapRef} className="w-full" style={{ height: "55vh" }} />

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
                    {r.price && <p className="text-sm text-orange-600 font-bold">{r.price}원</p>}
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
