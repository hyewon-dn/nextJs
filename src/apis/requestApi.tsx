import axios, {
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

interface RequestApiConfig {
  method: "get" | "post" | "put" | "delete" | "patch";
  url: string;
  data?: Record<string, any> | FormData; // FormData를 추가로 받을 수 있도록 수정
  contentType?: any;
}

function extractToken(authorizationHeader: any) {
  // 큰따옴표 제거

  if (!authorizationHeader) return null;
  const cleanedHeader = authorizationHeader.replace(/^"|"$/g, "");

  // "Bearer " 로 시작하는지 확인
  if (!cleanedHeader.startsWith("Bearer ")) {
    return null; // 형식이 맞지 않으면 null 반환
  }

  // "Bearer " 부분 제거 후 반환
  return cleanedHeader.slice(7);
}

axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    let accessToken = localStorage.getItem("accessToken");
    accessToken = extractToken(accessToken);

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  }
);

axios.interceptors.response.use(
  (res: AxiosResponse): AxiosResponse => res,
  (err: AxiosError): Promise<number | undefined> => errorHandler(err) // 여기서 반환값 타입을 맞춰줌
);

const errorHandler = async (err: AxiosError): Promise<number | undefined> => {
  const { config, response } = err;

  if (response) {
    if (response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      alert("로그인 정보가 만료되었습니다. 다시 로그인 해주세요");
      window.location.reload();
    }
    return response.status; // response.status 반환
  } else {
    console.log("No response received");
    return undefined; // response가 없다면 undefined 반환
  }
};

export const requestApi = async (
  {
    method,
    url,
    data = {},
    contentType = "application/json",
  }: RequestApiConfig, // contentType 파라미터 추가
  ...theArgs: any[]
): Promise<AxiosResponse | AxiosError> => {
  try {
    const config: AxiosRequestConfig = {
      method,
      url,
      data,
      headers: {
        "Content-Type": contentType, // 요청할 때마다 Content-Type 설정
        ...(theArgs[0]?.headers || {}),
      },
      ...(theArgs[0] || {}),
    };

    //console.log(config);
    const res = await axios.request(config);
    return res;
  } catch (err) {
    console.log(err);
    return err as AxiosError;
  }
};
