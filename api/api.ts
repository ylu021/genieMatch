import { headers as APIHeaders } from "@/constants/apiHeaders";

export const fetchResponse = async (prompt: string, headers = {}) => {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  if (!API_URL) {
    return;
  }
  return fetch(API_URL, {
    method: "POST",
    headers: { ...APIHeaders, ...headers },
    body: JSON.stringify({ prompt }),
  })
    .then((res) => res.json())
    .catch((e) => console.error(e));
};
