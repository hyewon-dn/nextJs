import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");

    if (!path) {
      return NextResponse.json({ error: "path가 없습니다" }, { status: 400 });
    }

    const apiUrl = `${API_BASE_URL}${path}`;
    const accessToken = req.headers.get("Authorization");

    const apiResponse = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken || "",
      },
    });

    if (!apiResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data from API", status: apiResponse.status },
        { status: apiResponse.status }
      );
    }

    // 응답이 비어 있는 경우 처리
    const responseText = await apiResponse.text();
    if (!responseText) {
      return NextResponse.json(
        { error: "Empty response from API", status: apiResponse.status },
        { status: apiResponse.status }
      );
    }

    const data = JSON.parse(responseText);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");
    if (!path) {
      return NextResponse.json({ error: "path가 없습니다" }, { status: 400 });
    }

    const contentType = req.headers.get("Content-Type") || "application/json";
    const apiUrl = `${API_BASE_URL}${path}`;
    const accessToken = req.headers.get("Authorization") || "";

    let body;
    if (contentType.includes("application/json")) {
      body = JSON.stringify(await req.json());
    } else if (contentType.includes("multipart/form-data")) {
      body = await req.formData();
    } else {
      body = req.body;
    }

    const apiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: { Authorization: accessToken, "Content-Type": contentType },
      body,
    });

    const rawResponse = await apiResponse.text();

    if (!apiResponse.ok) {
      return NextResponse.json(
        {
          error: "API 호출 오류",
          status: apiResponse.status,
          message: rawResponse,
        },
        { status: apiResponse.status }
      );
    }

    if (!rawResponse) {
      return NextResponse.json(
        { error: "API 응답값이 없습니다", url: apiUrl },
        { status: 500 }
      );
    }

    try {
      return NextResponse.json(JSON.parse(rawResponse));
    } catch {
      console.error("❌ JSON 변환 실패:", rawResponse);
      return NextResponse.json(
        {
          error: "API의 JSON 응답값이 올바르지 않습니다",
          response: rawResponse,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Proxy error:", error);
    return NextResponse.json({ error: "NEXT 서버 에러" }, { status: 500 });
  }
}
