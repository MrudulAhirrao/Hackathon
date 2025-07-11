import Cookies from "js-cookie";

export default async function apiCall(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  headers: Record<string, string> = {},
  isFormData: boolean = false
): Promise<any> {
  const token = Cookies.get("token") || "";
  let requestHeaders: Record<string, string> = {
    'X-Authorization': token,
    ...headers,
  };
  console.log("API Call:", { url, method, body, headers, isFormData });

  let options: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body) {
    if (isFormData) {
      // Remove Content-Type so browser sets it with boundary
      delete requestHeaders['Content-Type'];
      options.body = body;
    } else {
      requestHeaders['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }
  }

  const response = await fetch(url, options);
  return response;
}