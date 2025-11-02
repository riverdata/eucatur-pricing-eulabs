import { useSearchParams } from "react-router-dom";
import UpdatePasswordScreen from "./update-password";
import SendLinkEmailScreen from "./send-link-email";

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  if (token) {
    return <UpdatePasswordScreen token={token} />;
  }

  return <SendLinkEmailScreen />;
}
