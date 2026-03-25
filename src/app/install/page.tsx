"use client"

import { useState } from "react"

export default function InstallPage() {
  const [tab, setTab] = useState<"iphone" | "android">("iphone")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b px-4 py-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-orange-700">
              🍚 오늘한끼 앱처럼 쓰기
            </h1>
            <p className="text-sm text-gray-400">
              홈 화면에 추가하면 앱처럼 사용할 수 있어요
            </p>
          </div>
          <a href="/" className="text-sm text-gray-400 hover:text-orange-600">
            ← 메인
          </a>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* 상단 안내 */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6 text-center">
          <p className="text-4xl mb-3">📱</p>
          <p className="text-base font-bold text-orange-800">
            앱 설치 없이 홈 화면에 추가!
          </p>
          <p className="text-sm text-orange-700 mt-1">
            별도 앱 다운로드 없이, 홈 화면에서 바로 접속할 수 있습니다
          </p>
        </div>

        {/* 아이폰 / 안드로이드 탭 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("iphone")}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition
              ${
                tab === "iphone"
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-600"
              }`}
          >
            🍎 아이폰 (iPhone)
          </button>
          <button
            onClick={() => setTab("android")}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition
              ${
                tab === "android"
                  ? "bg-green-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600"
              }`}
          >
            🤖 안드로이드
          </button>
        </div>

        {/* 아이폰 설명 */}
        {tab === "iphone" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border p-5">
              <div className="flex items-start gap-4">
                <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </span>
                <div>
                  <p className="font-bold text-gray-900">Safari로 접속하기</p>
                  <p className="text-sm text-gray-500 mt-1">
                    반드시 <span className="font-bold text-blue-600">Safari</span> 브라우저로
                    접속해야 합니다.
                    <br />
                    크롬이나 네이버 앱에서는 안 됩니다!
                  </p>
                  <div className="mt-2 bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">접속 주소:</p>
                    <p className="text-sm font-mono text-orange-600 font-bold">
                      오늘한끼 사이트 주소
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border p-5">
              <div className="flex items-start gap-4">
                <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </span>
                <div>
                  <p className="font-bold text-gray-900">공유 버튼 누르기</p>
                  <p className="text-sm text-gray-500 mt-1">
                    화면 하단 가운데에 있는
                    <span className="inline-block mx-1 bg-gray-100 px-2 py-0.5 rounded text-blue-600 font-bold">
                      ⬆️ 공유 버튼
                    </span>
                    을 누르세요
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    (네모에서 화살표가 위로 올라가는 모양)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border p-5">
              <div className="flex items-start gap-4">
                <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </span>
                <div>
                  <p className="font-bold text-gray-900">&quot;홈 화면에 추가&quot; 누르기</p>
                  <p className="text-sm text-gray-500 mt-1">
                    공유 메뉴에서 아래로 스크롤하면
                    <span className="inline-block mx-1 bg-gray-100 px-2 py-0.5 rounded font-bold">
                      ➕ 홈 화면에 추가
                    </span>
                    가 보입니다. 누르세요!
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border p-5">
              <div className="flex items-start gap-4">
                <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  4
                </span>
                <div>
                  <p className="font-bold text-gray-900">&quot;추가&quot; 누르기</p>
                  <p className="text-sm text-gray-500 mt-1">
                    이름이 &quot;오늘한끼&quot;로 되어있는 것을 확인하고
                    오른쪽 상단
                    <span className="inline-block mx-1 bg-orange-100 px-2 py-0.5 rounded text-orange-700 font-bold">
                      추가
                    </span>
                    를 누르세요
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
              <p className="text-3xl mb-2">🎉</p>
              <p className="font-bold text-green-800">완료!</p>
              <p className="text-sm text-green-700 mt-1">
                홈 화면에 오늘한끼 아이콘이 생겼습니다.
                <br />
                이제 앱처럼 터치 한 번으로 접속하세요!
              </p>
            </div>
          </div>
        )}

        {/* 안드로이드 설명 */}
        {tab === "android" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border p-5">
              <div className="flex items-start gap-4">
                <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </span>
                <div>
                  <p className="font-bold text-gray-900">Chrome으로 접속하기</p>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-bold text-blue-600">Chrome</span> 브라우저로
                    접속하세요.
                  </p>
                  <div className="mt-2 bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">접속 주소:</p>
                    <p className="text-sm font-mono text-orange-600 font-bold">
                      오늘한끼 사이트 주소
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border p-5">
              <div className="flex items-start gap-4">
                <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </span>
                <div>
                  <p className="font-bold text-gray-900">메뉴 버튼 누르기</p>
                  <p className="text-sm text-gray-500 mt-1">
                    화면 오른쪽 상단에
                    <span className="inline-block mx-1 bg-gray-100 px-2 py-0.5 rounded font-bold">
                      ⋮ 점 3개
                    </span>
                    버튼을 누르세요
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border p-5">
              <div className="flex items-start gap-4">
                <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </span>
                <div>
                  <p className="font-bold text-gray-900">&quot;홈 화면에 추가&quot; 또는 &quot;앱 설치&quot;</p>
                  <p className="text-sm text-gray-500 mt-1">
                    메뉴에서
                    <span className="inline-block mx-1 bg-gray-100 px-2 py-0.5 rounded font-bold">
                      📲 홈 화면에 추가
                    </span>
                    또는
                    <span className="inline-block mx-1 bg-gray-100 px-2 py-0.5 rounded font-bold">
                      앱 설치
                    </span>
                    를 누르세요
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    (안드로이드 버전에 따라 문구가 다를 수 있어요)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border p-5">
              <div className="flex items-start gap-4">
                <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  4
                </span>
                <div>
                  <p className="font-bold text-gray-900">&quot;추가&quot; 또는 &quot;설치&quot; 누르기</p>
                  <p className="text-sm text-gray-500 mt-1">
                    확인 팝업이 뜨면
                    <span className="inline-block mx-1 bg-orange-100 px-2 py-0.5 rounded text-orange-700 font-bold">
                      추가 / 설치
                    </span>
                    를 누르세요
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
              <p className="text-3xl mb-2">🎉</p>
              <p className="font-bold text-green-800">완료!</p>
              <p className="text-sm text-green-700 mt-1">
                홈 화면에 오늘한끼 아이콘이 생겼습니다.
                <br />
                이제 앱처럼 터치 한 번으로 접속하세요!
              </p>
            </div>
          </div>
        )}

        {/* 하단 돌아가기 */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-orange-700 transition"
          >
            🏠 메인 페이지로 돌아가기
          </a>
        </div>
      </div>
    </div>
  )
}
