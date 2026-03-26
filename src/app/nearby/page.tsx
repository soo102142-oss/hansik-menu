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

function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function NearbyPage() {
  const [myLat, setMyLat] = useState<number | null>(null)
  const [myLng, setMyLng] = useState<number | null>(null)
  const [restaurants, setRestaurants] = useState<
    (Restaurant & { distance?: number })[]
  >([])
  const [loading, setLoading] = useState(true)
  const [locationError, setLocationError] = useState("")
  const [locationFound, setLocationFound] = useState(false)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("이 브라우저에서는 위치 서비스를 지원하지 않습니다.")
      fetchAllRestaurants()
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMyLat(pos.coords.latitude)
        setMyLng(pos.coords.longitude)
        setLocationFound(true)
      },
      () => {
        setLocationError("위치 권한이 거부되었습니다. 전체 가게 목록을 표시합니다.")
        fetchAllRestaurants()
      },
      { timeout: 5000 }
    )
  }, [])

  async function fetchAllRestaurants() {
    const { data } = await supabase.from("restaurants").select("*")
    if (data) setRestaurants(data as Restaurant[])
    setLoading(false)
  }

  useEffect(() => {
    if (myLat === null || myLng === null) return
    async function fetchWithDistance() {
      const { data } = await supabase.from("restaurants").select("*")
      if (data) {
        const withDistance = (data as Restaurant[]).map((r) => {
          if (r.lat && r.lng) {
            return {
              ...r,
              distance: getDistanceKm(myLat!, myLng!, r.lat, r.lng),
            }
          }
          return { ...r, distance: 999 }
        })
        withDistance.sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999))
        setRestaurants(withDistance)
      }
      setLoading(false)
    }
    fetchWithDistance()
  }, [myLat, myLng])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-4 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <a href="/" className="text-2xl">←</a>
          <div>
            <h1 className="text-xl font-bold text-orange-700">
              내 주변 한식뷔페
            </h1>
            <p className="text-xs text-gray-400">
              {locationFound
                ? "현재 위치 기준 가까운 순서로 표시"
                : "등록된 전체 한식뷔페 목록"}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {locationFound && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-sm text-green-700">
            현재 위치를 찾았습니다!
          </div>
        )}

        {locationError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 text-sm text-yellow-700">
            {locationError}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4 animate-pulse">📍</p>
            <p className="text-gray-500">가게 목록을 불러오는 중...</p>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🏪</p>
            <p className="text-gray-500">등록된 한식뷔페가 없습니다.</p>
            <a
              href="/owner/register"
              className="text-orange-600 underline text-sm mt-2 block"
            >
              가게를 등록해주세요!
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {restaurants.map((r, i) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        {i + 1}
                      </span>
                      <h3 className="font-bold text-gray-900">{r.name}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{r.address}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {r.price && (
                        <span className="text-sm text-orange-600 font-medium">
                          {r.price}원
                        </span>
                      )}
                      {r.phone && (
                        <a
                          href={"tel:" + r.phone}
                          className="text-sm text-blue-600"
                        >
                          {r.phone}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    {r.distance !== undefined && r.distance < 100 && (
                      <p className="text-lg font-bold text-orange-600">
                        {r.distance < 1
                          ? Math.round(r.distance * 1000) + "m"
                          : r.distance.toFixed(1) + "km"}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <a
                    href={
                      "https://map.kakao.com/link/search/" +
                      encodeURIComponent(r.address)
                    }
                    target="_blank"
                    className="flex-1 text-center bg-yellow-400 text-yellow-900 py-2 rounded-xl text-sm font-medium"
                  >
                    카카오맵
                  </a>
                  <a
                    href={
                      "https://map.naver.com/v5/search/" +
                      encodeURIComponent(r.address)
                    }
                    target="_blank"
                    className="flex-1 text-center bg-green-500 text-white py-2 rounded-xl text-sm font-medium"
                  >
                    네이버지도
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
